import settings from '../config.js';
import { chop_background, makeFinalVideo } from '../ffmpeg/index.js';

import {
  download_background_video,
  download_background_audio,
} from './index.js';

const content = {
  url: 'https://reddit.com/r/CryptoCurrency/comments/19ahxah/spot_bitcoin_etfs_scoop_up_another_10600_btc_on/',
  title: 'Spot Bitcoin ETFs scoop up another 10,600 BTC on day 5',
  id: '19ahxah',
  isNsfw: false,
  threadPost: '',
  comments: [
    {
      body: 'Traditional finance completely took over the market',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19ahxah/spot_bitcoin_etfs_scoop_up_another_10600_btc_on/kil03xk/',
      id: 'kil03xk',
      audioPath: 'assets/temp/reddit/19ahxah/mp3/0.mp3',
      length: 2.429333,
      screenshotPath: 'assets/temp/reddit/19ahxah/png/comment_0.png',
    },
    {
      body: "They are buying over the counter for now, won't effect price for a while",
      url: 'https://reddit.com/r/CryptoCurrency/comments/19ahxah/spot_bitcoin_etfs_scoop_up_another_10600_btc_on/kikz6nm/',
      id: 'kikz6nm',
      audioPath: 'assets/temp/reddit/19ahxah/mp3/1.mp3',
      length: 3.604833,
      screenshotPath: 'assets/temp/reddit/19ahxah/png/comment_1.png',
    },
    {
      body: 'And price is still down 🤔',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19ahxah/spot_bitcoin_etfs_scoop_up_another_10600_btc_on/kilgtgj/',
      id: 'kilgtgj',
      audioPath: 'assets/temp/reddit/19ahxah/mp3/2.mp3',
      length: 2.742833,
      screenshotPath: 'assets/temp/reddit/19ahxah/png/comment_2.png',
    },
    {
      body: 'Seems like when the ETFs sell they do it on open market and when they buy it’s OTC. Pretty genius actually, force a price dump while you keep accumulating at cheaper prices until you have a much as you need.',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19ahxah/spot_bitcoin_etfs_scoop_up_another_10600_btc_on/kilzugl/',
      id: 'kilzugl',
      audioPath: 'assets/temp/reddit/19ahxah/mp3/3.mp3',
      length: 10.814667,
      screenshotPath: 'assets/temp/reddit/19ahxah/png/comment_3.png',
    },
    {
      body: "Why didn't GBTC lower their er Seems like collusion of sorts.",
      url: 'https://reddit.com/r/CryptoCurrency/comments/19ahxah/spot_bitcoin_etfs_scoop_up_another_10600_btc_on/kil7a9h/',
      id: 'kil7a9h',
      audioPath: 'assets/temp/reddit/19ahxah/mp3/4.mp3',
      length: 3.369833,
      screenshotPath: 'assets/temp/reddit/19ahxah/png/comment_4.png',
    },
    {
      body: 'maybe im stupid, but if blackrock buys 10.000 BTC why is the price descending',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19ahxah/spot_bitcoin_etfs_scoop_up_another_10600_btc_on/kim5jis/',
      id: 'kim5jis',
      audioPath: 'assets/temp/reddit/19ahxah/mp3/5.mp3',
      length: 6.112667,
      screenshotPath: 'assets/temp/reddit/19ahxah/png/comment_5.png',
    },
    {
      body: 'BTC is one of the best decentralised centralised investment you can make',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19ahxah/spot_bitcoin_etfs_scoop_up_another_10600_btc_on/kill46t/',
      id: 'kill46t',
      audioPath: 'assets/temp/reddit/19ahxah/mp3/6.mp3',
      length: 4.022833,
      screenshotPath: 'assets/temp/reddit/19ahxah/png/comment_6.png',
    },
    {
      body: "1. GBTC still has 581,000 bitcoin as of yesterday. I think most of that will eventually be sold.\n2. I'm an advisor, and I haven't gotten the green light to even discuss crypto with my clients. Compliance departments are terrified of Gensler. Adoption of bitcoin by brokerdealers and institutions is going to be slower than people think.",
      url: 'https://reddit.com/r/CryptoCurrency/comments/19ahxah/spot_bitcoin_etfs_scoop_up_another_10600_btc_on/kimmsx4/',
      id: 'kimmsx4',
      audioPath: 'assets/temp/reddit/19ahxah/mp3/7.mp3',
      length: 21.315833,
      screenshotPath: 'assets/temp/reddit/19ahxah/png/comment_7.png',
    },
  ],
  provider: 'reddit',
  audioPath: 'assets/temp/reddit/19ahxah/mp3/title.mp3',
  titleLength: 4.832667,
  length: 60,
  screenshotPath: 'assets/temp/reddit/19ahxah/png/title.png',
  updated_at: '2024-01-20T04:06:53.483Z',
};

const videoBackgroundPath = await download_background_video(
  settings.background.video
);
const audioBackgroundPath = await download_background_audio(
  settings.background.audio
);

// const background_video_path = await chop_background({
//   file_path: videoBackgroundPath,
//   length_of_clip: content.length,
//   background_file_path: `assets/temp/${content.provider}/${content.id}/background.mp4`,
// });

// const background_audio_path = await chop_background({
//   file_path: audioBackgroundPath,
//   length_of_clip: content.length,
//   background_file_path: `assets/temp/${content.provider}/${content.id}/background.mp3`,
// });

// console.log('==================', background_video_path, background_audio_path);
await makeFinalVideo({
  bg_config: {
    background_video_path: 'assets/temp/reddit/19ahxah/background.mp4',
    background_audio_path: 'assets/temp/reddit/19ahxah/background.mp3',
  },
  content,
  number_of_comments: content.comments.length,
  length: content.length,
  settings: settings.settings,
});

console.log('done');
