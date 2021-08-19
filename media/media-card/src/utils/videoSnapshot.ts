import VideoSnapshot from 'video-snapshot';

export const takeSnapshot = async (blob: Blob) => {
  const snapshooter = new VideoSnapshot(blob);
  const dataUri = await snapshooter.takeSnapshot();
  snapshooter.end();
  return dataUri;
};
