import { MediaClientConfig } from '@atlaskit/media-core';
import { StoryBookAuthProvider } from '@atlaskit/media-test-helpers';
import { MediaError, MediaFile } from '@atlaskit/media-picker/types';

import PickerFacade from '../../../../plugins/media/picker-facade';
import type { ErrorReportingHandler } from '@atlaskit/editor-common/utils';

describe('Media PickerFacade', () => {
  const errorReporter: ErrorReportingHandler = {
    captureException: () => {},
    captureMessage: () => {},
  };

  const mediaClientConfig: MediaClientConfig = {
    authProvider: StoryBookAuthProvider.create(false),
  };

  const pickerFacadeConfig = {
    mediaClientConfig,
    errorReporter,
  };

  const mediaFileMock: MediaFile = {
    id: 'test-id',
    name: 'filename',
    size: 1024,
    creationDate: Date.now(),
    type: 'test',
  };

  const mediaErrorMock: MediaError = {
    name: 'object_create_fail',
    description: 'test description',
  };

  describe('Picker: Popup', () => {
    let facade: PickerFacade;

    beforeEach(async () => {
      facade = new PickerFacade('customMediaPicker', pickerFacadeConfig);
      await facade.init();
    });

    afterEach(() => {
      facade.destroy();
      jest.clearAllMocks();
    });

    it('should call listeners on upload error', () => {
      const exampleCb = jest.fn();
      facade['eventListeners'][mediaFileMock.id] = [exampleCb];
      facade.handleUploadError({
        error: mediaErrorMock,
        fileId: mediaFileMock.id,
      });
      expect(exampleCb).toHaveBeenCalledTimes(1);
      expect(exampleCb).toHaveBeenCalledWith({
        id: mediaFileMock.id,
        status: 'error',
        error: {
          description: mediaErrorMock.description,
          name: mediaErrorMock.name,
        },
      });
    });

    it('should set upload-error and call insertFile with error status', () => {
      const exampleCb = jest.fn();
      const insertFile = jest.fn();
      facade.onNewMedia(insertFile);
      facade['eventListeners'][mediaFileMock.id] = [exampleCb];
      facade.handleUploadError({
        error: mediaErrorMock,
        fileId: mediaFileMock.id,
      });

      //When upload error is called, set the status to error
      expect(facade.erroredFiles.has(mediaFileMock.id)).toBe(true);
      facade.handleUploadPreviewUpdate({
        file: mediaFileMock,
        preview: {},
      });

      expect(insertFile).toHaveBeenCalledWith(
        {
          id: 'test-id',
          fileMimeType: mediaFileMock.type,
          fileSize: mediaFileMock.size,
          fileName: mediaFileMock.name,
          scaleFactor: undefined,
          dimensions: undefined,
          status: 'error',
        },
        expect.any(Function),
        'customMediaPicker',
      );
    });

    it('should delete the listeners on upload error', () => {
      const exampleCb = jest.fn();
      facade['eventListeners'][mediaFileMock.id] = [exampleCb];
      facade.handleUploadError({
        error: mediaErrorMock,
        fileId: mediaFileMock.id,
      });
      expect(facade['eventListeners'][mediaFileMock.id]).toBe(undefined);
    });
  });
});
