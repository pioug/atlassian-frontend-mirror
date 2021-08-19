import { takeSnapshot } from '../../../utils/videoSnapshot';
import {
  MediaClient,
  FilePreview,
  ImageResizeMode,
  MediaType,
} from '@atlaskit/media-client';
import { getMediaTypeFromMimeType } from '@atlaskit/media-common';
import { getOrientation } from '@atlaskit/media-ui';
import { NumericalCardDimensions } from '../../..';
import { LocalPreviewError, RemotePreviewError } from '../../../errors';
import { CardPreview } from './types';

/**
 * This method tells the support for the media
 * types covered in getCardPreviewFromFilePreview
 */
export const isSupportedLocalPreview = (mediaType?: MediaType) =>
  mediaType === 'image' || mediaType === 'video';

const getImageLocalPreview = async (value: Blob): Promise<CardPreview> => {
  try {
    const orientation = await getOrientation(value as File);
    const dataURI = URL.createObjectURL(value);
    return {
      dataURI,
      orientation,
      source: 'local',
    };
  } catch (e) {
    throw new LocalPreviewError('local-preview-image', e);
  }
};

const getVideoLocalPreview = async (value: Blob): Promise<CardPreview> => {
  try {
    const dataURI = await takeSnapshot(value);
    return {
      dataURI,
      orientation: 1,
      source: 'local',
    };
  } catch (e) {
    throw new LocalPreviewError('local-preview-video', e);
  }
};

export const getCardPreviewFromFilePreview = async (
  filePreview: FilePreview | Promise<FilePreview>,
): Promise<CardPreview> => {
  let value;
  try {
    const resolvedFilePreview = await filePreview;
    value = resolvedFilePreview.value;
  } catch (e) {
    throw new LocalPreviewError('local-preview-rejected', e);
  }
  if (typeof value === 'string') {
    return {
      dataURI: value,
      orientation: 1,
      source: 'local',
    };
  } else if (value instanceof Blob) {
    const { type } = value;
    const mediaType = getMediaTypeFromMimeType(type);
    switch (mediaType) {
      case 'image':
        return getImageLocalPreview(value);
      case 'video':
        return getVideoLocalPreview(value);
    }
  }
  throw new LocalPreviewError('local-preview-unsupported');
};

export const getCardPreviewFromBackend = async (
  mediaClient: MediaClient,
  id: string,
  { width, height }: NumericalCardDimensions,
  collectionName?: string,
  resizeMode?: ImageResizeMode,
): Promise<CardPreview> => {
  try {
    const mode = resizeMode === 'stretchy-fit' ? 'full-fit' : resizeMode;
    const blob = await mediaClient.getImage(id, {
      collection: collectionName,
      mode,
      width,
      height,
      allowAnimated: true,
    });
    return {
      dataURI: URL.createObjectURL(blob),
      orientation: 1,
      source: 'remote',
    };
  } catch (e) {
    throw new RemotePreviewError('remote-preview-fetch', e);
  }
};
