import { makeFinalVideo } from './index.js';
import settings from '../config.js';

const content = {
  url: 'https://reddit.com/r/CryptoCurrency/comments/19dgcc6/saudi_arabia_qatar_rumored_1m_btc_buy_could_come/',
  title: 'Saudi Arabia, Qatar Rumored 1M BTC Buy Could Come Next Week: Analyst',
  id: '19dgcc6',
  isNsfw: false,
  threadPost: '',
  comments: [
    {
      body: "Ah yes, let's announce our purchase before purchasing to get frontran and buy at a higher price. 100 Bullshit article.",
      url: 'https://reddit.com/r/CryptoCurrency/comments/19dgcc6/saudi_arabia_qatar_rumored_1m_btc_buy_could_come/kj5masf/',
      id: 'kj5masf',
      audioPath: 'assets/temp/reddit/19dgcc6/mp3/0.mp3',
      length: 8.071833,
      screenshotPath: 'assets/temp/reddit/19dgcc6/png/comment_0.png',
    },
    {
      body: 'There’s a 0 chance of this happening next week',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19dgcc6/saudi_arabia_qatar_rumored_1m_btc_buy_could_come/kj5ms2x/',
      id: 'kj5ms2x',
      audioPath: 'assets/temp/reddit/19dgcc6/mp3/1.mp3',
      length: 2.6645,
      screenshotPath: 'assets/temp/reddit/19dgcc6/png/comment_1.png',
    },
    {
      body: "If they are genuinely planning to buy, then aren't they supposed to be planning to do it in secret instead of letting the whole world knows about it",
      url: 'https://reddit.com/r/CryptoCurrency/comments/19dgcc6/saudi_arabia_qatar_rumored_1m_btc_buy_could_come/kj5nujg/',
      id: 'kj5nujg',
      audioPath: 'assets/temp/reddit/19dgcc6/mp3/2.mp3',
      length: 8.202333,
      screenshotPath: 'assets/temp/reddit/19dgcc6/png/comment_2.png',
    },
    {
      body: 'whats the opposite of FUD',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19dgcc6/saudi_arabia_qatar_rumored_1m_btc_buy_could_come/kj5kjrs/',
      id: 'kj5kjrs',
      audioPath: 'assets/temp/reddit/19dgcc6/mp3/3.mp3',
      length: 1.3845,
      screenshotPath: 'assets/temp/reddit/19dgcc6/png/comment_3.png',
    },
    {
      body: 'And Im Joe Biden\n\nIll believe it when I see it. \n\nx200B\n\nbuys even more bitcoin',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19dgcc6/saudi_arabia_qatar_rumored_1m_btc_buy_could_come/kj5k0ru/',
      id: 'kj5k0ru',
      audioPath: 'assets/temp/reddit/19dgcc6/mp3/4.mp3',
      length: 7.68,
      screenshotPath: 'assets/temp/reddit/19dgcc6/png/comment_4.png',
    },
    {
      body: 'Get this garbage out of here.',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19dgcc6/saudi_arabia_qatar_rumored_1m_btc_buy_could_come/kj5t5lm/',
      id: 'kj5t5lm',
      audioPath: 'assets/temp/reddit/19dgcc6/mp3/5.mp3',
      length: 1.724,
      screenshotPath: 'assets/temp/reddit/19dgcc6/png/comment_5.png',
    },
    {
      body: 'Of course its gonna come... not.\nAlways those pathetic tries to pump...',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19dgcc6/saudi_arabia_qatar_rumored_1m_btc_buy_could_come/kj5ur01/',
      id: 'kj5ur01',
      audioPath: 'assets/temp/reddit/19dgcc6/mp3/6.mp3',
      length: 4.858667,
      screenshotPath: 'assets/temp/reddit/19dgcc6/png/comment_6.png',
    },
    {
      body: 'New hype rhymes by the market manipulators.',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19dgcc6/saudi_arabia_qatar_rumored_1m_btc_buy_could_come/kj5p66f/',
      id: 'kj5p66f',
      audioPath: 'assets/temp/reddit/19dgcc6/mp3/7.mp3',
      length: 3.082333,
      screenshotPath: 'assets/temp/reddit/19dgcc6/png/comment_7.png',
    },
    {
      body: 'Hah More like anal cyst\n\nNo way such deal would be telegraphed beforehand.',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19dgcc6/saudi_arabia_qatar_rumored_1m_btc_buy_could_come/kj5xd72/',
      id: 'kj5xd72',
      audioPath: 'assets/temp/reddit/19dgcc6/mp3/8.mp3',
      length: 4.780333,
      screenshotPath: 'assets/temp/reddit/19dgcc6/png/comment_8.png',
    },
    {
      body: 'We need to stop posting these type. Trying to hype it up',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19dgcc6/saudi_arabia_qatar_rumored_1m_btc_buy_could_come/kj5xv97/',
      id: 'kj5xv97',
      audioPath: 'assets/temp/reddit/19dgcc6/mp3/9.mp3',
      length: 3.866,
      screenshotPath: 'assets/temp/reddit/19dgcc6/png/comment_9.png',
    },
  ],
  provider: 'reddit',
  audioPath: 'assets/temp/reddit/19dgcc6/mp3/title.mp3',
  titleLength: 5.407333,
  length: 52,
  screenshotPath: 'assets/temp/reddit/19dgcc6/png/title.png',
  updated_at: '2024-01-23T08:34:48.618Z',
};

const background_video_path = `assets/temp/reddit/${content.id}/background.mp4`;
const background_audio_path = `assets/temp/reddit/${content.id}/background.mp3`;

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
