import { Actor, log } from 'apify';

import { RedditApi } from './api/reddit.js';
import { TTSEngineWrapper } from './tts/engine_wrapper.js';
import { TrendApiWrapper } from './api/api_wrapper.js';
import { AWSPolly } from './tts/aws_polly.js';
import { addVideo } from './utils/db.js';

import background_videos from './background_videos.js'
import background_audios from './background_audios.js'
import settings from './config.js';

import { RedditScreenShot } from './screenshot_downloaders/index.js';
import { chop_background, makeFinalVideo } from './ffmpeg/index.js';
import {
  download_background_video,
  download_background_audio,
} from './yt-dlp/index.js';

await Actor.init();

const input = await Actor.getInput();
log.info('Input:', input);

// random video and audio background
const random_background_video = background_videos[Math.floor(Math.random() * background_videos.length)];
const random_background_audio = background_audios[Math.floor(Math.random() * background_audios.length)];
settings.background.video = random_background_video;
settings.background.audio = random_background_audio;

// 1 get hot content from subreddit
const redditApi = new RedditApi();
const api = new TrendApiWrapper(redditApi);
let content = await api.run();

// 2. convert text to mp3 of content
const ttsEngine = new AWSPolly(settings.tts);
const tts = new TTSEngineWrapper({
  tts: ttsEngine,
  translator: null,
  content,
});
const comments = await tts.run();

content.length = tts.length;
content.comments = comments;

// 3. get screenshots of comments
const crawler = new RedditScreenShot({
  content,
  settings: {
    ...settings.reddit,
    resolution_width: settings.settings.resolution_width,
    resolution_height: settings.settings.resolution_height,
  },
});
content = await crawler.start();

// if video has not title screenshotPath then skip
if (!content.screenshotPath) {
  log.info('No screenshotPath, throw error');
  throw new Error('No screenshotPath for title');
}

// TODO, huhm, sometimes we could not capture all comments
// its because of problem with puppeteer
const finalComments = content.comments.filter((c) => c.screenshotPath);
content.comments = finalComments;
let length_of_clip = finalComments.reduce((acc, c) => acc + c.length, 0);
length_of_clip = Math.ceil(length_of_clip + content.titleLength);
log.info(`Length of video: ${length_of_clip}`);
content.length = length_of_clip;

// download background video and audio
const videoBackgroundPath = await download_background_video(
  settings.background.video
);
const audioBackgroundPath = await download_background_audio(
  settings.background.audio
);

const background_video_path = await chop_background({
  file_path: videoBackgroundPath,
  length_of_clip: length_of_clip,
  background_file_path: `assets/temp/${content.provider}/${content.id}/background.mp4`,
});

// if background volume is set, then prepare the background audio
// if (+settings.background.volume > 0) {
const background_audio_path = await chop_background({
  file_path: audioBackgroundPath,
  length_of_clip: length_of_clip,
  background_file_path: `assets/temp/${content.provider}/${content.id}/background.mp3`,
});
// }

// make a final video
await makeFinalVideo({
  bg_config: {
    background_video_path,
    background_audio_path,
  },
  content,
  number_of_comments: content.comments.length,
  length: content.length,
  settings: settings.settings,
});

// save content to db
await addVideo({
  ...content,
  updated_at: new Date().toISOString(),
});

await Actor.exit();
