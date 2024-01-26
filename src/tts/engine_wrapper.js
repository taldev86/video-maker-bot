import fs from 'fs';

import { createLogger } from '../utils/logger.js';
import settings from '../config.js';
import { sanitizeText } from '../utils/helper.js';
import { getMediaData } from '../ffmpeg/index.js';

const logger = createLogger('engine_wrapper');

const DEFAULT_MAX_LENGTH_IN_SECONDS = 50; // 50 seconds. This is the max length of a clip. Some social media platforms have a limit of 60 seconds
export class TTSEngineWrapper {
  /**
   *
   * @param {*} engine
   * @param {*} content  {id: string, title: string, comments: {
   *  body: string,
   * }}
   */
  constructor({ tts, translator, content }) {
    this.tss = tts;
    this.translator = translator;
    this.content = content;
    this.path = `assets/temp/${content.provider}/${content.id}/mp3`;
    this.lastClipLength = 0;
    this.length = 0;

    this.lang = settings.reddit.post_lang;
    this.maxLengthInSeconds = DEFAULT_MAX_LENGTH_IN_SECONDS;
  }

  async run() {
    // create directory for content
    fs.mkdirSync(this.path, { recursive: true });
    logger.info(`Created directory for content ${this.path}`);

    const { title, comments } = this.content;
    // create mp3 for title
    logger.info(`Creating mp3 for title`);
    const { audioPath, length } = await this.callTTS('title', title);
    this.content.audioPath = audioPath;
    this.content.titleLength = length;

    // create mp3 for comments
    logger.info('=== Creating mp3 for comments ===');
    let idx = 0;
    const result = [];
    for (const comment of comments) {
      // Stop creating mp3 files if the length is greater than max length.
      if (this.length >= this.maxLengthInSeconds) {
        logger.info(`Max length reached. Stop creating mp3 files.`);
        break;
      }

      // create mp3 for comment
      logger.info(`Creating mp3 for comment ${idx}`);
      const data = await this.callTTS(`${idx}`, comment.body);
      result.push({
        ...comment,
        ...data,
      });
      idx += 1;
    }
    logger.info('=== Done creating mp3 for comments ===');

    return result;
  }

  async callTTS(fileName, text) {
    const newText = await this.processText(text);
    const path = `${this.path}/${fileName}.mp3`;
    await this.tss.run(newText, path);

    // after creating mp3, get length of mp3
    const metadata = await getMediaData(path);

    const { format = {} } = metadata;
    const { duration } = format;
    logger.info(`Created mp3 for ${path} with length ${duration}`);
    this.length += duration;
    this.lastClipLength = duration;

    return {
      audioPath: path,
      length: duration,
    };
  }

  /**
   * Translate text to language if lang is set
   * @param {*} text
   * @param {*} clean
   * @returns
   */
  async processText(text, clean = true) {
    let newText = clean ? sanitizeText(text) : text;
    if (this.lang) {
      // translate text to language
      logger.info(`Translating text to ${this.lang}`);
      newText = await this.translator?.translate(text, this.lang);
    }

    return newText;
  }
}
