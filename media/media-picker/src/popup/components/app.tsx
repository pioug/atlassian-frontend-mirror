import { Component, ReactNode } from 'react';
import React from 'react';
import { Dispatch, Store } from 'redux';
import { connect, Provider } from 'react-redux';
import { IntlShape } from 'react-intl';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import { MediaClient } from '@atlaskit/media-client';
import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';
import { UIAnalyticsEventHandler } from '@atlaskit/analytics-next';
import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';

import { ServiceName, State, ServiceFile, SelectedItem } from '../domain';

/* Components */
import Footer from './footer/footer';
import Sidebar from './sidebar/sidebar';
import UploadView from './views/upload/upload';
import Browser from './views/browser/browser';
import { Dropzone as DropzonePlaceholder } from './dropzone/dropzone';
import MainEditorView from './views/editor/mainEditorView';

/* actions */
import { startApp, StartAppActionPayload } from '../actions/startApp';
import { hidePopup } from '../actions/hidePopup';
import { fileUploadsStart } from '../actions/fileUploadsStart';
import { fileUploadError } from '../actions/fileUploadError';
import { dropzoneDropIn } from '../actions/dropzoneDropIn';
import { dropzoneDragOut } from '../actions/dropzoneDragOut';
import PassContext from './passContext';
import {
  UploadsStartEventPayload,
  UploadErrorEventPayload,
  ClipboardConfig,
  DropzoneConfig,
  UploadParams,
  PopupConfig,
} from '../../types';
import { MediaPickerPopupWrapper, SidebarWrapper, ViewWrapper } from './styled';
import { DropzoneDragLeaveEventPayload } from '../../components/types';
import { fileClick } from '../actions/fileClick';
import {
  MediaPickerPlugin,
  PluginActions,
  PluginFile,
} from '../../domain/plugin';
import { Clipboard } from '../../components/clipboard/clipboard';
import { Dropzone, DropzoneBase } from '../../components/dropzone/dropzone';
import {
  Browser as BrowserComponent,
  BrowserBase,
} from '../../components/browser/browser';
import { LocalUploadComponent } from '../../components/localUpload';
import { resetView } from '../actions/resetView';

export interface AppStateProps {
  readonly selectedServiceName: ServiceName;
  readonly isVisible: boolean;
  readonly selectedItems: SelectedItem[];
  readonly tenantMediaClient: MediaClient;
  readonly userMediaClient: MediaClient;
  readonly config?: Partial<PopupConfig>;
  readonly plugins?: MediaPickerPlugin[];
}

export interface AppDispatchProps {
  readonly onStartApp: (payload: StartAppActionPayload) => void;
  readonly onClose: () => void;
  readonly onUploadsStart: (payload: UploadsStartEventPayload) => void;
  readonly onUploadError: (payload: UploadErrorEventPayload) => void;
  readonly onDropzoneDragOut: (fileCount: number) => void;
  readonly onDropzoneDropIn: (fileCount: number) => void;
  readonly onFileClick: (
    serviceFile: ServiceFile,
    serviceName: ServiceName,
  ) => void;
}

export interface AppProxyReactContext {
  getAtlaskitAnalyticsEventHandlers: () => UIAnalyticsEventHandler[];
  getAtlaskitAnalyticsContext?: () => Record<string, any>[];
  intl?: IntlShape;
}

export interface AppOwnProps {
  store: Store<State>;
  tenantUploadParams: UploadParams;
  proxyReactContext?: AppProxyReactContext;
  useForgePlugins?: boolean;
  featureFlags?: MediaFeatureFlags;
}

export type AppProps = AppStateProps & AppOwnProps & AppDispatchProps;

export interface AppState {
  readonly isDropzoneActive: boolean;
}

export class App extends Component<AppProps, AppState> {
  private readonly componentMediaClient: MediaClient;
  private browserRef = React.createRef<BrowserBase>();
  private dropzoneRef = React.createRef<DropzoneBase>();
  private readonly localUploader: LocalUploadComponent;

  constructor(props: AppProps) {
    super(props);
    const {
      onStartApp,
      onUploadsStart,
      onUploadError,
      tenantMediaClient,
      userMediaClient,
      tenantUploadParams,
    } = props;

    this.state = {
      isDropzoneActive: false,
    };

    // Context that has both auth providers defined explicitly using to provided contexts.
    // Each of the local components using this context will upload first to user's recents
    // and then copy to a tenant's collection.
    const mediaClient = new MediaClient({
      authProvider: tenantMediaClient.config.authProvider,
      userAuthProvider: userMediaClient.config.authProvider,
    });

    this.componentMediaClient = mediaClient;

    this.localUploader = new LocalUploadComponent(mediaClient, {
      uploadParams: tenantUploadParams,
      shouldCopyFileToRecents: false,
    });

    this.localUploader.on('uploads-start', onUploadsStart);
    this.localUploader.on('upload-error', onUploadError);

    onStartApp({
      onCancelUpload: (uniqueIdentifier) => {
        this.browserRef.current &&
          this.browserRef.current.cancel(uniqueIdentifier);
        this.dropzoneRef.current &&
          this.dropzoneRef.current.cancel(uniqueIdentifier);
        this.localUploader.cancel(uniqueIdentifier);
      },
    });
  }

  onDragLeave = (payload: DropzoneDragLeaveEventPayload): void => {
    const { onDropzoneDragOut } = this.props;
    onDropzoneDragOut(payload.length);
    this.setDropzoneActive(false);
  };

  onDragEnter = (): void => {
    this.setDropzoneActive(true);
  };

