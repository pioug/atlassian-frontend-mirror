jest.mock('@atlaskit/media-ui');
import { MediaClient } from '@atlaskit/media-client';
import { getOrientation } from '@atlaskit/media-ui';

import { isLocalPreviewError, isRemotePreviewError } from '../errors';

import { getLocalPreview, getRemotePreview } from './helpers';
import * as videoSnapshot from './videoSnapshot';

const takeSnapshot = jest
  .spyOn(videoSnapshot, 'takeSnapshot')
  .mockImplementation(async () => 'video-preview');

describe('getCardPreviewFromBackend()', () => {
  const mediaClient = {
    getImage: jest.fn(() => 'some-blob'),
  } as unknown as MediaClient;

  const params = {
    width: 33,
    height: 44,
    collection: 'some-collection',
    mode: 'crop' as const,
    allowAnimated: true,
  };

  it('should throw a MediaCardError if getImage throws an error', async () => {
    const error = new Error('A Media Client Error');
    (mediaClient.getImage as jest.Mock).mockRejectedValueOnce(error);
    let cardPreview;
    try {
      cardPreview = await getRemotePreview(mediaClient, 'some-id', params);
    } catch (e: any) {
      expect(isRemotePreviewError(e)).toBe(true);
      expect(e.secondaryError).toBe(error);
    }
    expect(cardPreview).toBeUndefined();
  });

  it('should build the preview using the blob from mediaClient.getImage', async () => {
    const cardPreview = await getRemotePreview(mediaClient, 'some-id', params, {
      traceId: 'some-trace-id',
    });
    expect(cardPreview?.dataURI).toEqual(
      'mock result of URL.createObjectURL()',
    );
    expect(cardPreview.source).toEqual('remote');
    expect(cardPreview?.orientation).toEqual(1);
    expect(mediaClient.getImage).toBeCalledWith(
      'some-id',
      params,
      undefined,
      undefined,
      { traceId: 'some-trace-id' },
    );
  });
});

describe('getCardPreviewFromFilePreview()', () => {
  beforeEach(() => {
    (takeSnapshot as jest.Mock).mockClear();
  });

  it('should throw a MediaCardError from rejected preview promises', async () => {
    const error = new Error("File preview isn't ready");
    let cardPreview;
    try {
      cardPreview = await getLocalPreview(Promise.reject(error));
    } catch (e: any) {
      expect(isLocalPreviewError(e)).toBe(true);
      expect(e.secondaryError).toBe(error);
    }
    expect(cardPreview).toBeUndefined();
  });

  it('should return data uri for images', async () => {
    const cardPreview = await getLocalPreview({
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
    const cardPreview = await getLocalPreview({ value: blob });

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
    takeSnapshot.mockRejectedValueOnce(error);
    const filePreview = {
      value: new File([], 'filename', { type: 'video/mp4' }),
    };
    let cardPreview;
    try {
      cardPreview = await getLocalPreview(filePreview);
    } catch (e: any) {
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
    const cardPreview = await getLocalPreview(filePreview);

    if (!cardPreview) {
      return expect(cardPreview).toBeDefined();
    }

    expect(takeSnapshot).toBeCalledWith(filePreview.value);
    expect(cardPreview.dataURI).toEqual('video-preview');
    expect(cardPreview.source).toEqual('local');
  });

  it('should return default orientation for supported videos', async () => {
    const cardPreview = await getLocalPreview({
      value: new File([], 'filename', { type: 'video/quicktime' }),
    });

    if (!cardPreview) {
      return expect(cardPreview).toBeDefined();
    }

    expect(cardPreview.orientation).toEqual(1);
    expect(cardPreview.source).toEqual('local');
  });
});
