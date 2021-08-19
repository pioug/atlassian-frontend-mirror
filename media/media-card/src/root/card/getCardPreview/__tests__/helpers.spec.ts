jest.mock('../../../../utils/videoSnapshot', () => ({
  takeSnapshot: jest.fn(() => 'video-preview'),
}));
jest.mock('@atlaskit/media-ui');
import { isRemotePreviewError, isLocalPreviewError } from '../../../../errors';
import { getOrientation } from '@atlaskit/media-ui';
import { MediaClient } from '@atlaskit/media-client';
import {
  getCardPreviewFromFilePreview,
  getCardPreviewFromBackend,
} from '../helpers';
import { takeSnapshot } from '../../../../utils/videoSnapshot';
import { asMockFunction } from '@atlaskit/media-test-helpers';

describe('getCardPreviewFromBackend()', () => {
  const mediaClient = ({
    getImage: jest.fn(() => 'some-blob'),
  } as unknown) as MediaClient;

  it('should throw a MediaCardError if getImage throws an error', async () => {
    const error = new Error('A Media Client Error');
    asMockFunction(mediaClient.getImage).mockRejectedValueOnce(error);
    let cardPreview;
    try {
      cardPreview = await getCardPreviewFromBackend(
        mediaClient,
        'some-id',
        { width: 33, height: 44 },
        'some-collection',
        'crop',
      );
    } catch (e) {
      expect(isRemotePreviewError(e)).toBe(true);
      expect(e.secondaryError).toBe(error);
    }
    expect(cardPreview).toBeUndefined();
  });

  it('should build the preview using the blob from mediaClient.getImage', async () => {
    const cardPreview = await getCardPreviewFromBackend(
      mediaClient,
      'some-id',
      { width: 33, height: 44 },
      'some-collection',
      'crop',
    );
    expect(cardPreview?.dataURI).toEqual(
      'mock result of URL.createObjectURL()',
    );
    expect(cardPreview.source).toEqual('remote');
    expect(cardPreview?.orientation).toEqual(1);
    expect(mediaClient.getImage).toBeCalledWith('some-id', {
      collection: 'some-collection',
      mode: 'crop',
      width: 33,
      height: 44,
      allowAnimated: true,
    });
  });

  it('should change mode from stretchy-fit to full-fit while passing down to getImage call', async () => {
    const cardPreview = await getCardPreviewFromBackend(
      mediaClient,
      'some-id',
      { width: 33, height: 44 },
      'some-collection',
      'stretchy-fit',
    );
    expect(cardPreview?.dataURI).toEqual(
      'mock result of URL.createObjectURL()',
    );
    expect(cardPreview?.orientation).toEqual(1);
    expect(mediaClient.getImage).toBeCalledWith('some-id', {
      collection: 'some-collection',
      mode: 'full-fit',
      width: 33,
      height: 44,
      allowAnimated: true,
    });
  });
});

describe('getCardPreviewFromFilePreview()', () => {
  beforeEach(() => {
    asMockFunction(takeSnapshot).mockClear();
  });

  it('should throw a MediaCardError from rejected preview promises', async () => {
    const error = new Error("File preview isn't ready");
    let cardPreview;
    try {
      cardPreview = await getCardPreviewFromFilePreview(Promise.reject(error));
    } catch (e) {
      expect(isLocalPreviewError(e)).toBe(true);
      expect(e.secondaryError).toBe(error);
    }
    expect(cardPreview).toBeUndefined();
  });

  it('should return data uri for images', async () => {
    const cardPreview = await getCardPreviewFromFilePreview({
      value: new File([], 'filename', { type: 'image/jpeg' }),
    });

    if (!cardPreview) {
      return expect(cardPreview).toBeDefined();
    }

    expect(cardPreview.dataURI).toEqual('mock result of URL.createObjectURL()');
    expect(cardPreview.source).toEqual('local');
  });

  it('should return orientation for images', async () => {
    (getOrientation as jest.Mock<any>).mockReset();
    (getOrientation as jest.Mock<any>).mockReturnValue(10);

    const blob = new File([], 'filename', { type: 'image/jpeg' });
    const cardPreview = await getCardPreviewFromFilePreview({ value: blob });

    if (!cardPreview) {
      return expect(cardPreview).toBeDefined();
    }

    expect(getOrientation).toHaveBeenCalledTimes(1);
    expect(getOrientation).toBeCalledWith(blob);
    expect(cardPreview.orientation).toEqual(10);
    expect(cardPreview.source).toEqual('local');
  });

  it('should throw a MediaCardError if video snapshot fails', async () => {
    const error = new Error("File preview isn't ready");
    asMockFunction(takeSnapshot).mockRejectedValueOnce(error);
    const filePreview = {
      value: new File([], 'filename', { type: 'video/mp4' }),
    };
    let cardPreview;
    try {
      cardPreview = await getCardPreviewFromFilePreview(filePreview);
    } catch (e) {
      expect(takeSnapshot).toBeCalledWith(filePreview.value);
      expect(isLocalPreviewError(e)).toBe(true);
      expect(e.secondaryError).toBe(error);
    }
    expect(cardPreview).toBeUndefined();
  });

  it('should return data uri for videos', async () => {
    const filePreview = {
      value: new File([], 'filename', { type: 'video/mp4' }),
    };
    const cardPreview = await getCardPreviewFromFilePreview(filePreview);

    if (!cardPreview) {
      return expect(cardPreview).toBeDefined();
    }

    expect(takeSnapshot).toBeCalledWith(filePreview.value);
    expect(cardPreview.dataURI).toEqual('video-preview');
    expect(cardPreview.source).toEqual('local');
  });

  it('should return default orientation for supported videos', async () => {
    const cardPreview = await getCardPreviewFromFilePreview({
      value: new File([], 'filename', { type: 'video/quicktime' }),
    });

    if (!cardPreview) {
      return expect(cardPreview).toBeDefined();
    }

    expect(cardPreview.orientation).toEqual(1);
    expect(cardPreview.source).toEqual('local');
  });
});
