import { ScreenShotCrawler } from './crawler.js';
import darkCookies from './data/cookie-dark-mode.js';
import lightCookies from './data/cookie-light-mode.js';

class RedditScreenShot extends ScreenShotCrawler {
  constructor({ content, settings = {} }) {
    super({ content, settings });
  }

  async getStartUrls() {
    return [
      {
        url: 'https://www.reddit.com/login',
        label: 'login',
        uniqueKey: `${Date.now()}-login`
      },
    ];
  }

  async requestHandler({ request, page, enqueueLinks }) {
    const {
      userData: { label },
    } = request;

    this.logger.info('request handler', {
      url: request.url,
      label,
    });

    switch (label) {
      case 'login': {
        this.logger.info('login page', {
          url: request.url,
          label,
        });
        // set cookies based on settings.theme
        const cookies =
          this.settings.theme === 'dark' ? darkCookies : lightCookies;

        // set cookies
        for (const cookie of cookies) {
          await page.setCookie(cookie);
        }

        //  login buton is button[class$="m-full-width"] or input[type="submit"]
        const loginSelector =
          'button[class$="m-full-width"], input[type="submit"]';
        await page.waitForSelector(loginSelector);
        await page.type('[name="username"]', this.settings.username);
        await page.type('[name="password"]', this.settings.password);

        await page.click(loginSelector);
        await page.waitForNavigation();

        // after login, we will add more requests to the queue
        // this can re-use same cookies
        this.logger.info('adding more requests to the queue', {
          url: this.content.url,
        });
        await this.requestQueue.addRequest({
          url: this.content.url,
          userData: { label: 'title' },
          uniqueKey: `${Date.now()}-title`,
        });

        this.content.comments.forEach(async (comment, index) => {
          await this.requestQueue.addRequest({
            url: comment.url,
            userData: { label: 'comment', index, commentId: comment.id },
            uniqueKey: `${Date.now()}-comment-${comment.id}`,
          });
        });

        break;
      }
      case 'title': {
        // wait for the title to load
        this.logger.info('waiting for title', {
          url: request.url,
        });
        await page.waitForSelector('[data-test-id="post-content"]');
        const titleElement = await page.$('[data-test-id="post-content"]');
        // screenshot the title
        await titleElement.screenshot({ path: `${this.path}/title.png` });

        // update the titlePath in content
        this.content.screenshotPath = `${this.path}/title.png`;
        break;
      }
      case 'comment': {
        const index = request.userData.index || 0;
        const commentId = `#t1_${request.userData.commentId}`;
        // wait for the comment to load
        this.logger.info('waiting for comment', {
          url: request.url,
          commentId,
        });
        await page.waitForSelector(commentId);
        const commentElement = await page.$(commentId);
        await commentElement.screenshot({
          path: `${this.path}/comment_${index}.png`,
        });

        // update screenshotPath in content
        this.content.comments.find(
          (item) => item.id === request.userData.commentId
        ).screenshotPath = `${this.path}/comment_${index}.png`;

        break;
      }
      default:
        break;
    }
  }
}

export default RedditScreenShot;
