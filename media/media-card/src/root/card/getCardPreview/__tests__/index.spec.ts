jest.mock('../helpers');
jest.mock('../cache', () => ({ get: jest.fn(), set: jest.fn() }));
jest.mock('@atlaskit/media-client', () => {
  const actualModule = jest.requireActual('@atlaskit/media-client');
  return {
    __esModule: true,
    ...actualModule,
    addFileAttrsToUrl: jest.fn(),
  };
});
import { asMockFunction, fakeMediaClient } from '@atlaskit/media-test-helpers';
import {
  FilePreview,
  addFileAttrsToUrl,
  ProcessedFileState,
  FileState,
  MediaStoreGetFileImageParams,
  MediaBlobUrlAttrs,
} from '@atlaskit/media-client';
import { CardPreview } from '../../../../types';
import cardPreviewCache from '../cache';
import {
  getCardPreviewFromFilePreview,
  getCardPreviewFromBackend,
} from '../helpers';
import {
  CardPreviewParams,
  getCardPreview,
  shouldResolvePreview,
  getSSRCardPreview,
  fetchAndCacheRemotePreview,
} from '../';
import { LocalPreviewError } from '../../../../errors';
import * as filePreviewStatusModule from '../filePreviewStatus';
import * as dimensionComparerModule from '../../../../utils/dimensionComparer';
import { CardStatus } from '../../../../';

const localPreview: CardPreview = {
  dataURI: 'some-card-preview-from-file-preview',
  orientation: 66,
  source: 'local',
};
const remotePreview: CardPreview = {
  dataURI: 'some-card-preview-from-backend',
  orientation: 77,
  source: 'remote',
};

const mediaBlobUrlAttrs: MediaBlobUrlAttrs = {
  id: 'some-id',
  contextId: 'some-context',
};
const dataUriWithContext = 'some-data-uri-with-context';
(addFileAttrsToUrl as jest.Mock).mockReturnValue(dataUriWithContext);

const imageUrlParams: MediaStoreGetFileImageParams = {
  collection: 'some-collection-name',
  width: 55,
  height: 66,
  mode: 'crop',
};

// filePreview and isRemotePreviewReady have to be set in their relevant tests
const cardPreviewParams = ({
  mediaClient: { thisIs: 'some-media-client' },
  id: 'some-id',
  dimensions: { width: '33', height: '44' },
  imageUrlParams,
  mediaBlobUrlAttrs,
} as unknown) as CardPreviewParams;

const filePreview = ({
  thisIs: 'some-file-preview',
} as unknown) as FilePreview;

const remoteFetchParams = [
  cardPreviewParams.mediaClient,
  cardPreviewParams.id,
  cardPreviewParams.imageUrlParams,
];

describe('shouldResolvePreview()', () => {
  const dummyStatus = 'some-status' as CardStatus;

  const isPreviewableStatus = jest.spyOn(
    filePreviewStatusModule,
    'isPreviewableStatus',
  );

  const isBigger = jest.spyOn(dimensionComparerModule, 'isBigger');

  const processedFileState: ProcessedFileState = {
    status: 'processed',
    id: 'some-id',
    name: 'some-name',
    size: 1234,
    artifacts: {},
    mediaType: 'image',
    mimeType: 'image/png',
  };

  it('should return false if has peview or status is not previewable', () => {
    // Has preview
    isPreviewableStatus.mockReturnValueOnce(true);
    expect(
      shouldResolvePreview({
        status: dummyStatus,
        hasCardPreview: true,
        fileState: {} as FileState,
        isBannedLocalPreview: false,
      }),
    ).toBe(false);

    // Status not previewable
    isPreviewableStatus.mockReturnValueOnce(false);
    const fileState = {} as FileState;
    expect(
      shouldResolvePreview({
        status: dummyStatus,
        hasCardPreview: true,
        fileState,
        isBannedLocalPreview: false,
      }),
    ).toBe(false);
  });

  it('should return true if has peview, status is previewable and new dimensions are bigger', () => {
    isPreviewableStatus.mockReturnValueOnce(true);
    // enforcing bigger dimensions
    isBigger.mockReturnValueOnce(true);
    const result = shouldResolvePreview({
      status: dummyStatus,
      hasCardPreview: false,
      fileState: processedFileState,
      dimensions: {},
      prevDimensions: {},
      isBannedLocalPreview: false,
    });
    expect(result).toBe(true);
  });

  it('should return false if has peview, status is previewable and new dimensions are smaller', () => {
    isPreviewableStatus.mockReturnValueOnce(true);
    // enforcing smaller dimensions
    isBigger.mockReturnValueOnce(false);
    const result = shouldResolvePreview({
      status: dummyStatus,
      hasCardPreview: true,
      fileState: processedFileState,
      dimensions: {},
      prevDimensions: {},
      isBannedLocalPreview: false,
    });
    expect(result).toBe(false);
  });
});

