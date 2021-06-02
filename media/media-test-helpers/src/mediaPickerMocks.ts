// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { State } from '@atlaskit/media-picker/src/popup/domain';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { PopupUploadEventEmitter } from '@atlaskit/media-picker/src/components/types';
//TODO: Remove access to src directly. Can move these to media-picker or add special "internal" entrypoint
import { Store } from 'react-redux';
import { fakeMediaClient } from './fakeMediaClient';

export const mockState: State = {
  redirectUrl: 'some-redirect-url',
  view: {
    isVisible: true,
    items: [],
    isLoading: false,
    hasError: false,
    path: [],
    service: {
      accountId: 'some-view-service-account-id',
      name: 'google',
    },
    isUploading: false,
    isCancelling: false,
  },
  accounts: Promise.resolve([]),
  recents: {
    items: [],
  },
  selectedItems: [],
  lastUploadIndex: 0,
  uploads: {},
  remoteUploads: {},
  isCancelling: false,
  isUploading: false,
  giphy: {
    imageCardModels: [],
    totalResultCount: 100,
  },
  onCancelUpload: jest.fn(),
  tenantMediaClient: fakeMediaClient(),
  userMediaClient: fakeMediaClient(),
  config: {},
};

export const mockStore = (
  state?: Partial<State>,
): jest.Mocked<Store<State>> => ({
  dispatch: jest.fn().mockImplementation((action) => action),
  getState: jest.fn().mockReturnValue({
    ...mockState,
    ...state,
  }),
  subscribe: jest.fn(),
  replaceReducer: jest.fn(),
});

export const mockFetcher = () => ({
  fetchCloudAccountFolder: jest.fn(),
  pollFile: jest.fn(),
  getPreview: jest.fn(),
  getImage: jest.fn(),
  getServiceList: jest.fn(),
  getRecentFiles: jest.fn(),
  unlinkCloudAccount: jest.fn(),
  fetchCloudAccountFile: jest.fn(),
  copyFile: jest.fn(),
  fetchTrendingGifs: jest.fn(),
  fetchGifsRelevantToSearch: jest.fn(),
});

export const mockIsWebGLNotAvailable = () => {
  jest.mock('@atlaskit/media-picker/src/popup/tools/webgl', () => {
    return {
      isWebGLAvailable: jest.fn(() => {
        return false;
      }),
    };
  });
};

export const mockWsConnectionHolder = () => ({
  openConnection: jest.fn(),
  send: jest.fn(),
});

export const mockEventEmiter = () => ({
  once: jest.fn(),
  on: jest.fn(),
  onAny: jest.fn(),
  addListener: jest.fn(),
  off: jest.fn(),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
  emit: jest.fn(),
});

export const mockPopupUploadEventEmitter = (): jest.Mocked<
  PopupUploadEventEmitter
> => ({
  emitPluginItemsInserted: jest.fn(),
  emitClosed: jest.fn(),
  emitUploadsStart: jest.fn(),
  emitUploadPreviewUpdate: jest.fn(),
  emitUploadEnd: jest.fn(),
  emitUploadError: jest.fn(),
});

export interface PropsWithStore {
  store?: Store<any>;
}

/**
 * Connected (react-redux) components allow to provide "store" as prop directly (without specifying
 * store Provider wrapper). But current type definition doesn't allow for that.
 * This function takes React Component class and return one identical, but with additional store prop)
 */
export function getComponentClassWithStore<P>(
  componentClass: React.ComponentClass<P>,
): React.ComponentClass<P & PropsWithStore> {
  return componentClass as React.ComponentClass<P & PropsWithStore>;
}
