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
import { getFilePreviewFromFileState } from '../../getFilePreviewFromFileState';

describe('getFilePreviewFromFileState()', () => {
  it('should not work for error state', async () => {
    const { src } = await getFilePreviewFromFileState({
      status: 'error',
      id: '1',
    });

    expect(src).toBeUndefined();
  });

  it('should not work for non previewable types', async () => {
    const { src } = await getFilePreviewFromFileState({
      status: 'processing',
      id: '1',
      name: '',
      size: 1,
      mediaType: 'doc',
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      representations: {},
    });

    expect(src).toBeUndefined();
  });

  it('should not work for processing failures', async () => {
    const { src } = await getFilePreviewFromFileState({
      status: 'failed-processing',
      id: '1',
      name: 'filename.heic',
      size: 1,
      mediaType: 'image',
      mimeType: 'image/heic',
      artifacts: {},
      representations: {},
    });

    expect(src).toBeUndefined();
  });

  it('should return data uri for images', async () => {
    const { src } = await getFilePreviewFromFileState({
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

    expect(src).toEqual('mock result of URL.createObjectURL()');
  });

  it('should return data uri for videos', async () => {
    const { src } = await getFilePreviewFromFileState({
      status: 'processed',
      id: '1',
      name: '',
      size: 1,
      mediaType: 'image',
      mimeType: 'image/png',
      preview: {
        value: new File([], 'filename', { type: 'video/mov' }),
      },
      artifacts: {},
      representations: {},
    });

    expect(src).toEqual('video-preview');
  });

  it('should return orientation for images', async () => {
    (getOrientation as jest.Mock<any>).mockReset();
    (getOrientation as jest.Mock<any>).mockReturnValue(10);

    const blob = new File([], 'filename', { type: 'image/jpeg' });
    const { orientation } = await getFilePreviewFromFileState({
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

    expect(getOrientation).toHaveBeenCalledTimes(1);
    expect(getOrientation).toBeCalledWith(blob);
    expect(orientation).toEqual(10);
  });

  it('should return default orientation for supported videos', async () => {
    const { orientation } = await getFilePreviewFromFileState({
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
    expect(orientation).toEqual(1);
  });
});
