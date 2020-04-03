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
import { getDataURIFromFileState } from '../../getDataURIFromFileState';

describe('getDataURIFromFileState()', () => {
  it('should not work for error state', async () => {
    const { src } = await getDataURIFromFileState({
      status: 'error',
      id: '1',
    });

    expect(src).toBeUndefined();
  });

  it('should not work for non previewable types', async () => {
    const { src } = await getDataURIFromFileState({
      status: 'processing',
      id: '1',
      name: '',
      size: 1,
      mediaType: 'doc',
      mimeType: 'application/pdf',
      preview: {
        value: new File([], 'filename', { type: 'text/plain' }),
      },
      representations: {},
    });

    expect(src).toBeUndefined();
  });

  it('should return data uri for images', async () => {
    const { src } = await getDataURIFromFileState({
      status: 'uploading',
      id: '1',
      name: '',
      size: 1,
      progress: 0.5,
      mediaType: 'image',
      mimeType: 'image/jpg',
      preview: {
        value: new File([], 'filename', { type: 'image/png' }),
      },
    });

    expect(src).toEqual('mock result of URL.createObjectURL()');
  });

  it('should return data uri for videos', async () => {
    const { src } = await getDataURIFromFileState({
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

    const blob = new File([], 'filename', { type: 'image/png' });
    const { orientation } = await getDataURIFromFileState({
      status: 'uploading',
      id: '1',
      name: '',
      size: 1,
      progress: 0.5,
      mediaType: 'image',
      mimeType: 'image/jpg',
      preview: {
        value: blob,
      },
    });

    expect(getOrientation).toHaveBeenCalledTimes(1);
    expect(getOrientation).toBeCalledWith(blob);
    expect(orientation).toEqual(10);
  });
});
