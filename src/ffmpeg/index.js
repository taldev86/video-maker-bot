import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

export const getMediaData = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata);
    });
  });
};

/**
 * Generates a random interval of time to be used as the background of the video.
 * @param {*} video_length  Length of the video
 * @param {*} length_of_clip Length of the video to be used as the background
 */
const get_start_and_end_times = async (video_length, length_of_clip) => {
  // if the video is shorter than the length of the clip, return the video length
  if (video_length <= length_of_clip) {
    return { start_time: 0, end_time: video_length };
  }

  const start_time = Math.floor(Math.random() * video_length);
  // make sure the end time is not greater than the video length
  const end_time = start_time + length_of_clip;
  if (end_time > video_length) {
    return get_start_and_end_times(video_length, length_of_clip);
  }
  return { start_time, end_time };
};

/**
 * Generates the background video. The background video is a random clip from the original video.
 * @param {*} settings
 * @param {*} settings.file_path Path to the original video
 * @param {*} settings.length_of_clip Length of the video to be used as the background in seconds
 * @param {*} settings.background_file_path Path to the background video
 */
export const chop_background = async (settings) => {
  const { file_path, length_of_clip, background_file_path } = settings;
  const metadata = await getMediaData(file_path);
  const { format = {} } = metadata;
  const { duration: video_length } = format;

  const { start_time, end_time } = await get_start_and_end_times(
    video_length,
    length_of_clip
  );

  return new Promise((resolve, reject) => {
    ffmpeg(file_path)
      .setStartTime(start_time)
      .setDuration(length_of_clip)
      .on('end', () => resolve(background_file_path))
      .on('progress', (progress) => {
        const { timemark, currentKbps, targetSize } = progress;
        console.log(
          `Processing: ${timemark} ${currentKbps} ${targetSize} ${background_file_path}`
        );
      })
      .on('error', (err) => reject(err))
      .save(background_file_path);
  });
};

/**
 * Create a no audio video from a video file, an
 * @param {*} settings
 */
const prepare_background = async ({
  background_file_path,
  output_file_path,
  width,
  height,
  settings,
}) => {
  return new Promise((resolve, reject) => {
    const {
      wartermark: { enabled, text, color, size },
    } = settings;

    const ffmpegCmd = ffmpeg(background_file_path);

    // .filter("crop", f"ih*({W}/{H})", "ih")
    ffmpegCmd.videoFilter({
      filter: 'crop',
      options: `ih*(${width}/${height}):ih`,
    });
    // scale to width and height
    ffmpegCmd.videoFilter(`scale=${width}:${height}`);

    // draw text on the video, on bottom of the screen
    if (enabled && text) {
      ffmpegCmd.videoFilter(
        `drawtext=fontfile=fonts/Roboto-Regular.ttf:fontsize=${size}:fontcolor=${color}:x=(w-text_w)/2:y=main_h-30:text='${text}'`
      );
    }

    ffmpegCmd
      .on('start', (cmd) => {
        console.log('======Starting background video with no audio======');
      })
      .on('end', () => {
        console.log('======Finished building background video======');
        resolve(output_file_path);
      })
      .on('progress', (progress) => {
        const { timemark, currentKbps, targetSize } = progress;
        console.log(
          `Processing: ${timemark} ${currentKbps} ${targetSize} ${output_file_path}`
        );
      })
      .on('error', (err) => reject(err))
      .save(output_file_path);
  });
};

const create_audio_mixed_file = async (content) => {
  const { comments } = content;
  const audio_file_path = `assets/temp/${content.provider}/${content.id}/audio.mp3`;

  // concat all audio files of  comments into one audio file
  return new Promise((resolve, reject) => {
    const audio = ffmpeg();
    // title audio
    audio.input(content.audioPath);
    comments.forEach((c) => {
      audio.input(c.audioPath);
    });
    audio
      .on('start', (cmd) => {
        console.log('======Starting building audio file======');
      })
      .on('end', () => {
        console.log('======Finished building audio file======');
        resolve(audio_file_path);
      })
      .on('error', (err) => {
        reject(err);
      })
      .mergeToFile(audio_file_path);
  });
};

const merge_background_audio = async ({
  background_audio_path,
  audio_file_path,
  output_file_path,
  background_volume = 0.15,
}) => {
  // merge the background audio with the audio file
  // set volume of background audio to 0.15
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(background_audio_path)
      .input(audio_file_path)
      .complexFilter([
        {
          filter: 'volume',
          options: {
            volume: background_volume,
          },
          inputs: '0',
          outputs: 'background',
        },
        {
          filter: 'volume',
          options: {
            volume: 1,
          },
          inputs: '1',
          outputs: 'audio',
        },
        {
          filter: 'amix',
          options: {
            inputs: 2,
          },
          inputs: ['background', 'audio'],
        },
      ])
      .on('end', () => {
        console.log('======Finished merging audio files======');
        resolve(output_file_path);
      })
      .saveToFile(output_file_path);
  });
};

