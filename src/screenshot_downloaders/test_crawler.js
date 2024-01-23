import { RedditScreenShot } from './index.js';
import settings from '../config.js';

const content = {
  url: 'https://reddit.com/r/CryptoCurrency/comments/19bpsvs/vanguard_unfazed_by_boycott_calls_after_it/',
  title:
    "Vanguard unfazed by boycott calls after it refuses to offer Bitcoin ETFs: 'They won’t lose a single 401k plan over it'",
  id: '19bpsvs',
  isNsfw: false,
  threadPost: 'Soon to be regretted in a few years or less.',
  comments: [
    {
      body: 'Vanguard is literally the polar opposite of what crypto market is.\n\nExtreme volatility to the moon or homelessness vs slow steady but sure returns.\n\nPeople who get upset over this might as well be upset that Apple doesn’t make ProGamerZ Macs when gaming is so mainstream and a huge market to tap.\n\nThey’re just not interested in that market.',
      url: 'https://reddit.com/r/CryptoCurrency/comments/19bpsvs/vanguard_unfazed_by_boycott_calls_after_it/kitusr5/',
      id: 'kitusr5',
      audioPath: 'assets/temp/reddit/19bpsvs/mp3/0.mp3',
      length: 19.591833,
      screenshotPath: 'assets/temp/reddit/19bpsvs/png/comment_0.png',
    },
    {
      body: "I 'ed Vanguard on Twitter asking why they weren't offering it. This what they said and it's true. They also don't offer gold ETFs. It's the company ethos, not something btc specific.  \n\nHi Wellneedships, Bitcoin ETFs will not be available for purchase on our platform. We believe they do not align with our offer focused on asset classes equities, bonds, and cash that Vanguard views as the building blocks of a well-balanced, long-term investment portfolio. -Colleen",
      url: 'https://reddit.com/r/CryptoCurrency/comments/19bpsvs/vanguard_unfazed_by_boycott_calls_after_it/kitl333/',
      id: 'kitl333',
      audioPath: 'assets/temp/reddit/19bpsvs/mp3/1.mp3',
      length: 30.667667,
      screenshotPath: 'assets/temp/reddit/19bpsvs/png/comment_1.png',
    },
  ],
  provider: 'reddit',
  audioPath: 'assets/temp/reddit/19bpsvs/mp3/title.mp3',
  titleLength: 8.4375,
  length: 59,
  screenshotPath: 'assets/temp/reddit/19bpsvs/png/title.png',
  updated_at: '2024-01-21T09:30:03.311Z',
};

const crawler = new RedditScreenShot({
  content,
  settings: {
    ...settings.reddit,
    resolution_width: settings.settings.resolution_width,
    resolution_height: settings.settings.resolution_height,
  },
});
await crawler.start();
