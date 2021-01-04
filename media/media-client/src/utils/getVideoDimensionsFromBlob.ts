import VideoSnapshot from 'video-snapshot';

export type Dimensions = {
  width: number;
  height: number;
};

export const getVideoDimensionsFromBlob = async (
  blob: Blob,
  snapshoter = new VideoSnapshot(blob),
): Promise<Dimensions> => {
  try {
    return await snapshoter.getDimensions();
  } finally {
    snapshoter.end();
  }
};