const addImageOverlaysToVideo = async ({
  inputVideoPath,
  imageOverlayInfoList,
}) => {
  const ffmpegCommand = ffmpeg(inputVideoPath);
  imageOverlayInfoList.forEach((imageOverlayInfo) => {
    const { imagePath } = imageOverlayInfo;
    ffmpegCommand.input(imagePath);
  });

  const complexFilters = imageOverlayInfoList.flatMap((info, index) => {
    const {
      startTimeInSec,
      endTimeInSec,
      xPosition = 0.5,
      yPosition = 0.5,
      width,
      rotation = 0,
    } = info;

    const overlayName = `overlay_${index}`;

    const inputName = index === 0 ? '0:v' : `result_${index - 1}`;
    const outputName =
      index < imageOverlayInfoList.length - 1 ? `result_${index}` : null;

    const scaleAndRotateFilter = `[${
      index + 1
    }:v]scale=w=${width}:h=-1,rotate=${rotation}*PI/180:c=none:ow=rotw(${rotation}*PI/180):oh=roth(${rotation}*PI/180)[${overlayName}]`;

    const overlayFilter = `[${inputName}][${overlayName}]overlay=W*${xPosition}-w/2:H*${yPosition}-h/2:enable='between(t,${startTimeInSec},${endTimeInSec})'${
      outputName ? `[${outputName}]` : ''
    }`;

    return [scaleAndRotateFilter, overlayFilter];
  });

  return ffmpegCommand.complexFilter(complexFilters);
};

/**
 * Gathers audio clips, gathers all screenshots, stitches them together and saves the final video to assets/temp
 */
export const makeFinalVideo = async ({
  bg_config,
  number_of_comments,
  length,
  content,
  settings,
}) => {
  const { opacity, resolution_height, resolution_width, background_volume } =
    settings;
  console.log(
    'resolution_width',
    resolution_width,
    'resolution_height',
    resolution_height
  );
  const background_video_final_path = await prepare_background({
    background_file_path: bg_config.background_video_path,
    output_file_path: `assets/temp/${content.provider}/${content.id}/background_no_audio.mp4`,
    width: resolution_width,
    height: resolution_height,
    settings,
  });

  // create a audio file from comments
  const audio_mixed_path = await create_audio_mixed_file(content);

  // merge background audio with audio file
  const background_audio_final_path = await merge_background_audio({
    background_audio_path: bg_config.background_audio_path,
    audio_file_path: audio_mixed_path,
    output_file_path: `assets/temp/${content.provider}/${content.id}/background_audio.mp3`,
    background_volume: background_volume,
  });

  // make a final video
  const resultPath = './results';

  // create folder if not exist
  if (!fs.existsSync(resultPath)) {
    fs.mkdirSync(resultPath);
  }

  // 90% of the screen
  const screenshot_width = Math.floor((resolution_width * 90) / 100);

  const buildFinalVideo = async () => {
    return new Promise(async (resolve, reject) => {
      // add image overlays

      const imageOverlayInfoList = [];
      // add title image overlay
      let currentTime = 0;
      imageOverlayInfoList.push({
        imagePath: content.screenshotPath,
        startTimeInSec: currentTime,
        endTimeInSec: content.titleLength,
        // height of image will be calculated based on the aspect ratio
        width: screenshot_width,
      });
      currentTime += content.titleLength;
      content.comments.forEach((c, index) => {
        const { screenshotPath, length } = c;
        imageOverlayInfoList.push({
          imagePath: screenshotPath,
          startTimeInSec: currentTime,
          endTimeInSec: currentTime + length,
          // height of image will be calculated based on the aspect ratio
          // because deviceScaleFactor is 2.8, we need to divide by 2.8
          width: screenshot_width,
        });
        currentTime += length;
      });

      const finaleVideoPath = `${resultPath}/${content.id}.mp4`;
      const ffmpegCommand = await addImageOverlaysToVideo({
        inputVideoPath: background_video_final_path,
        imageOverlayInfoList: imageOverlayInfoList,
      });

      // add audio
      ffmpegCommand.input(background_audio_final_path);
      ffmpegCommand
        .on('start', (cmd) => {
          console.log('======-o-======');
        })
        .on('end', () => {
          console.log('======Finished building background video======');
          resolve(finaleVideoPath);
        })
        .on('progress', (progress) => {
          const { timemark, currentKbps, targetSize } = progress;
          console.log(
            `Processing: ${timemark} ${currentKbps} ${targetSize} ${finaleVideoPath}`
          );
        })
        .save(finaleVideoPath);
    });
  };

  const finalVideoPath = await buildFinalVideo();

  return finalVideoPath;
};
