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
jest.mock('@atlaskit/media-client', () => {
  const actualModule = jest.requireActual('@atlaskit/media-client');
  return {
    __esModule: true,
    ...actualModule,
    addFileAttrsToUrl: jest.fn(),
    isPreviewableType: jest.fn(),
    isPreviewableFileState: jest.fn(),
    isImageRepresentationReady: jest.fn(
      () => 'isImageRepresentationReady-return',
    ),
  };
});
jest.mock('../helpers');
import { asMockFunction } from '@atlaskit/media-test-helpers';
import {
  FileState,
  isPreviewableType,
  isPreviewableFileState,
  isImageRepresentationReady,
  MediaType,
} from '@atlaskit/media-client';
import { isMimeTypeSupportedByBrowser } from '@atlaskit/media-common';
import { isSupportedLocalPreview } from '../helpers';
import {
  extractFilePreviewStatus,
  isPreviewableStatus,
} from '../filePreviewStatus';
import { CardStatus } from '../../../types';

describe('extractFilePreviewStatus()', () => {
  const dummyFeatureFlags = {};

  describe('Local Preview', () => {
    const mediaType = 'some-mediaType' as MediaType;
    const mimeType = 'some-mimeType';
    const fileState = { mediaType, mimeType } as FileState;

    beforeEach(() => {
      (isImageRepresentationReady as jest.Mock).mockReturnValueOnce(false);
    });

    it('should check if no preview is available', () => {
      asMockFunction(isPreviewableFileState).mockReturnValueOnce(false);

      expect(
        extractFilePreviewStatus(fileState, false, dummyFeatureFlags),
      ).toMatchObject(expect.objectContaining({ hasPreview: false }));

      expect(isPreviewableFileState).toBeCalledWith(fileState);
      expect(isImageRepresentationReady).toBeCalledWith(fileState);
    });

    it('should check if a supported local preview is available and not banned', () => {
      asMockFunction(isPreviewableFileState).mockReturnValueOnce(true);
      asMockFunction(isSupportedLocalPreview).mockReturnValueOnce(true);
      asMockFunction(isMimeTypeSupportedByBrowser).mockReturnValueOnce(true);

      expect(
        extractFilePreviewStatus(fileState, false, dummyFeatureFlags),
      ).toMatchObject(expect.objectContaining({ hasPreview: true }));

      expect(isPreviewableFileState).toBeCalledWith(fileState);
      expect(isSupportedLocalPreview).toBeCalledWith(mediaType);
      expect(isMimeTypeSupportedByBrowser).toBeCalled();
    });

    it('should check if a supported local preview is available and banned', () => {
      asMockFunction(isPreviewableFileState).mockReturnValueOnce(true);
      asMockFunction(isSupportedLocalPreview).mockReturnValueOnce(true);
      asMockFunction(isMimeTypeSupportedByBrowser).mockReturnValueOnce(true);

      expect(
        extractFilePreviewStatus(fileState, true, dummyFeatureFlags),
      ).toMatchObject(expect.objectContaining({ hasPreview: false }));

      expect(isPreviewableFileState).toBeCalledWith(fileState);
      expect(isSupportedLocalPreview).toBeCalledWith(mediaType);
      expect(isMimeTypeSupportedByBrowser).toBeCalled();
    });

    it('should check if an unsupported by browser local preview is available', () => {
      asMockFunction(isPreviewableFileState).mockReturnValueOnce(true);
      asMockFunction(isSupportedLocalPreview).mockReturnValueOnce(true);
      asMockFunction(isMimeTypeSupportedByBrowser).mockReturnValueOnce(false);

      expect(
        extractFilePreviewStatus(fileState, false, dummyFeatureFlags),
      ).toMatchObject(expect.objectContaining({ hasPreview: false }));

      expect(isPreviewableFileState).toBeCalledWith(fileState);
      expect(isSupportedLocalPreview).toBeCalledWith(mediaType);
      expect(isMimeTypeSupportedByBrowser).toBeCalled();
    });

    it('should check if an unsupported by Media Card local preview is available', () => {
      asMockFunction(isPreviewableFileState).mockReturnValueOnce(true);
      asMockFunction(isSupportedLocalPreview).mockReturnValueOnce(false);
      asMockFunction(isMimeTypeSupportedByBrowser).mockReturnValueOnce(true);

      const mediaType = 'some-mediaType' as MediaType;
      const fileState = {
        mediaType: mediaType,
      } as FileState;
      expect(
        extractFilePreviewStatus(fileState, false, dummyFeatureFlags),
      ).toMatchObject(expect.objectContaining({ hasPreview: false }));

      expect(isPreviewableFileState).toBeCalledWith(fileState);
      expect(isSupportedLocalPreview).toBeCalledWith(mediaType);
      expect(isMimeTypeSupportedByBrowser).toBeCalled();
    });
  });

  it('should check if a remote preview is available', () => {
    (isImageRepresentationReady as jest.Mock).mockReturnValueOnce(true);
    asMockFunction(isPreviewableFileState).mockReturnValueOnce(false);

    const fileState = {
      mediaType: 'some-mediaType' as MediaType,
    } as FileState;
    expect(
      extractFilePreviewStatus(fileState, false, dummyFeatureFlags),
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
      extractFilePreviewStatus(fileState, false, dummyFeatureFlags),
    ).toMatchObject(expect.objectContaining({ isPreviewable: true }));
    // Common helpers should be used for this operation
    expect(isPreviewableType).toBeCalledWith(mediaType, dummyFeatureFlags);
  });

  it(`should use file state's file size`, () => {
    const dummyFileStateWithoutSize = {
      size: undefined,
    } as unknown as FileState;
    const dummyFileStateWithSize = {
      size: 1,
    } as unknown as FileState;

    expect(
      extractFilePreviewStatus(
        dummyFileStateWithoutSize,
        false,
        dummyFeatureFlags,
      ),
    ).toMatchObject(
      expect.objectContaining({
        hasFilesize: false,
      }),
    );

    expect(
      extractFilePreviewStatus(
        dummyFileStateWithSize,
        false,
        dummyFeatureFlags,
      ),
    ).toMatchObject(
      expect.objectContaining({
        hasFilesize: true,
      }),
    );
  });
});