describe('getCardPreview()', () => {
  beforeEach(() => {
    asMockFunction(cardPreviewCache.get).mockClear();
    asMockFunction(cardPreviewCache.set).mockClear();
  });

  it(`should return card preview from cache if exists`, async () => {
    asMockFunction(cardPreviewCache.get).mockReturnValueOnce({
      dataURI: 'some-card-preview-from-cache',
      source: 'cache-remote',
    });

    const cardPreview = await getCardPreview(cardPreviewParams);
    expect(cardPreview).toEqual(
      expect.objectContaining({
        dataURI: 'some-card-preview-from-cache',
        source: 'cache-remote',
      }),
    );
  });

  it('should return card preview from passed file preview', async () => {
    asMockFunction(getCardPreviewFromFilePreview).mockResolvedValueOnce(
      localPreview,
    );

    const cardPreview = await getCardPreview({
      ...cardPreviewParams,
      filePreview,
    });

    expect(getCardPreviewFromFilePreview).toBeCalledWith(filePreview);
    expect(addFileAttrsToUrl).toBeCalledWith(
      localPreview.dataURI,
      mediaBlobUrlAttrs,
    );

    const expectedResult = {
      dataURI: dataUriWithContext,
      orientation: localPreview.orientation,
      source: 'local',
    };
    const expectedCachedResult = {
      ...expectedResult,
      source: 'cache-local',
    };

    // The result must be cached
    expect(cardPreviewCache.set).toBeCalledWith(
      cardPreviewParams.id,
      cardPreviewParams.dimensions,
      expectedCachedResult,
    );
    expect(cardPreview).toEqual(expectedResult);
  });

  it('should return card preview from backend if there is no local preview and is image representation ready', async () => {
    asMockFunction(getCardPreviewFromBackend).mockResolvedValueOnce(
      remotePreview,
    );

    const expectedResult = {
      dataURI: dataUriWithContext,
      orientation: remotePreview.orientation,
      source: 'remote',
    };
    const expectedCachedResult = {
      ...expectedResult,
      source: 'cache-remote',
    };

    const cardPreview = await getCardPreview({
      ...cardPreviewParams,
      isRemotePreviewReady: true,
    });

    expect(getCardPreviewFromBackend).toBeCalledWith(...remoteFetchParams);
    expect(addFileAttrsToUrl).toBeCalledWith(
      localPreview.dataURI,
      mediaBlobUrlAttrs,
    );
    // The result must be cached
    expect(cardPreviewCache.set).toBeCalledWith(
      cardPreviewParams.id,
      cardPreviewParams.dimensions,
      expectedCachedResult,
    );
    expect(cardPreview).toEqual(expectedResult);
  });

  it('should throw local preview error and call onLocalPreviewError if there is no remote preview', async () => {
    const error = new Error('A file preview error');
    asMockFunction(getCardPreviewFromFilePreview).mockRejectedValueOnce(error);
    const onLocalPreviewError = jest.fn();
    let expectedError: Error | undefined;
    let cardPreview;
    try {
      cardPreview = await getCardPreview({
        ...cardPreviewParams,
        filePreview,
        onLocalPreviewError,
      });
    } catch (e) {
      expectedError = e;
    }
    expect(expectedError).toBe(error);
    expect(cardPreview).toBeUndefined();
    expect(onLocalPreviewError).toBeCalledWith(error);
  });

  it('should call onLocalPreviewError if error is not local-preview-unsupported', async () => {
    asMockFunction(getCardPreviewFromBackend).mockResolvedValueOnce(
      remotePreview,
    );
    const error = new Error('A file preview error');
    asMockFunction(getCardPreviewFromFilePreview).mockRejectedValueOnce(error);
    const onLocalPreviewError = jest.fn();

    await getCardPreview({
      ...cardPreviewParams,
      filePreview,
      isRemotePreviewReady: true,
      onLocalPreviewError,
    });

    expect(onLocalPreviewError).toBeCalledWith(error);
  });

  it('should not call onLocalPreviewError if error is local-preview-unsupported and remote preview is ready', async () => {
    asMockFunction(getCardPreviewFromBackend).mockResolvedValueOnce(
      remotePreview,
    );
    const error = new LocalPreviewError('local-preview-unsupported');
    asMockFunction(getCardPreviewFromFilePreview).mockRejectedValueOnce(error);
    const onLocalPreviewError = jest.fn();
    try {
      await getCardPreview({
        ...cardPreviewParams,
        filePreview,
        isRemotePreviewReady: true,
        onLocalPreviewError,
      });
    } catch (e) {}

    expect(onLocalPreviewError).not.toBeCalled();
  });

  it('should return card preview from backend if local preview fails and remote preview is ready', async () => {
    const error = new Error('A file preview error');
    asMockFunction(getCardPreviewFromBackend).mockResolvedValueOnce(
      remotePreview,
    );
    asMockFunction(getCardPreviewFromFilePreview).mockRejectedValueOnce(error);

    const expectedResult = {
      dataURI: dataUriWithContext,
      orientation: remotePreview.orientation,
      source: 'remote',
    };
    const expectedCachedResult = {
      ...expectedResult,
      source: 'cache-remote',
    };

    const cardPreview = await getCardPreview({
      ...cardPreviewParams,
      filePreview,
      isRemotePreviewReady: true,
    });

    expect(getCardPreviewFromBackend).toBeCalledWith(...remoteFetchParams);
    expect(addFileAttrsToUrl).toBeCalledWith(
      localPreview.dataURI,
      mediaBlobUrlAttrs,
    );
    // The result must be cached
    expect(cardPreviewCache.set).toBeCalledWith(
      cardPreviewParams.id,
      cardPreviewParams.dimensions,
      expectedCachedResult,
    );
    expect(cardPreview).toEqual(expectedResult);
  });

  it('should throw error from getCardPreviewFromBackend', async () => {
    const error = new Error('A file preview error');
    asMockFunction(getCardPreviewFromBackend).mockRejectedValueOnce(error);
    let expectedError: Error | undefined;
    let cardPreview;
    try {
      cardPreview = await getCardPreview({
        ...cardPreviewParams,
        isRemotePreviewReady: true,
      });
    } catch (e) {
      expectedError = e;
    }
    expect(expectedError).toBe(error);
    expect(cardPreview).toBeUndefined();
  });

  it('should throw an error if there is no cached preview, local preview or remote preview', async () => {
    let expectedError: Error | undefined;
    let cardPreview;
    try {
      cardPreview = await getCardPreview(cardPreviewParams);
    } catch (e) {
      expectedError = e;
    }
    expect(expectedError).toBeDefined();
    expect(cardPreview).toBeUndefined();
  });
});

