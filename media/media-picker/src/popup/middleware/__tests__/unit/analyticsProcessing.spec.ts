import {
  SCREEN_EVENT_TYPE,
  OPERATIONAL_EVENT_TYPE,
  TRACK_EVENT_TYPE,
  GasCorePayload,
} from '@atlaskit/analytics-gas-types';
import { UIAnalyticsEventHandler } from '@atlaskit/analytics-next';
import { mockStore } from '@atlaskit/media-test-helpers';

import { Action, Dispatch } from 'redux';

import { State, SelectedItem } from '../../../domain';
import analyticsProcessing from '../../analyticsProcessing';
import { showPopup } from '../../../actions/showPopup';
import { editorShowImage } from '../../../actions/editorShowImage';
import { searchGiphy } from '../../../actions';
import { fileListUpdate } from '../../../actions/fileListUpdate';
import { startAuth } from '../../../actions/startAuth';
import { ServiceName } from '../../../domain';
import { hidePopup } from '../../../actions/hidePopup';
import { changeService } from '../../../actions/changeService';
import { editRemoteImage } from '../../../actions/editRemoteImage';
import { editorClose } from '../../../actions/editorClose';
import { handleCloudFetchingEvent } from '../../../actions/handleCloudFetchingEvent';
import { startFileBrowser } from '../../../actions/startFileBrowser';
import { GET_PREVIEW } from '../../../actions/getPreview';
import { MediaFile } from '../../../../types';
import { buttonClickPayload, Payload } from '../../analyticsHandlers';

type TestPayload = GasCorePayload & { action: string; attributes: {} };
type UploadType = 'cloudMedia' | 'localMedia';

const GOOGLE: ServiceName = 'google';
const DROPBOX: ServiceName = 'dropbox';
const GIPHY: ServiceName = 'giphy';
const UPLOAD: ServiceName = 'upload';
const RECENT_FILES: ServiceName = 'recent_files';

const testFile1: MediaFile = {
  id: 'id1',
  name: 'file1',
  size: 1,
  creationDate: 1,
  type: 'type1',
};

const attributes = {
  componentName: 'mediaPicker',
  componentVersion: expect.any(String),
  packageName: '@atlaskit/media-picker',
};

const makePayloadForOperationalFileUpload = (
  file: MediaFile,
  uploadType: UploadType,
  serviceName: ServiceName,
): TestPayload => ({
  action: 'commenced',
  actionSubject: 'mediaUpload',
  actionSubjectId: uploadType,
  attributes: {
    sourceType: 'cloud',
    serviceName,
    fileAttributes: {
      fileId: file.id,
      fileSize: file.size,
      fileMimetype: file.type,
      fileSource: 'mediapicker',
    },
    ...attributes,
  },
  eventType: OPERATIONAL_EVENT_TYPE,
});

const makePayloadForTrackFileConversion = (
  file: MediaFile,
  uploadType: UploadType,
  status: 'success' | 'fail',
  serviceName: ServiceName,
  failReason?: string,
): TestPayload => ({
  action: 'uploaded',
  actionSubject: 'mediaUpload',
  actionSubjectId: uploadType,
  attributes: {
    sourceType: 'cloud',
    serviceName,
    fileAttributes: {
      fileId: file.id,
      fileSize: file.size,
      fileMimetype: file.type,
      fileSource: 'mediapicker',
    },
    status,
    uploadDurationMsec: 42,
    ...attributes,
    failReason,
  },
  eventType: TRACK_EVENT_TYPE,
});

