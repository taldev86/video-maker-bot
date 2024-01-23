import { createLogger } from '../utils/logger.js';
import { Polly, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import * as fs from 'fs';

const logger = createLogger('aws-polly');
const VOICES_LIST = [
  'Brian',
  'Emma',
  'Russell',
  'Joey',
  'Matthew',
  'Joanna',
  'Kimberly',
  'Amy',
  'Geraint',
  'Nicole',
  'Justin',
  'Ivy',
  'Kendra',
  'Salli',
  'Raveena',
];

export class AWSPolly {
  constructor(settings = {}) {
    // the max length of text that can be converted to mp3
    this.maxCharacters = 1500;
    const { random_voice, aws_polly_voice = 'Matthew', creds } = settings;
    this.settings = settings;
    this.polly = new Polly({
      ...(creds && creds.accessKeyId && { credentials: creds }),
    });
  }

  async run(text, path) {
    logger.info(`Creating mp3 for ${text}...`);

    const voice = this.settings.random_voice
      ? VOICES_LIST[Math.floor(Math.random() * VOICES_LIST.length)]
      : this.settings.aws_polly_voice;

    const command = new SynthesizeSpeechCommand({
      OutputFormat: 'mp3',
      // TODO, how to handle this?
      Text: text.slice(0, this.maxCharacters), // this makes sure that the text is not too long
      TextType: 'text',
      VoiceId: voice,
    });

    const data = await this.polly.send(command);

    return new Promise((resolve, reject) => {
      data.AudioStream.on('error', (err) => {
        logger.error(`Error creating mp3 for ${text}`);
        reject(err);
      });
      data.AudioStream.on('close', () => {
        logger.info(`Done creating mp3 for ${text}`);
        resolve(path);
      });
      data.AudioStream.pipe(fs.createWriteStream(path));
    });
  }
}