describe('isPreviewableStatus', () => {
  const filePreviewStatus = {
    hasPreview: false,
    isPreviewable: false,
    isSupportedByBrowser: false,
    hasFilesize: false,
  };

  it.each(['uploading', 'loading-preview', 'complete'] as const)(
    'should return true if card status is %s and file preview status has preview and is previewable',
    (status) => {
      expect(
        isPreviewableStatus(status, {
          ...filePreviewStatus,
          hasPreview: true,
          isPreviewable: true,
        }),
      ).toBe(true);
    },
  );

  it.each([
    'uploading',
    'processing',
    'loading-preview',
    'failed-processing',
    'error',
    'complete',
  ] as const)(
    'should return false if card status is uploading and file preview status has not preview or is not previewable',
    (status) => {
      expect(
        isPreviewableStatus(status, {
          ...filePreviewStatus,
          isPreviewable: true,
        }),
      ).toBe(false);
      expect(
        isPreviewableStatus(status, {
          ...filePreviewStatus,
          hasPreview: true,
        }),
      ).toBe(false);
    },
  );

  it('should return true if card status is processing and file preview status has preview, is previewable and is supported by browser', () => {
    expect(
      isPreviewableStatus('processing', {
        ...filePreviewStatus,
        hasPreview: true,
        isPreviewable: true,
        isSupportedByBrowser: true,
      }),
    ).toBe(true);
  });

  it('should return false if card status is processing and file preview status has not preview or is not previewable or is not supported by browser', () => {
    expect(
      isPreviewableStatus('processing', {
        ...filePreviewStatus,
        hasPreview: true,
        isPreviewable: true,
      }),
    ).toBe(false);
    expect(
      isPreviewableStatus('processing', {
        ...filePreviewStatus,
        hasPreview: true,
        isSupportedByBrowser: true,
      }),
    ).toBe(false);
    expect(
      isPreviewableStatus('processing', {
        ...filePreviewStatus,
        isPreviewable: true,
        isSupportedByBrowser: true,
      }),
    ).toBe(false);
  });

  it.each(['error', 'failed-processing'] as CardStatus[])(
    'should return false when status is %s',
    (status) => {
      expect(
        isPreviewableStatus(status, {
          hasFilesize: true,
          hasPreview: true,
          isPreviewable: true,
          isSupportedByBrowser: true,
        }),
      ).toBe(false);
    },
  );
});
