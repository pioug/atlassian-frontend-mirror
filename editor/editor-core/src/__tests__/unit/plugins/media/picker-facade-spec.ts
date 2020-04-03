import { MediaClientConfig } from '@atlaskit/media-core';
import {
  StoryBookAuthProvider,
  userAuthProvider,
  asMock,
} from '@atlaskit/media-test-helpers';
import { MediaError, MediaFile, Popup } from '@atlaskit/media-picker/types';

import PickerFacade from '../../../../plugins/media/picker-facade';
import { ErrorReportingHandler } from '@atlaskit/editor-common';

describe('Media PickerFacade', () => {
  const errorReporter: ErrorReportingHandler = {
    captureException: () => {},
    captureMessage: () => {},
  };

  const mediaClientConfig: MediaClientConfig = {
    authProvider: StoryBookAuthProvider.create(false),
    userAuthProvider,
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

  const popupMediaPickerMock: Popup = {
    on: jest.fn(),
    removeAllListeners: jest.fn(),
    teardown: jest.fn(),
    show: jest.fn(),
    cancel: jest.fn(),
    hide: jest.fn(),
    emitClosed: jest.fn(),
    setUploadParams: jest.fn(),
    emitPluginItemsInserted: jest.fn(),
    emitUploadsStart: jest.fn(),
    emitUploadPreviewUpdate: jest.fn(),
    emitUploadEnd: jest.fn(),
    emitUploadError: jest.fn(),
    once: jest.fn(),
    onAny: jest.fn(),
    addListener: jest.fn(),
    off: jest.fn(),
    removeListener: jest.fn(),
    emit: jest.fn(),
  };

  describe('Picker: Popup', () => {
    let facade: PickerFacade;
    let MediaPickerMockConstructor: jest.Mock;

    beforeEach(async () => {
      MediaPickerMockConstructor = jest.fn(() =>
        Promise.resolve(popupMediaPickerMock),
      );

      facade = new PickerFacade(
        'popup',
        pickerFacadeConfig,
        {
          uploadParams: { collection: '' },
          useForgePlugins: true,
        },
        asMock(MediaPickerMockConstructor),
      );
      await facade.init();
    });

    afterEach(() => {
      facade.destroy();
      jest.clearAllMocks();
    });

    it('pass down useForgePlugins to popup', () => {
      expect(MediaPickerMockConstructor).toHaveBeenCalledWith(
        mediaClientConfig,
        {
          uploadParams: {
            collection: '',
          },
          useForgePlugins: true,
        },
      );
    });

    it('listens to picker events', () => {
      expect(true).toBeTruthy();
      expect(popupMediaPickerMock.on).toHaveBeenCalledTimes(4);
      expect(popupMediaPickerMock.on).toHaveBeenCalledWith(
        'upload-preview-update',
        expect.any(Function),
      );
      expect(popupMediaPickerMock.on).toHaveBeenCalledWith(
        'upload-end',
        expect.any(Function),
      );
    });

    it('removes listeners on destruction', () => {
      facade.destroy();
      expect(popupMediaPickerMock.removeAllListeners).toHaveBeenCalledTimes(3);
      expect(popupMediaPickerMock.removeAllListeners).toHaveBeenCalledWith(
        'upload-preview-update',
      );
      expect(popupMediaPickerMock.removeAllListeners).toHaveBeenCalledWith(
        'upload-end',
      );
    });

    it(`should call picker's teardown() on destruction`, () => {
      facade.destroy();
      expect(popupMediaPickerMock.teardown).toHaveBeenCalledTimes(1);
    });

    it(`should call picker's show() on destruction`, () => {
      facade.show();
      expect(popupMediaPickerMock.show).toHaveBeenCalledTimes(1);
    });

    it(`should call picker's hide() on destruction`, () => {
      facade.hide();
      expect(popupMediaPickerMock.hide).toHaveBeenCalledTimes(1);
    });

    it('should call picker on close when onClose is called', () => {
      const closeCb = jest.fn();
      asMock(popupMediaPickerMock.on).mockClear();
      facade.onClose(closeCb);

      expect(popupMediaPickerMock.on).toHaveBeenCalledTimes(1);
      expect(popupMediaPickerMock.on).toHaveBeenCalledWith('closed', closeCb);
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
        'popup',
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
