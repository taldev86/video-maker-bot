import ytdl from 'ytdl-core';
import fs from 'fs';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('yt-dlp');

const download = async ({ url, options, pathName }) => {
  return new Promise((resolve, reject) => {
    const video = ytdl(url, options);

    // save video to file
    video.pipe(fs.createWriteStream(pathName));

    // progress logging
    video.on('progress', (chunkLength, downloaded, total) => {
      const percent = downloaded / total;
      const downloadedMb = downloaded / 1000000;
      const totalMb = total / 1000000;
      console.log(
        `${(percent * 100).toFixed(2)}% downloaded ` +
          `${downloadedMb.toFixed(2)}MB of ${totalMb.toFixed(2)}MB`
      );
    });

    video.on('error', (err) => {
      logger.error(`Error downloading ${pathName}`);
      reject(err);
    });

    video.on('finish', () => {
      logger.info(`Finished downloading ${pathName}`);
      resolve();
    });
  });
};

const createFolderIfNotExist = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
};

export const download_background_video = async (settings) => {
  // create directory if not exist
  const path = './assets/backgrounds/video';
  createFolderIfNotExist(path);

  // if file exist, return filename
  if (fs.existsSync(`${path}/${settings.filename}`)) {
    logger.info(`The video ${settings.filename} already downloaded`);
    return `${path}/${settings.filename}`
  }

  const { url, filename } = settings;
  await download({
    url,
    pathName: `${path}/${filename}`,
    options: {
      quality: 'highest',
    },
  });

  return `${path}/${filename}`;
};

export const download_background_audio = async (settings) => {
  // create directory if not exist
  const path = './assets/backgrounds/audio';
  createFolderIfNotExist(path);
  const { url, filename } = settings;

  // if file exist, return filename
  if (fs.existsSync(`${path}/${filename}`)) {
    logger.info(`The audio ${filename} already downloaded`);
    return `${path}/${filename}`
  }

  await download({
    url,
    pathName: `${path}/${filename}`,
    options: {
      quality: 'highestaudio',
    },
  });

  return `${path}/${filename}`
};
