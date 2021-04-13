jest.mock('video-snapshot', () => {
  class FakeVideoSnapshot {
    takeSnapshot() {
      return 'video-preview';
    }
    end() {}
  }
  return FakeVideoSnapshot;
});
jest.mock('@atlaskit/media-ui');
import { getOrientation } from '@atlaskit/media-ui';
import { getCardPreviewFromFileState } from '../../card/getCardPreview';
import { isMediaCardError } from '../../../errors';

describe('getCardPreviewFromFileState()', () => {
  it('should return undefined for error state', async () => {
    const cardPreview = await getCardPreviewFromFileState({
      status: 'error',
      id: '1',
    });

    expect(cardPreview).toBeUndefined();
  });

  it('should return undefined for non previewable types', async () => {
    const cardPreview = await getCardPreviewFromFileState({
      status: 'processing',
      id: '1',
      name: '',
      size: 1,
      mediaType: 'doc',
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      representations: {},
    });

    expect(cardPreview).toBeUndefined();
  });

  it('should return undefined for processing failures', async () => {
    const cardPreview = await getCardPreviewFromFileState({
      status: 'failed-processing',
      id: '1',
      name: 'filename.heic',
      size: 1,
      mediaType: 'image',
      mimeType: 'image/heic',
      artifacts: {},
      representations: {},
    });

    expect(cardPreview).toBeUndefined();
  });

  it('should return wrap and throw rejected preview promises in a MediaCardError', async () => {
    const anError = new Error("File preview isn't ready");
    try {
      await getCardPreviewFromFileState({
        status: 'processing',
        id: '1',
        name: 'video.mov',
        size: 1,
        mediaType: 'video',
        mimeType: 'video/quicktime',
        preview: Promise.reject(anError),
        artifacts: {},
        representations: {},
      });
    } catch (e) {
      expect(isMediaCardError(e)).toBe(true);
      expect(e).toMatchObject(
        expect.objectContaining({
          primaryReason: 'local-preview-get',
          secondaryError: anError,
        }),
      );
    }
  });

  it('should return data uri for images', async () => {
    const cardPreview = await getCardPreviewFromFileState({
      status: 'uploading',
      id: '1',
      name: '',
      size: 1,
      progress: 0.5,
      mediaType: 'image',
      mimeType: 'image/jpeg',
      preview: {
        value: new File([], 'filename', { type: 'image/jpeg' }),
      },
    });

    if (!cardPreview) {
      return expect(cardPreview).toBeDefined();
    }

    expect(cardPreview.dataURI).toEqual('mock result of URL.createObjectURL()');
  });

  it('should return data uri for videos', async () => {
    const cardPreview = await getCardPreviewFromFileState({
      status: 'processed',
      id: '1',
      name: '',
      size: 1,
      mediaType: 'image',
      mimeType: 'image/png',
      preview: {
        value: new File([], 'filename', { type: 'video/mp4' }),
      },
      artifacts: {},
      representations: {},
    });

    if (!cardPreview) {
      return expect(cardPreview).toBeDefined();
    }

    expect(cardPreview.dataURI).toEqual('video-preview');
  });

  it('should return orientation for images', async () => {
    (getOrientation as jest.Mock<any>).mockReset();
    (getOrientation as jest.Mock<any>).mockReturnValue(10);

    const blob = new File([], 'filename', { type: 'image/jpeg' });
    const cardPreview = await getCardPreviewFromFileState({
      status: 'uploading',
      id: '1',
      name: '',
      size: 1,
      progress: 0.5,
      mediaType: 'image',
      mimeType: 'image/jpeg',
      preview: {
        value: blob,
      },
    });

    if (!cardPreview) {
      return expect(cardPreview).toBeDefined();
    }

    expect(getOrientation).toHaveBeenCalledTimes(1);
    expect(getOrientation).toBeCalledWith(blob);
    expect(cardPreview.orientation).toEqual(10);
  });

  it('should return default orientation for supported videos', async () => {
    const cardPreview = await getCardPreviewFromFileState({
      status: 'processed',
      id: '1',
      name: '',
      size: 1,
      mediaType: 'video',
      mimeType: 'video/quicktime',
      preview: {
        value: new File([], 'filename', { type: 'video/quicktime' }),
      },
      artifacts: {},
      representations: {},
    });

    if (!cardPreview) {
      return expect(cardPreview).toBeDefined();
    }

    expect(cardPreview.orientation).toEqual(1);
  });
});
