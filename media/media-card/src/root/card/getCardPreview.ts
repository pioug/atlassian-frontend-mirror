import VideoSnapshot from 'video-snapshot';
import {
  MediaClient,
  FileIdentifier,
  FileState,
  ImageResizeMode,
  getMediaTypeFromMimeType,
  isMimeTypeSupportedByBrowser,
  isPreviewableFileState,
  isImageRepresentationReady,
  isErrorFileState,
} from '@atlaskit/media-client';
import { getOrientation } from '@atlaskit/media-ui';
import { NumericalCardDimensions } from '../../';
import { MediaCardError } from '../../errors';

export interface CardPreview {
  dataURI?: string;
  orientation?: number;
}

export const getCardPreviewFromFileState = async (
  fileState: FileState,
): Promise<CardPreview | undefined> => {
  /**
   * We don't await on local preview for these following use cases:
   * - fileState is in error
   * - fileState isn't previewable
   * - media hasn't been processed and isn't natively supported by browser
   * - media has failed processing
   */
  if (
    isErrorFileState(fileState) ||
    !isPreviewableFileState(fileState) ||
    (!isMimeTypeSupportedByBrowser(fileState.mimeType) &&
      fileState.status !== 'processed') ||
    ['error', 'failed-processing'].includes(fileState.status)
  ) {
    return;
  }

  // TODO: implement more specific error handling
  // https://product-fabric.atlassian.net/browse/BMPT-1342
  try {
    const { value } = await fileState.preview;
    if (value instanceof Blob) {
      const { type } = value;
      const mediaType = getMediaTypeFromMimeType(type);

      if (mediaType === 'image') {
        const orientation = await getOrientation(value as File);
        const dataURI = URL.createObjectURL(value);

        return {
          dataURI,
          orientation,
        };
      }

      if (mediaType === 'video') {
        const snapshoter = new VideoSnapshot(value);
        const dataURI = await snapshoter.takeSnapshot();

        snapshoter.end();

        return {
          dataURI,
          orientation: 1,
        };
      }
    } else {
      return {
        dataURI: value,
        orientation: 1,
      };
    }
  } catch (e) {
    throw new MediaCardError('local-preview-get', e);
  }
};

export const getCardPreviewFromBackend = async (
  mediaClient: MediaClient,
  identifier: FileIdentifier,
  fileState: FileState,
  requestedDimensions: NumericalCardDimensions,
  resizeMode?: ImageResizeMode,
): Promise<CardPreview | undefined> => {
  const { id, collectionName } = identifier;
  const { width, height } = requestedDimensions;
  const mode = resizeMode === 'stretchy-fit' ? 'full-fit' : resizeMode;

  if (isImageRepresentationReady(fileState)) {
    try {
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
      };
    } catch (e) {
      throw new MediaCardError('remote-preview-fetch', e);
    }
  }
};
