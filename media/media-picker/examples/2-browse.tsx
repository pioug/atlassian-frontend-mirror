// eslint-disable-line no-console
import React from 'react';
import { Component } from 'react';
import { IntlProvider } from 'react-intl-next';
import {
  defaultCollectionName,
  defaultMediaPickerCollectionName,
  defaultMediaPickerAuthProvider,
  FeatureFlagsWrapper,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button/standard-button';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import { PopupHeader, PopupContainer } from '../example-helpers/stylesWrapper';
import { UploadPreviews } from '../example-helpers/upload-previews';
import { AuthEnvironment } from '../example-helpers/types';
import { UfoLoggerWrapper } from '../example-helpers/UfoWrapper';
import { UploadParams, BrowserConfig } from '../src/types';
import { Browser } from '../src/';
import { FileState, MediaClient } from '@atlaskit/media-client';
import { MediaClientConfig } from '@atlaskit/media-core';
import { LOGGED_FEATURE_FLAGS } from '../src/util/analytics';
export interface BrowserWrapperState {
  collectionName: string;
  authEnvironment: AuthEnvironment;
  mediaClient?: MediaClient;
  browseConfig?: BrowserConfig;
}

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  dropzoneContainer?: HTMLDivElement;
  private browseFn: Function = () => {};

  state: BrowserWrapperState = {
    authEnvironment: 'client',
    collectionName: defaultMediaPickerCollectionName,
  };

  componentDidMount() {
    const mediaClientConfig: MediaClientConfig = {
      authProvider: defaultMediaPickerAuthProvider(),
    };
    const uploadParams: UploadParams = {
      collection: this.state.collectionName,
    };
    const browseConfig: BrowserConfig = {
      multiple: true,
      fileExtensions: ['image/jpeg', 'image/png', 'video/mp4'],
      uploadParams,
    };

    const mediaClient = new MediaClient(mediaClientConfig);
    mediaClient.on('file-added', this.onFileAdded);

    this.setState({
      mediaClient,
      browseConfig,
    });
  }

  onFileAdded = (fileState: FileState) => {
    console.log('onFileAdded', fileState);
  };

  onOpen = () => {
    if (this.browseFn) {
      this.browseFn();
    }
  };

  onCollectionChange = (
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
  ) => {
    if (!(e.currentTarget instanceof HTMLElement)) {
      return;
    }
    const { innerText: collectionName } = e.currentTarget;
    const { browseConfig } = this.state;
    if (!browseConfig) {
      return;
    }

    const uploadParams: UploadParams = {
      collection: collectionName,
    };

    this.setState({
      collectionName,
      browseConfig: {
        ...browseConfig,
        uploadParams,
      },
    });
  };

  onAuthTypeChange = (
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
  ) => {
    if (!(e.currentTarget instanceof HTMLElement)) {
      return;
    }
    const { innerText: authEnvironment } = e.currentTarget;

    this.setState({ authEnvironment: authEnvironment as AuthEnvironment });
  };

  onBrowseFn = (browse: () => void) => {
    this.browseFn = browse;
  };

  render() {
    const { collectionName, authEnvironment, mediaClient, browseConfig } =
      this.state;
    if (!browseConfig || !mediaClient) {
      return null;
    }

    return (
      <UfoLoggerWrapper>
        <FeatureFlagsWrapper filterFlags={LOGGED_FEATURE_FLAGS}>
          <IntlProvider locale="en">
            <PopupContainer>
              <PopupHeader>
                <Button appearance="primary" onClick={this.onOpen}>
                  Open
                </Button>
                <DropdownMenu trigger={collectionName}>
                  <DropdownItem onClick={this.onCollectionChange}>
                    {defaultMediaPickerCollectionName}
                  </DropdownItem>
                  <DropdownItem onClick={this.onCollectionChange}>
                    {defaultCollectionName}
                  </DropdownItem>
                </DropdownMenu>
                <DropdownMenu trigger={authEnvironment}>
                  <DropdownItem onClick={this.onAuthTypeChange}>
                    client
                  </DropdownItem>
                  <DropdownItem onClick={this.onAuthTypeChange}>
                    asap
                  </DropdownItem>
                </DropdownMenu>
              </PopupHeader>
              <UploadPreviews>
                {({ onUploadsStart, onError, onPreviewUpdate }) => (
                  <Browser
                    onBrowseFn={this.onBrowseFn}
                    mediaClientConfig={mediaClient.config}
                    config={browseConfig}
                    onUploadsStart={onUploadsStart}
                    onError={onError}
                    onPreviewUpdate={onPreviewUpdate}
                  />
                )}
              </UploadPreviews>
            </PopupContainer>
          </IntlProvider>
        </FeatureFlagsWrapper>
      </UfoLoggerWrapper>
    );
  }
}

export default () => <BrowserWrapper />;
