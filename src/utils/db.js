import { JSONFilePreset } from 'lowdb/node';

const defaultData = {
  videos: [],
};
const db = await JSONFilePreset('db.json', defaultData);

export const getVideos = async () => {
  return db.data.videos;
};

export const addVideo = async (video) => {
  // check if video already exists then update
  const index = db.data.videos.findIndex((v) => v.id === video.id);
  if (index !== -1) {
    db.data.videos[index] = video;
  } else {
    db.data.videos.push(video);
  }
  await db.write();
  return video;
};

export const updateVideo = async (video) => {
  const index = db.data.videos.findIndex((v) => v.id === video.id);
  db.data.videos[index] = video;
  await db.write();
  return video;
};

export const deleteVideo = async (video) => {
  const index = db.data.videos.findIndex((v) => v.id === video.id);
  db.data.videos.splice(index, 1);
  await db.write();
  return video;
};

export const getVideo = async (id) => {
  return db.data.videos.find((v) => v.id === id);
};