describe('analyticsProcessing middleware', () => {
  let oldDateNowFn: () => number;
  let mockAnalyticsHandler: UIAnalyticsEventHandler;
  let next: Dispatch<State>;

  const setupStore = (state: Partial<State> = {}) =>
    mockStore({
      config: {
        proxyReactContext: {
          getAtlaskitAnalyticsContext: jest.fn(),
          getAtlaskitAnalyticsEventHandlers: () => [mockAnalyticsHandler],
        },
      },
      ...state,
    });

  const verifyAnalyticsCall = (
    actionUnderTest: Action,
    payload: Payload,
    stateOverride: Partial<State> = {},
  ) => {
    const store = setupStore(stateOverride);
    analyticsProcessing(store)(next)(actionUnderTest);
    expect(mockAnalyticsHandler).toBeCalledWith(
      expect.objectContaining({
        payload,
      }),
      'media',
    );
    expect(next).toBeCalledWith(actionUnderTest);
  };

  beforeAll(() => {
    oldDateNowFn = Date.now;
    Date.now = jest.fn(() => 42);
  });

  afterAll(() => {
    Date.now = oldDateNowFn;
  });

  beforeEach(() => {
    mockAnalyticsHandler = jest.fn();
    next = jest.fn();
    window.sessionStorage.setItem('media-api-region', '');
  });

  it('should process action showPopup, fire 2 events', () => {
    verifyAnalyticsCall(showPopup(), {
      name: 'recentFilesBrowserModal',
      eventType: SCREEN_EVENT_TYPE,
      attributes,
    });
    verifyAnalyticsCall(showPopup(), {
      name: 'mediaPickerModal',
      eventType: SCREEN_EVENT_TYPE,
      attributes,
    });
  });

  it('should process action editorShowImage, fire 1 event', () => {
    verifyAnalyticsCall(editorShowImage(''), {
      name: 'fileEditorModal',
      eventType: SCREEN_EVENT_TYPE,
      attributes: {
        ...attributes,
        imageUrl: '',
        originalImage: undefined,
      },
    });
  });

  it('should process action searchGiphy with any url, fire 1 event', () => {
    verifyAnalyticsCall(searchGiphy('', true), {
      name: 'cloudBrowserModal',
      attributes: {
        cloudType: GIPHY,
        ...attributes,
      },
      eventType: SCREEN_EVENT_TYPE,
    });
  });

  it('should process action fileListUpdate for google service, fire 1 event', () => {
    verifyAnalyticsCall(fileListUpdate('', [], [], GOOGLE), {
      name: 'cloudBrowserModal',
      attributes: {
        cloudType: GOOGLE,
        ...attributes,
      },
      eventType: SCREEN_EVENT_TYPE,
    });
  });

  it('should process action startFileBrowser, fire 2 events', () => {
    verifyAnalyticsCall(startFileBrowser(), {
      name: 'localFileBrowserModal',
      eventType: SCREEN_EVENT_TYPE,
      attributes,
    });
    verifyAnalyticsCall(startFileBrowser(), {
      ...buttonClickPayload,
      actionSubjectId: 'localFileBrowserButton',
      attributes,
    });
  });

  it('should process action fileListUpdate for dropbox, fire 1 event', () => {
    verifyAnalyticsCall(fileListUpdate('', [], [], DROPBOX), {
      name: 'cloudBrowserModal',
      attributes: {
        cloudType: DROPBOX,
        ...attributes,
      },
      eventType: SCREEN_EVENT_TYPE,
    });
  });

  it('should process action startAuth for google, fire 1 event', () => {
    verifyAnalyticsCall(startAuth(GOOGLE), {
      ...buttonClickPayload,
      actionSubjectId: 'linkCloudAccountButton',
      attributes: {
        cloudType: GOOGLE,
        ...attributes,
      },
    });
  });

  it('should process action startAuth for dropbox, fire 1 event', () => {
    verifyAnalyticsCall(startAuth(DROPBOX), {
      ...buttonClickPayload,
      actionSubjectId: 'linkCloudAccountButton',
      attributes: {
        cloudType: DROPBOX,
        ...attributes,
      },
    });
  });

  it('should process action hidePopup for cancellation, fire 1 event', () => {
    verifyAnalyticsCall(hidePopup(), {
      ...buttonClickPayload,
      actionSubjectId: 'cancelButton',
      attributes: {
        fileCount: 0,
        ...attributes,
      },
    });
  });

  it('should process action hidePopup for insert 1 file, fire 1 event with received `N/A` via createdAt if serviceName is `recent_files`', () => {
    verifyAnalyticsCall(
      hidePopup(),
      {
        ...buttonClickPayload,
        actionSubjectId: 'insertFilesButton',
        attributes: {
          fileCount: 1,
          ...attributes,
          serviceNames: ['recent_files'],
          files: [
            {
              accountId: undefined,
              fileId: '789',
              fileSize: 10,
              fileMimetype: 'image/jpg',
              serviceName: RECENT_FILES,
              fileAge: 'N/A',
            },
          ],
        },
      },
      {
        selectedItems: [
          {
            mimeType: 'image/jpg',
            id: '789',
            name: '1.jpg',
            size: 10,
            date: 0,
            serviceName: RECENT_FILES,
          } as SelectedItem,
        ],
      },
    );
  });

  it('should process action hidePopup for insert 1 file, fire 1 event with createdAt timestamp if serviceName is `recent_files`', () => {
    const dateMoreThanOneMonthAndLessThanSixMonths = new Date();
    dateMoreThanOneMonthAndLessThanSixMonths.setMonth(
      dateMoreThanOneMonthAndLessThanSixMonths.getMonth() - 2,
    );
    verifyAnalyticsCall(
      hidePopup(),
      {
        ...buttonClickPayload,
        actionSubjectId: 'insertFilesButton',
        attributes: {
          fileCount: 1,
          ...attributes,
          serviceNames: ['recent_files'],
          files: [
            {
              accountId: undefined,
              fileId: '789',
              fileSize: 10,
              fileMimetype: 'image/jpg',
              serviceName: RECENT_FILES,
              fileAge: '1 month - 6 months',
            },
          ],
        },
      },
      {
        selectedItems: [
          {
            mimeType: 'image/jpg',
            id: '789',
            name: '1.jpg',
            size: 10,
            date: 0,
            serviceName: RECENT_FILES,
            createdAt: dateMoreThanOneMonthAndLessThanSixMonths.getTime(),
          } as SelectedItem,
        ],
      },
    );
  });

  it('should process action hidePopup for insert of 1 file, fire 1 event with fileCount=1', () => {
    verifyAnalyticsCall(
      hidePopup(),
      {
        ...buttonClickPayload,
        actionSubjectId: 'insertFilesButton',
        attributes: {
          fileCount: 1,
          ...attributes,
          serviceNames: ['upload'],
          files: [
            {
              accountId: undefined,
              fileId: '789',
              fileSize: 10,
              fileMimetype: 'image/jpg',
              serviceName: 'upload',
            },
          ],
        },
      },
      {
        selectedItems: [
          {
            mimeType: 'image/jpg',
            id: '789',
            name: '1.jpg',
            size: 10,
            date: 0,
            serviceName: UPLOAD,
          },
        ],
      },
    );
  });

  it('should process action hidePopup for insert of 2 files, fire 1 event with fileCount=2', () => {
    verifyAnalyticsCall(
      hidePopup(),
      {
        ...buttonClickPayload,
        actionSubjectId: 'insertFilesButton',
        attributes: {
          ...attributes,
          fileCount: 2,
          serviceNames: ['upload', 'upload'],
          files: [
            {
              accountId: undefined,
              fileId: '123',
              fileSize: 10,
              fileMimetype: 'image/jpg',
              serviceName: 'upload',
            },
            {
              accountId: undefined,
              fileId: '456',
              fileSize: 20,
              fileMimetype: 'image/png',
              serviceName: 'upload',
            },
          ],
        },
      },
      {
        selectedItems: [
          {
            mimeType: 'image/jpg',
            id: '123',
            name: '1.jpg',
            size: 10,
            date: 0,
            serviceName: UPLOAD,
          },
          {
            mimeType: 'image/png',
            id: '456',
            name: '1.png',
            size: 20,
            date: 0,
            serviceName: UPLOAD,
          },
        ],
      },
    );
  });

  it('should process action changeService for upload, fire 2 events', () => {
    verifyAnalyticsCall(changeService(UPLOAD), {
      ...buttonClickPayload,
      actionSubjectId: 'uploadButton',
      attributes,
    });
    verifyAnalyticsCall(changeService(UPLOAD), {
      name: 'recentFilesBrowserModal',
      eventType: SCREEN_EVENT_TYPE,
      attributes,
    });
  });

  it('should process action changeService for google, fire 1 event', () => {
    verifyAnalyticsCall(changeService(GOOGLE), {
      ...buttonClickPayload,
      actionSubjectId: 'cloudBrowserButton',
      attributes: {
        cloudType: GOOGLE,
        ...attributes,
      },
    });
  });

  it('should process action changeService for dropbox, fire 1 event', () => {
    verifyAnalyticsCall(changeService(DROPBOX), {
      ...buttonClickPayload,
      actionSubjectId: 'cloudBrowserButton',
      attributes: {
        cloudType: DROPBOX,
        ...attributes,
      },
    });
  });

  it('should process action changeService for giphy, fire 1 event', () => {
    verifyAnalyticsCall(changeService(GIPHY), {
      ...buttonClickPayload,
      actionSubjectId: 'cloudBrowserButton',
      attributes: {
        cloudType: GIPHY,
        ...attributes,
      },
    });
  });

  it('should process action editRemoteImage, fire 1 event', () => {
    verifyAnalyticsCall(
      editRemoteImage(
        {
          id: '',
          name: '',
        },
        '',
      ),
      {
        ...buttonClickPayload,
        actionSubjectId: 'annotateFileButton',
        attributes: {
          ...attributes,
          collectionName: '',
          fileId: '',
        },
      },
    );
  });

  it('should process action editorClose with "Save" selection, fire 1 event', () => {
    verifyAnalyticsCall(editorClose('Save'), {
      ...buttonClickPayload,
      actionSubjectId: 'mediaEditorSaveButton',
      attributes,
    });
  });

  it('should process action editorClose with "Close" selection, fire 1 event', () => {
    verifyAnalyticsCall(editorClose('Close'), {
      ...buttonClickPayload,
      actionSubjectId: 'mediaEditorCloseButton',
      attributes,
    });
  });

  it('should process action handleCloudFetchingEvent with 1 upload, fire 1 event', () => {
    verifyAnalyticsCall(
      handleCloudFetchingEvent(testFile1, 'RemoteUploadStart', {
        tenantFileId: 'upid1',
        serviceName: DROPBOX,
      }),
      makePayloadForOperationalFileUpload(testFile1, 'cloudMedia', DROPBOX),
    );
  });

  it('should process action handleCloudFetchingEvent with RemoteUploadEnd event for 1 upload, fire 1 event', () => {
    verifyAnalyticsCall(
      handleCloudFetchingEvent(testFile1, 'RemoteUploadEnd', {
        userFileId: 'id1',
        tenantFileId: 'upid1',
        serviceName: DROPBOX,
      }),
      makePayloadForTrackFileConversion(
        testFile1,
        'cloudMedia',
        'success',
        DROPBOX,
      ),
      {
        remoteUploads: {
          upid1: {
            timeStarted: 0,
          },
        },
      },
    );
  });

  it('should process action handleCloudFetchingEvent with RemoteUploadFail event for 1 upload, fire 1 event', () => {
    verifyAnalyticsCall(
      handleCloudFetchingEvent(testFile1, 'RemoteUploadFail', {
        description: 'id1 failed',
        tenantFileId: 'upid1',
        serviceName: DROPBOX,
      }),
      makePayloadForTrackFileConversion(
        testFile1,
        'cloudMedia',
        'fail',
        DROPBOX,
        'id1 failed',
      ),
      {
        remoteUploads: {
          upid1: {
            timeStarted: 0,
          },
        },
      },
    );
  });

  it("should not handle action it doesn't know about", () => {
    const mockAnalyticsHandler = jest.fn();
    const store = mockStore({
      config: {
        proxyReactContext: {
          getAtlaskitAnalyticsContext: jest.fn(),
          getAtlaskitAnalyticsEventHandlers: () => [mockAnalyticsHandler],
        },
      },
    });
    analyticsProcessing(store)(next)({ type: 'BOGUS_ACTION' });
    expect(mockAnalyticsHandler.mock.calls.length).toBe(0);
  });

  it("should not handle action that doesn't have event for it", () => {
    const mockAnalyticsHandler = jest.fn();
    const store = mockStore({
      config: {
        proxyReactContext: {
          getAtlaskitAnalyticsContext: jest.fn(),
          getAtlaskitAnalyticsEventHandlers: () => [mockAnalyticsHandler],
        },
      },
    });
    analyticsProcessing(store)(next)({ type: GET_PREVIEW });
    expect(mockAnalyticsHandler.mock.calls.length).toBe(0);
  });

  it('should include media region in the attributes payload if available', () => {
    window.sessionStorage.setItem('media-api-region', 'someMediaRegion');

    verifyAnalyticsCall(hidePopup(), {
      ...buttonClickPayload,
      actionSubjectId: 'cancelButton',
      attributes: {
        fileCount: 0,
        ...attributes,
        mediaRegion: 'someMediaRegion',
      },
    });
  });
});
