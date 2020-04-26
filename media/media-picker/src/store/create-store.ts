import { MediaClient } from '@atlaskit/media-client';
import { applyMiddleware, createStore, Store, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import { CloudService } from '../popup/services/cloud-service';
import { MediaApiFetcher } from '../popup/tools/fetcher/fetcher';
import { WsProvider } from '../popup/tools/websocket/wsProvider';
import reducers from '../popup/reducers/reducers';
import { State } from '../popup/domain';
import defaultState from '../popup/default_state';
import appConfig from '../config';
import changeAccount from '../popup/middleware/changeAccount';
import { changeService } from '../popup/middleware/changeService';
import { fetchNextCloudFilesPageMiddleware } from '../popup/middleware/fetchNextCloudFilesPage';
import { changeCloudAccountFolderMiddleware } from '../popup/middleware/changeCloudAccountFolder';
import startAppMiddleware from '../popup/middleware/startApp';
import { getConnectedRemoteAccounts } from '../popup/middleware/getConnectedRemoteAccounts';
import { getFilesInRecents } from '../popup/middleware/getFilesInRecents';
import { getForgePlugins } from '../popup/middleware/getForgePlugins';
import { importFilesMiddleware } from '../popup/middleware/importFiles';
import { startCloudAccountOAuthFlow } from '../popup/middleware/startAuth';
import unlinkCloudAccount from '../popup/middleware/unlinkCloudAccount';
import { editRemoteImageMiddleware } from '../popup/middleware/editRemoteImage';
import finalizeUploadMiddleware from '../popup/middleware/finalizeUpload';
import getPreviewMiddleware from '../popup/middleware/getPreview';
import { handleCloudFetchingEvent } from '../popup/middleware/handleCloudFetchingEvent';
import searchGiphy from '../popup/middleware/searchGiphy';
import hidePopupMiddleware from '../popup/middleware/hidePopup';
import sendUploadEventMiddleware from '../popup/middleware/sendUploadEvent';
import { PopupUploadEventEmitter } from '../components/types';
import { PopupConfig } from '../types';
import analyticsProcessing from '../popup/middleware/analyticsProcessing';
import { removeFileFromRecents } from '../popup/middleware/removeFileFromRecents';

export default (
  eventEmitter: PopupUploadEventEmitter,
  tenantMediaClient: MediaClient,
  userMediaClient: MediaClient,
  config: Partial<PopupConfig>,
): Store<State> => {
  const userAuthProvider = userMediaClient.config.authProvider;
  const redirectUrl = appConfig.html.redirectUrl;
  const fetcher = new MediaApiFetcher();
  const wsProvider = new WsProvider();
  const cloudService = new CloudService(userAuthProvider);
  const partialState: State = {
    ...defaultState,
    redirectUrl,
    plugins: config.plugins,
    tenantMediaClient,
    userMediaClient,
    config,
  };

  return createStore(
    reducers,
    partialState,
    composeWithDevTools(
      applyMiddleware(
        analyticsProcessing as Middleware,
        startAppMiddleware() as Middleware,
        getFilesInRecents() as Middleware,
        getForgePlugins() as Middleware,
        changeService as Middleware,
        changeAccount as Middleware,
        changeCloudAccountFolderMiddleware(fetcher) as Middleware,
        fetchNextCloudFilesPageMiddleware(fetcher) as Middleware,
        startCloudAccountOAuthFlow(fetcher, cloudService) as Middleware,
        unlinkCloudAccount(fetcher) as Middleware,
        getConnectedRemoteAccounts(fetcher) as Middleware,
        importFilesMiddleware(eventEmitter, wsProvider),
        editRemoteImageMiddleware() as Middleware,
        getPreviewMiddleware(),
        finalizeUploadMiddleware(),
        handleCloudFetchingEvent as Middleware,
        searchGiphy(fetcher) as Middleware,
        hidePopupMiddleware(eventEmitter) as Middleware,
        sendUploadEventMiddleware(eventEmitter),
        removeFileFromRecents as Middleware,
      ),
    ),
  );
};
