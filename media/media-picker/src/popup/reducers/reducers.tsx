import fileClick from './fileClick';
import updatePopupUrls from './updatePopupUrls';
import fileListUpdate from './fileListUpdate';
import serviceListUpdate from './serviceListUpdate';
import accountChange from './accountChange';
import accountUnlink from './accountUnlink';
import serviceConnect from './serviceConnect';
import pathChangeRequest from './pathChangeRequest';
import fetchNextCloudFilesPage from './fetchNextCloudFilesPage';
import {
  getRecentFilesStarted,
  getRecentFilesFullfilled,
  getRecentFilesFailed,
} from './getFilesInRecents';
import fileUploadsAdd from './fileUploadsAdd';
import resetView from './resetView';
import editorClose from './editorClose';
import editorShowError from './editorShowError';
import editorShowImage from './editorShowImage';
import editorShowLoading from './editorShowLoading';
import deselectItem from './deselectItem';
import isUploading from './isUploading';
import remoteUploadStart from './remoteUploadStart';
import {
  giphySearchStarted,
  giphySearchFullfilled,
  giphySearchFailed,
} from './searchGiphy';
import showPopup from './showPopup';
import hidePopup from './hidePopup';
import startApp from './startApp';
import saveCollectionItemsSubscription from './saveCollectionItemsSubscription';
import removeFileFromRecents from './removeFileFromRecents';
import {
  getForgePluginsStarted,
  getForgePluginsFullfilled,
  getForgePluginsFailed,
} from './getForgePlugins';
import { connectedRemoteAccountsFailed } from './connectedRemoteAccountsFailed';

const reducers = combineReducers([
  fileClick,
  fileListUpdate,
  pathChangeRequest,
  fetchNextCloudFilesPage,
  serviceListUpdate,
  accountChange,
  serviceConnect,
  accountUnlink,
  getRecentFilesStarted,
  getRecentFilesFullfilled,
  getRecentFilesFailed,
  getForgePluginsStarted,
  getForgePluginsFullfilled,
  getForgePluginsFailed,
  updatePopupUrls,
  fileUploadsAdd,
  removeFileFromRecents,
  resetView,
  editorClose,
  editorShowError,
  editorShowImage,
  editorShowLoading,
  deselectItem,
  isUploading,
  remoteUploadStart,
  giphySearchStarted,
  giphySearchFullfilled,
  giphySearchFailed,
  showPopup,
  hidePopup,
  connectedRemoteAccountsFailed,
  startApp,
  saveCollectionItemsSubscription,
]);

function combineReducers(reducers: any) {
  return (state: any, action: any) => {
    return reducers.reduce(
      (oldState: any, reducer: any) => {
        return reducer(oldState, action);
      },
      { ...state },
    );
  };
}

export default reducers;
