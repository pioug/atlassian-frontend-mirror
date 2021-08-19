jest.mock('../helpers');
jest.mock('../cache', () => ({ get: jest.fn(), set: jest.fn() }));
jest.mock('@atlaskit/media-client', () => {
  const actualModule = jest.requireActual('@atlaskit/media-client');
  return {
    __esModule: true,
    ...actualModule,
    isPreviewableType: jest.fn(),
    isPreviewableFileState: jest.fn(),
    isImageRepresentationReady: jest.fn(
      () => 'isImageRepresentationReady-return',
    ),
  };
});
jest.mock('@atlaskit/media-common', () => {
  const actualModule = jest.requireActual('@atlaskit/media-common');
  return {
    __esModule: true,
    ...actualModule,
    isMimeTypeSupportedByBrowser: jest.fn(
      actualModule.isMimeTypeSupportedByBrowser,
    ),
  };
});

import { asMockFunction } from '@atlaskit/media-test-helpers';
import {
  FilePreview,
  FileState,
  isPreviewableType,
  isPreviewableFileState,
  isImageRepresentationReady,
  MediaType,
} from '@atlaskit/media-client';
import {
  MediaFeatureFlags,
  isMimeTypeSupportedByBrowser,
} from '@atlaskit/media-common';
import { CardPreview } from '../types';
import cardPreviewCache from '../cache';
import {
  getCardPreviewFromFilePreview,
  getCardPreviewFromBackend,
  isSupportedLocalPreview,
} from '../helpers';
import {
  CardPreviewParams,
  getCardPreview,
  extractFilePreviewStatus,
} from '../';
import { LocalPreviewError } from '../../../../errors';

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

const dataUriWithContext = 'some-data-uri-with-context';
const addContextToDataURI = jest.fn(() => dataUriWithContext);

// filePreview and isRemotePreviewReady have to be set in their relevant tests
const cardPreviewParams = ({
  mediaClient: { thisIs: 'some-media-client' },
  id: 'some-id',
  collectionName: 'some-collection-name',
  dimensions: { width: '33', height: '44' },
  requestedDimensions: { width: 55, height: 66 },
  resizeMode: 'crop',
  addContextToDataURI,
} as unknown) as CardPreviewParams;

const filePreview = ({
  thisIs: 'some-file-preview',
} as unknown) as FilePreview;

const remoteFetchParams = [
  cardPreviewParams.mediaClient,
  cardPreviewParams.id,
  cardPreviewParams.requestedDimensions,
  cardPreviewParams.collectionName,
  cardPreviewParams.resizeMode,
];

