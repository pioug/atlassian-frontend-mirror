// eslint-disable-line no-console
import React from 'react';
import { Component } from 'react';
import {
  defaultCollectionName,
  defaultMediaPickerCollectionName,
  mediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';

import Button from '@atlaskit/button/standard-button';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import {
  MainWrapper,
  UploadPreviews,
  type AuthEnvironment,
  PopupHeader,
  PopupContainer,
} from '../example-helpers';
import { type UploadParams, type BrowserConfig } from '../src/types';
import { Browser } from '../src';
import { type FileState, MediaClient } from '@atlaskit/media-client';
import { type MediaClientConfig } from '@atlaskit/media-core';

export interface BrowserWrapperState {
  collectionName: string;
  authEnvironment: AuthEnvironment;
  mediaClient?: MediaClient;
  browseConfig?: BrowserConfig;
}

interface FunctionalBrowserProps {
  mediaClient: MediaClient;
  browseConfig: BrowserConfig;
  children: Browser['props']['children'];
}

const FunctionalBrowserWrapper = ({
  mediaClient,
  browseConfig,
  children,
}: FunctionalBrowserProps) => {
  return (
    <UploadPreviews>
      {({ onUploadsStart, onError, onPreviewUpdate }) => (
        <Browser
          mediaClientConfig={mediaClient.config}
          config={browseConfig}
          onUploadsStart={onUploadsStart}
          onError={onError}
          onPreviewUpdate={onPreviewUpdate}
        >
          {children}
        </Browser>
      )}
    </UploadPreviews>
  );
};

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  dropzoneContainer?: HTMLDivElement;
  private browseFn: Function = () => {};

  state: BrowserWrapperState = {
    authEnvironment: 'client',
    collectionName: defaultMediaPickerCollectionName,
  };

  componentDidMount() {
    const mediaClientConfig: MediaClientConfig = {
      authProvider: mediaPickerAuthProvider(),
    };
    const uploadParams: UploadParams = {
      collection: defaultMediaPickerCollectionName,
    };
    const browseConfig: BrowserConfig = {
      multiple: true,
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
      <MainWrapper>
        <PopupContainer>
          <PopupHeader>
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
              <DropdownItem onClick={this.onAuthTypeChange}>asap</DropdownItem>
            </DropdownMenu>
          </PopupHeader>
          <FunctionalBrowserWrapper
            mediaClient={mediaClient}
            browseConfig={browseConfig}
          >
            {(browse) => (
              <Button
                style={{ margin: '5px' }}
                appearance="primary"
                onClick={browse}
              >
                Click me to upload
              </Button>
            )}
          </FunctionalBrowserWrapper>
          <FunctionalBrowserWrapper
            mediaClient={mediaClient}
            browseConfig={browseConfig}
          >
            {(browse) => (
              <div style={{ margin: '5px' }} onClick={browse}>
                Click me to upload. No, for real.
              </div>
            )}
          </FunctionalBrowserWrapper>
        </PopupContainer>
      </MainWrapper>
    );
  }
}

export default () => <BrowserWrapper />;
