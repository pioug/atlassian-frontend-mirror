import { UIAnalyticsEventHandler } from '@atlaskit/analytics-next';
import {
  ANALYTICS_MEDIA_CHANNEL,
  MediaFeatureFlags,
} from '@atlaskit/media-common';
import { mockStore } from '@atlaskit/media-test-helpers';

import { Action, Dispatch } from 'redux';

import { State, SelectedItem } from '../../../domain';
import analyticsProcessing from '../../analyticsProcessing';
import { showPopup } from '../../../actions/showPopup';
import { editorShowImage } from '../../../actions/editorShowImage';
import { fileListUpdate } from '../../../actions/fileListUpdate';
import { startAuth } from '../../../actions/startAuth';
import { ServiceName } from '../../../domain';
import { hidePopup } from '../../../actions/hidePopup';
import { changeService } from '../../../actions/changeService';
import { editRemoteImage } from '../../../actions/editRemoteImage';
import { editorClose } from '../../../actions/editorClose';
import { startFileBrowser } from '../../../actions/startFileBrowser';
import { GET_PREVIEW } from '../../../actions/getPreview';
import { AnalyticsEventPayload } from '../../../../types';

const GOOGLE: ServiceName = 'google';
const UPLOAD: ServiceName = 'upload';
const RECENT_FILES: ServiceName = 'recent_files';

describe('analyticsProcessing middleware', () => {
  let oldDateNowFn: () => number;
  let mockAnalyticsHandler: UIAnalyticsEventHandler;
  let next: Dispatch<State>;

  const defaultFeatureFlags: MediaFeatureFlags = { folderUploads: true };

  const setupStore = (
    state: Partial<State> = {},
    featureFlags: MediaFeatureFlags,
  ) =>
    mockStore({
      config: {
        featureFlags,
        proxyReactContext: {
          getAtlaskitAnalyticsContext: jest.fn(),
          getAtlaskitAnalyticsEventHandlers: () => [mockAnalyticsHandler],
        },
      },
      ...state,
    });

  const verifyAnalyticsCall = (
    actionUnderTest: Action,
    payload: AnalyticsEventPayload,
    stateOverride: Partial<State> = {},
  ) => {
    const store = setupStore(stateOverride, defaultFeatureFlags);
    analyticsProcessing(store)(next)(actionUnderTest);
    expect(mockAnalyticsHandler).toBeCalledWith(
      expect.objectContaining({
        context: [
          {
            packageName: '@atlaskit/media-picker',
            packageVersion: '999.9.9',
            componentName: 'popup',
            component: 'popup',
            attributes: { featureFlags: defaultFeatureFlags },
          },
        ],
        payload,
      }),
      ANALYTICS_MEDIA_CHANNEL,
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
      eventType: 'screen',
      actionSubject: 'recentFilesBrowserModal',
      name: 'recentFilesBrowserModal',
      attributes: {},
    });
    verifyAnalyticsCall(showPopup(), {
      eventType: 'screen',
      actionSubject: 'mediaPickerModal',
      name: 'mediaPickerModal',
      attributes: {},
    });
  });

  it('should process action editorShowImage, fire 1 event', () => {
    verifyAnalyticsCall(editorShowImage(''), {
      eventType: 'screen',
      actionSubject: 'fileEditorModal',
      name: 'fileEditorModal',
      attributes: {
        imageUrl: '',
        originalFile: undefined,
      },
    });
  });

  it('should process action fileListUpdate for google service, fire 1 event', () => {
    verifyAnalyticsCall(fileListUpdate('', [], [], GOOGLE), {
      eventType: 'screen',
      actionSubject: 'cloudBrowserModal',
      name: 'cloudBrowserModal',
      attributes: {
        cloudType: GOOGLE,
      },
    });
  });

  it('should process action startFileBrowser, fire 2 events', () => {
    verifyAnalyticsCall(startFileBrowser(), {
      eventType: 'screen',
      actionSubject: 'localFileBrowserModal',
      name: 'localFileBrowserModal',
      attributes: {},
    });
    verifyAnalyticsCall(startFileBrowser(), {
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'localFileBrowserButton',
      attributes: {},
    });
  });

  it('should process action startAuth for google, fire 1 event', () => {
    verifyAnalyticsCall(startAuth(GOOGLE), {
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'linkCloudAccountButton',
      attributes: {
        cloudType: GOOGLE,
      },
    });
  });

  it('should process action hidePopup for cancellation, fire 1 event', () => {
    verifyAnalyticsCall(hidePopup(), {
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'cancelButton',
      attributes: {
        fileCount: 0,
      },
    });
  });

  it('should process action hidePopup for insert 1 file, fire 1 event with received `N/A` via createdAt if serviceName is `recent_files`', () => {
    verifyAnalyticsCall(
      hidePopup(),
      {
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'insertFilesButton',
        attributes: {
          fileCount: 1,
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
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'insertFilesButton',
        attributes: {
          fileCount: 1,
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
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'insertFilesButton',
        attributes: {
          fileCount: 1,
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
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'insertFilesButton',
        attributes: {
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
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'uploadButton',
      attributes: {},
    });
    verifyAnalyticsCall(changeService(UPLOAD), {
      eventType: 'screen',
      actionSubject: 'recentFilesBrowserModal',
      name: 'recentFilesBrowserModal',
      attributes: {},
    });
  });

  it('should process action changeService for google, fire 1 event', () => {
    verifyAnalyticsCall(changeService(GOOGLE), {
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'cloudBrowserButton',
      attributes: {
        cloudType: GOOGLE,
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
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'annotateFileButton',
        attributes: {
          collectionName: '',
          fileId: '',
        },
      },
    );
  });

  it('should process action editorClose with "Save" selection, fire 1 event', () => {
    verifyAnalyticsCall(editorClose('Save'), {
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'mediaEditorSaveButton',
      attributes: {},
    });
  });

  it('should process action editorClose with "Close" selection, fire 1 event', () => {
    verifyAnalyticsCall(editorClose('Close'), {
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'mediaEditorCloseButton',
      attributes: {},
    });
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
});
