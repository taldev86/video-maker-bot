import background_videos from './background_videos.js';
import background_audios from './background_audios.js';

// random video and audio background
const random_background_video =
  background_videos[Math.floor(Math.random() * background_videos.length)];
const random_background_audio =
  background_audios[Math.floor(Math.random() * background_audios.length)];

const config = {
  ai: {
    ai_similarity_enabled: false,
    ai_similarity_keywords: [],
  },
  reddit: {
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
    theme: 'dark', // light or dark theme

    subreddit: 'CryptoCurrency',
    min_comments: 20,
    min_comment_length: 10,
    max_comment_length: 500,
    post_lang: '', // does not use for now
    // day, hour, month, week, year, all.
    // if not set, it will use hot posts
    time_filter: 'day',
    //   post_id: "19bpsvs"
  },

  tts: {
    random_voice: true,
    aws_polly_voice: 'Matthew',
    creds: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    },
  },

  s3: {
    creds: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    },
    bucketName: process.env.AWS_S3_BUCKET,
  },

  settings: {
    // if set it true, your reddit account need accept in browser in first time
    allow_nsfw: true, // allow over 18 content
    resolution_width: 1080,
    resolution_height: 1920,
    opacity: 0.9,
    background_volume: 0,

    wartermark: {
      enabled: true,
      text: 'Video created by u/BinhBui',
      color: '#ffffff',
      size: 30,
    },
  },

  background: {
    video: random_background_video,
    audio: random_background_audio,
  },
};

export default config;
