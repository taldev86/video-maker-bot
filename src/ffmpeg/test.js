import { makeFinalVideo } from './index.js';
import settings from '../config.js';

const content = {
  url: 'https://reddit.com/r/AskReddit/comments/199l4za/whats_the_best_example_of_if_it_exists_theres/',
  title: 'Whats the best example of "If it exists theres porn of it. " ?',
  id: '199l4za',
  isNsfw: true,
  threadPost: '',
  comments: [
    {
      body: 'Dragons fucking cars.',
      url: 'https://reddit.com/r/AskReddit/comments/199l4za/whats_the_best_example_of_if_it_exists_theres/kiewxb9/',
      id: 'kiewxb9',
      audioPath: 'assets/temp/reddit/199l4za/mp3/0.mp3',
      length: 1.489,
      screenshotPath: 'assets/temp/reddit/199l4za/png/comment_0.png',
    },
    {
      body: 'Pokemon. \n\nSo. Much. PokePorn.',
      url: 'https://reddit.com/r/AskReddit/comments/199l4za/whats_the_best_example_of_if_it_exists_theres/kiey31o/',
      id: 'kiey31o',
      audioPath: 'assets/temp/reddit/199l4za/mp3/1.mp3',
      length: 3.813833,
      screenshotPath: 'assets/temp/reddit/199l4za/png/comment_1.png',
    },
    {
      body: 'Molly from Deep Rock Galactic',
      url: 'https://reddit.com/r/AskReddit/comments/199l4za/whats_the_best_example_of_if_it_exists_theres/kiev8y5/',
      id: 'kiev8y5',
      audioPath: 'assets/temp/reddit/199l4za/mp3/2.mp3',
      length: 1.802333,
      screenshotPath: 'assets/temp/reddit/199l4za/png/comment_2.png',
    },
    {
      body: 'Even Chernobyl has a porn.Fucking CHERNOBYL',
      url: 'https://reddit.com/r/AskReddit/comments/199l4za/whats_the_best_example_of_if_it_exists_theres/kifegk9/',
      id: 'kifegk9',
      audioPath: 'assets/temp/reddit/199l4za/mp3/3.mp3',
      length: 2.742833,
      screenshotPath: 'assets/temp/reddit/199l4za/png/comment_3.png',
    },
    {
      body: 'The pixar lamp and the I it stomps.',
      url: 'https://reddit.com/r/AskReddit/comments/199l4za/whats_the_best_example_of_if_it_exists_theres/kifcd6o/',
      id: 'kifcd6o',
      audioPath: 'assets/temp/reddit/199l4za/mp3/4.mp3',
      length: 2.220333,
      screenshotPath: 'assets/temp/reddit/199l4za/png/comment_4.png',
    },
    {
      body: 'Rule 34 The holy grail of human depravity.',
      url: 'https://reddit.com/r/AskReddit/comments/199l4za/whats_the_best_example_of_if_it_exists_theres/kieqjib/',
      id: 'kieqjib',
      audioPath: 'assets/temp/reddit/199l4za/mp3/5.mp3',
      length: 2.847333,
      screenshotPath: 'assets/temp/reddit/199l4za/png/comment_5.png',
    },
    {
      body: 'Going inside the cervix. \n\nI was genuinely studying the female reproductive system and said… you know what… drawings are nice, accurate and all. But what about getting to see the REAL thing. There’s no way they got it on the orange and black website right\n\n\nBoy was I wrong.',
      url: 'https://reddit.com/r/AskReddit/comments/199l4za/whats_the_best_example_of_if_it_exists_theres/kievhhj/',
      id: 'kievhhj',
      audioPath: 'assets/temp/reddit/199l4za/mp3/6.mp3',
      length: 17.92,
      screenshotPath: 'assets/temp/reddit/199l4za/png/comment_6.png',
    },
  ],
  provider: 'reddit',
  audioPath: 'assets/temp/reddit/199l4za/mp3/title.mp3',
  titleLength: 3.291333,
  length: 37,
  screenshotPath: 'assets/temp/reddit/199l4za/png/title.png',
  updated_at: '2024-01-18T16:54:05.805Z',
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