  onDrop = (payload: UploadsStartEventPayload): void => {
    const { onDropzoneDropIn, onUploadsStart } = this.props;
    onDropzoneDropIn(payload.files.length);
    onUploadsStart(payload);
  };

  render() {
    const {
      selectedServiceName,
      isVisible,
      onClose,
      store,
      proxyReactContext,
      useForgePlugins = false,
    } = this.props;

    const { isDropzoneActive } = this.state;

    return (
      <ModalTransition>
        {isVisible && (
          <Provider store={store}>
            <ModalDialog onClose={onClose} width="x-large">
              <PassContext store={store} proxyReactContext={proxyReactContext}>
                <div data-testid="media-picker-popup">
                  <MediaPickerPopupWrapper>
                    <SidebarWrapper>
                      <Sidebar useForgePlugins={useForgePlugins} />
                    </SidebarWrapper>
                    <ViewWrapper>
                      {this.renderCurrentView(selectedServiceName)}
                      <Footer />
                    </ViewWrapper>
                    <DropzonePlaceholder isActive={isDropzoneActive} />
                    <MainEditorView localUploader={this.localUploader} />
                  </MediaPickerPopupWrapper>
                  {this.renderClipboard()}
                  {this.renderDropzone()}
                  {this.renderBrowser()}
                </div>
              </PassContext>
            </ModalDialog>
          </Provider>
        )}
      </ModalTransition>
    );
  }

  private renderCurrentView(selectedServiceName: ServiceName): ReactNode {
    const { plugins = [], onFileClick, selectedItems } = this.props;
    if (selectedServiceName === 'upload') {
      // We need to create a new context since Cards in recents view need user auth
      const { userMediaClient, featureFlags } = this.props;
      return (
        <UploadView
          browserRef={this.browserRef}
          mediaClient={userMediaClient}
          recentsCollection={RECENTS_COLLECTION}
          featureFlags={featureFlags}
        />
      );
    } else {
      const selectedPlugin = plugins.find(
        (plugin) => plugin.name === selectedServiceName,
      );

      if (selectedPlugin) {
        const actions: PluginActions = {
          fileClick(pluginFile: PluginFile, pluginName: string) {
            const serviceFile: ServiceFile = {
              id: pluginFile.id,
              date: new Date().getTime(),
              mimeType: '',
              name: '',
              size: 0,
              metadata: pluginFile.metadata,
            };
            onFileClick(serviceFile, pluginName);
          },
        };
        return selectedPlugin.render(actions, selectedItems);
      }

      return <Browser />;
    }
  }

  private setDropzoneActive = (isDropzoneActive: boolean) => {
    this.setState({
      isDropzoneActive,
    });
  };

  private renderClipboard = () => {
    const { onUploadError, tenantUploadParams, featureFlags } = this.props;

    const config: ClipboardConfig = {
      uploadParams: tenantUploadParams,
      shouldCopyFileToRecents: false,
      featureFlags,
    };

    return (
      <Clipboard
        mediaClient={this.componentMediaClient}
        config={config}
        featureFlags={featureFlags}
        onUploadsStart={this.onDrop}
        onError={onUploadError}
      />
    );
  };

  private renderBrowser = () => {
    const {
      tenantUploadParams,
      featureFlags,
      onUploadsStart,
      onUploadError,
    } = this.props;

    const config = {
      uploadParams: tenantUploadParams,
      shouldCopyFileToRecents: false,
      multiple: true,
      featureFlags,
    };

    return (
      <BrowserComponent
        ref={this.browserRef}
        mediaClient={this.componentMediaClient}
        config={config}
        featureFlags={featureFlags}
        onUploadsStart={onUploadsStart}
        onError={onUploadError}
      />
    );
  };

  private renderDropzone = () => {
    const { onUploadError, tenantUploadParams, featureFlags } = this.props;

    const config: DropzoneConfig = {
      uploadParams: tenantUploadParams,
      shouldCopyFileToRecents: false,
      featureFlags,
    };

    return (
      <Dropzone
        ref={this.dropzoneRef}
        mediaClient={this.componentMediaClient}
        config={config}
        featureFlags={featureFlags}
        onUploadsStart={this.onDrop}
        onError={onUploadError}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
      />
    );
  };
}

const mapStateToProps = ({
  view,
  tenantMediaClient,
  userMediaClient,
  config,
  plugins,
  selectedItems,
}: State): AppStateProps => ({
  selectedServiceName: view.service.name,
  isVisible: view.isVisible,
  config,
  plugins,
  selectedItems,
  tenantMediaClient,
  userMediaClient,
});

const mapDispatchToProps = (dispatch: Dispatch<State>): AppDispatchProps => ({
  onStartApp: (payload: StartAppActionPayload) => dispatch(startApp(payload)),
  onUploadsStart: (payload: UploadsStartEventPayload) =>
    dispatch(fileUploadsStart(payload)),
  onClose: () => {
    dispatch(resetView());
    dispatch(hidePopup());
  },
  onUploadError: (payload: UploadErrorEventPayload) =>
    dispatch(fileUploadError(payload)),
  onDropzoneDragOut: (fileCount: number) =>
    dispatch(dropzoneDragOut(fileCount)),
  onDropzoneDropIn: (fileCount: number) => dispatch(dropzoneDropIn(fileCount)),
  onFileClick: (serviceFile, serviceName) =>
    dispatch(fileClick(serviceFile, serviceName)),
});

export default connect<AppStateProps, AppDispatchProps, AppOwnProps, State>(
  mapStateToProps,
  mapDispatchToProps,
)(App);
