import { MediaType } from '@atlaskit/media-common';

import { getImageDimensionsFromBlob } from './getImageDimensionsFromBlob';
import { getVideoDimensionsFromBlob } from './getVideoDimensionsFromBlob';

export type Dimensions = {
  width: number;
  height: number;
};

export const getDimensionsFromBlob = async (
  mediaType: MediaType,
  blob: Blob,
): Promise<Dimensions> => {
  switch (mediaType) {
    case 'image': {
      const url = URL.createObjectURL(blob);
      try {
        return await getImageDimensionsFromBlob(url);
      } finally {
        URL.revokeObjectURL(url);
      }
    }
    case 'video':
      return getVideoDimensionsFromBlob(blob);
    default:
      throw new Error(`Can't extract dimensions from ${mediaType}`);
  }
};
