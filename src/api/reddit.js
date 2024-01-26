import snoowrap from 'snoowrap';

import settings from '../config.js';
import logger from '../utils/logger.js';
import { sanitizeText } from '../utils/helper.js';

// Create a new snoowrap requester with OAuth credentials.
const r = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

const VALID_TIME_FILTERS = ['day', 'hour', 'month', 'week', 'year', 'all'];
export class RedditApi {
  constructor(dataset) {
    this.dataset = dataset;
  }

  async parse() {
    const postId = settings.reddit.post_id;
    logger.info('Getting subreddit threads...', postId);

    const subRedditName = settings.reddit.subreddit || 'AskReddit';
    const subreddit = await r.getSubreddit(subRedditName);

    let submission = null;
    if (postId) {
      submission = await r.getSubmission(postId).refresh();
    } else if (settings.ai.ai_similarity_enabled) {
      throw new Error('Not implemented');
    } else if (settings.reddit.time_filter) {
      console.log(
        'settings.reddit.time_filter',
        settings.reddit.time_filter
      );
      const threads = await subreddit.getTop({
        time: settings.reddit.time_filter,
        limit: 25,
      });
      submission = await this.getSubredditUndone({
        submissions: threads,
        times_checked: 0,
        subredditName: subRedditName,
      });
    } else {
      // https://www.reddit.com/dev/api/#GET_top
      const threads = await subreddit.getHot({
        limit: 25,
      });
      submission = await this.getSubredditUndone({
        submissions: threads,
        times_checked: 0,
        subredditName: subRedditName,
      });
    }

    if (!submission) {
      throw new Error('No submission found');
    }

    const content = {
      url: `https://reddit.com${submission.permalink}`,
      title: submission.title,
      id: submission.id,
      isNsfw: submission.over_18,
      threadPost: submission.selftext,
      comments: [],
      provider: 'reddit',
      author: submission.author.name,
    };

    // add comments to content
    logger.info('Getting comments...');
    let comments = await submission.comments.fetchAll({
      amount: 1000,
      //   skipReplies: true,
    });
    logger.info(`Found ${comments.length} comments`);

    comments = comments
      .filter((comment) => {
        // if comment is deleted, skip
        if (comment.body === '[deleted]') {
          return false;
        }
        // if comment is too short, skip
        if (comment.body.length < settings.reddit.min_comment_length) {
          return false;
        }

        // if comment is too long, skip
        if (comment.body.length > settings.reddit.max_comment_length) {
          return false;
        }

        // if comment is stickied, skip
        if (comment.stickied) {
          return false;
        }

        // if comment is no author, skip
        if (!comment.author) {
          return false;
        }

        const sanitize = sanitizeText(comment.body);
        if (!sanitize || sanitize.length === 0) {
          return false;
        }

        return true;
      })
      .map((comment) => {
        return {
          body: sanitizeText(comment.body),
          url: `https://reddit.com${comment.permalink}`,
          id: comment.id,
        };
      });
    logger.info(`Found ${comments.length} top level comments`);
    content.comments = comments;

    logger.info('Finished getting subreddit threads');
    return content;
  }

  async getSubredditUndone({ submissions, times_checked = 0, subredditName }) {
    const store = await this.dataset.getData();
    const doneVideos = store.items || [];

    // filter out videos that have already been done
    const undoneVideos = submissions.filter((submission) => {
      return !doneVideos.some(
        (video) => video.id === submission.id && video.provider === 'reddit'
      );
    });

    // loop through the submissions and find one that has not been done
    const submission = undoneVideos.find((s) => {
      if (s.over_18 && !settings.settings.allow_nsfw) {
        logger.info('NSFW settings not defined. Skipping NSFW post...', s.id);
        return false;
      }

      if (s.stickied) {
        logger.info('This post was pinned by moderators. Skipping..', s.id);
        return false;
      }

      // min_comments
      if (s.num_comments < settings.reddit.min_comments) {
        logger.info(
          `This post does not have enough comments. Skipping... ${s.id}`
        );
        return false;
      }

      return true;
    });

    if (!submission) {
      logger.info('No more submissions to generate videos from.');
      const index = times_checked + 1;

      if (index === VALID_TIME_FILTERS.length) {
        logger.info(
          `No more submissions to generate videos from after ${times_checked} checks.`
        );
        return null;
      }

      // get submissions from a different time filter
      const time_filter = VALID_TIME_FILTERS[index];
      logger.info(`Getting submissions from time filter: ${time_filter}`);
      const threads = await r.getTop(subredditName, {
        time: time_filter,
        limit: 50,
      });

      return this.getSubredditUndone({
        submissions: threads,
        times_checked: index,
        subredditName,
      });
    }

    return submission;
  }
}