describe('getCardPreview()', () => {
  beforeEach(() => {
    asMockFunction(cardPreviewCache.get).mockClear();
    asMockFunction(cardPreviewCache.set).mockClear();
  });

  it(`should return card preview from cache if exists`, async () => {
    asMockFunction(cardPreviewCache.get).mockReturnValueOnce({
      dataURI: 'some-card-preview-from-cache',
      source: 'remote',
    });

    const cardPreview = await getCardPreview(cardPreviewParams);
    expect(cardPreview).toEqual(
      expect.objectContaining({
        dataURI: 'some-card-preview-from-cache',
        source: 'cache',
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
    expect(addContextToDataURI).toBeCalledWith(localPreview.dataURI);

    const expectedResult = {
      dataURI: dataUriWithContext,
      orientation: localPreview.orientation,
      source: 'local',
    };

    // The result must be cached
    expect(cardPreviewCache.set).toBeCalledWith(
      cardPreviewParams.id,
      cardPreviewParams.dimensions,
      expectedResult,
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

    const cardPreview = await getCardPreview({
      ...cardPreviewParams,
      isRemotePreviewReady: true,
    });

    expect(getCardPreviewFromBackend).toBeCalledWith(...remoteFetchParams);
    expect(addContextToDataURI).toBeCalledWith(remotePreview.dataURI);
    // The result must be cached
    expect(cardPreviewCache.set).toBeCalledWith(
      cardPreviewParams.id,
      cardPreviewParams.dimensions,
      expectedResult,
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

    const cardPreview = await getCardPreview({
      ...cardPreviewParams,
      filePreview,
      isRemotePreviewReady: true,
    });

    expect(getCardPreviewFromBackend).toBeCalledWith(...remoteFetchParams);
    expect(addContextToDataURI).toBeCalledWith(remotePreview.dataURI);
    // The result must be cached
    expect(cardPreviewCache.set).toBeCalledWith(
      cardPreviewParams.id,
      cardPreviewParams.dimensions,
      expectedResult,
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

describe('extractFilePreviewStatus()', () => {
  const dummyFeatureFlags = {} as MediaFeatureFlags;

  describe('Local Preview', () => {
    const mediaType = 'some-mediaType' as MediaType;
    const mimeType = 'some-mimeType';
    const fileState = { mediaType, mimeType } as FileState;

    beforeEach(() => {
      asMockFunction(isImageRepresentationReady).mockReturnValueOnce(false);
    });

    it('should check if no preview is available', () => {
      asMockFunction(isPreviewableFileState).mockReturnValueOnce(false);

      expect(
        extractFilePreviewStatus(fileState, dummyFeatureFlags),
      ).toMatchObject(expect.objectContaining({ hasPreview: false }));

      expect(isPreviewableFileState).toBeCalledWith(fileState);
      expect(isImageRepresentationReady).toBeCalledWith(fileState);
    });

    it('should check if a supported local preview is available', () => {
      asMockFunction(isPreviewableFileState).mockReturnValueOnce(true);
      asMockFunction(isSupportedLocalPreview).mockReturnValueOnce(true);
      asMockFunction(isMimeTypeSupportedByBrowser).mockReturnValueOnce(true);

      expect(
        extractFilePreviewStatus(fileState, dummyFeatureFlags),
      ).toMatchObject(expect.objectContaining({ hasPreview: true }));

      expect(isPreviewableFileState).toBeCalledWith(fileState);
      expect(isSupportedLocalPreview).toBeCalledWith(mediaType);
      expect(isMimeTypeSupportedByBrowser).toBeCalled();
    });

    it('should check if an unsupported by browser local preview is available', () => {
      asMockFunction(isPreviewableFileState).mockReturnValueOnce(true);
      asMockFunction(isSupportedLocalPreview).mockReturnValueOnce(false);
      asMockFunction(isMimeTypeSupportedByBrowser).mockReturnValueOnce(true);

      expect(
        extractFilePreviewStatus(fileState, dummyFeatureFlags),
      ).toMatchObject(expect.objectContaining({ hasPreview: false }));

      expect(isPreviewableFileState).toBeCalledWith(fileState);
      expect(isSupportedLocalPreview).toBeCalledWith(mediaType);
      expect(isMimeTypeSupportedByBrowser).toBeCalled();
    });

    it('should check if an unsupported by Media Card local preview is available', () => {
      asMockFunction(isPreviewableFileState).mockReturnValueOnce(true);
      asMockFunction(isSupportedLocalPreview).mockReturnValueOnce(true);
      asMockFunction(isMimeTypeSupportedByBrowser).mockReturnValueOnce(false);

      const mediaType = 'some-mediaType' as MediaType;
      const fileState = {
        mediaType: mediaType,
      } as FileState;
      expect(
        extractFilePreviewStatus(fileState, dummyFeatureFlags),
      ).toMatchObject(expect.objectContaining({ hasPreview: false }));

      expect(isPreviewableFileState).toBeCalledWith(fileState);
      expect(isSupportedLocalPreview).toBeCalledWith(mediaType);
      expect(isMimeTypeSupportedByBrowser).toBeCalled();
    });
  });

  it('should check if a remote preview is available', () => {
    asMockFunction(isImageRepresentationReady).mockReturnValueOnce(true);
    asMockFunction(isPreviewableFileState).mockReturnValueOnce(false);

    const fileState = {
      mediaType: 'some-mediaType' as MediaType,
    } as FileState;
    expect(
      extractFilePreviewStatus(fileState, dummyFeatureFlags),
    ).toMatchObject(expect.objectContaining({ hasPreview: true }));

    expect(isImageRepresentationReady).toBeCalledWith(fileState);
  });

  it('should check if media type is listed as previewable', () => {
    asMockFunction(isPreviewableType).mockReturnValueOnce(true);
    const mediaType = 'some-mediaType' as MediaType;
    const fileState = {
      mediaType: mediaType,
    } as FileState;

    expect(
      extractFilePreviewStatus(fileState, dummyFeatureFlags),
    ).toMatchObject(expect.objectContaining({ isPreviewable: true }));
    // Common helpers should be used for this operation
    expect(isPreviewableType).toBeCalledWith(mediaType, dummyFeatureFlags);
  });

  it(`should use file state's file size`, () => {
    const dummyFileStateWithoutSize = ({
      size: undefined,
    } as unknown) as FileState;
    const dummyFileStateWithSize = ({
      size: 1,
    } as unknown) as FileState;

    expect(
      extractFilePreviewStatus(dummyFileStateWithoutSize, dummyFeatureFlags),
    ).toMatchObject(
      expect.objectContaining({
        hasFilesize: false,
      }),
    );

    expect(
      extractFilePreviewStatus(dummyFileStateWithSize, dummyFeatureFlags),
    ).toMatchObject(
      expect.objectContaining({
        hasFilesize: true,
      }),
    );
  });
});