describe('getSSRCardPreview', () => {
  it.each(['server', 'client'] as const)(
    'should build a card preview using Media Client when ssr is %s',
    (ssr) => {
      const mediaClient = fakeMediaClient();
      const ssrPreview = getSSRCardPreview(
        ssr,
        mediaClient,
        'some-id',
        imageUrlParams,
        mediaBlobUrlAttrs,
      );
      expect(mediaClient.getImageUrlSync).toBeCalledTimes(1);
      expect(ssrPreview).toEqual({
        dataURI: expect.any(String),
        source: `ssr-${ssr}`,
        orientation: 1,
      });
    },
  );
});

describe('fetchAndCacheRemotePreview', () => {
  it('should fetch the remote preview and store it in cache when ssr is client', async () => {
    asMockFunction(getCardPreviewFromBackend).mockResolvedValueOnce(
      remotePreview,
    );

    const expectedResult = {
      dataURI: dataUriWithContext,
      orientation: remotePreview.orientation,
      source: 'remote',
    };
    const expectedCachedResult = {
      ...expectedResult,
      source: 'cache-remote',
    };
    const {
      mediaClient,
      id,
      dimensions = {},
      imageUrlParams,
      mediaBlobUrlAttrs,
    } = cardPreviewParams;

    const cardPreview = await fetchAndCacheRemotePreview(
      mediaClient,
      id,
      dimensions,
      imageUrlParams,
      mediaBlobUrlAttrs,
    );

    expect(getCardPreviewFromBackend).toBeCalledWith(...remoteFetchParams);
    expect(addFileAttrsToUrl).toBeCalledWith(
      localPreview.dataURI,
      mediaBlobUrlAttrs,
    );
    // The result must be cached
    expect(cardPreviewCache.set).toBeCalledWith(
      cardPreviewParams.id,
      cardPreviewParams.dimensions,
      expectedCachedResult,
    );
    expect(cardPreview).toEqual(expectedResult);
  });
});
