// eslint-disable-line no-console
import React from 'react';
import { Component } from 'react';
import {
  defaultCollectionName,
  defaultMediaPickerCollectionName,
  mediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import {
  MainWrapper,
  UploadPreviews,
  AuthEnvironment,
  PopupHeader,
  PopupContainer,
} from '../example-helpers';
import { UploadParams, BrowserConfig } from '../src/types';
import { Browser } from '../src/';
import { MediaClientConfig } from '@atlaskit/media-core';

export interface BrowserWrapperState {
  collectionName: string;
  authEnvironment: AuthEnvironment;
  browseConfig?: BrowserConfig;
  mediaClientConfig: MediaClientConfig;
}

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  dropzoneContainer?: HTMLDivElement;
  private browseFn: Function = () => {};

  state: BrowserWrapperState = {
    authEnvironment: 'client',
    collectionName: defaultMediaPickerCollectionName,
    mediaClientConfig: {
      authProvider: mediaPickerAuthProvider(),
      useSha256ForUploads: true, // When running in a FedRAMP perimeter pass this flag to ensure all chunks are using SHA256 identifiers
    },
  };

  componentDidMount() {
    const uploadParams: UploadParams = {
      collection: this.state.collectionName,
    };
    const browseConfig: BrowserConfig = {
      multiple: true,
      fileExtensions: ['image/jpeg', 'image/png', 'video/mp4'],
      uploadParams,
    };

    this.setState({
      browseConfig,
    });
  }

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
    const { collectionName, authEnvironment, mediaClientConfig, browseConfig } =
      this.state;
    if (!browseConfig || !mediaClientConfig) {
      return null;
    }

    return (
      <MainWrapper>
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
              <DropdownItem onClick={this.onAuthTypeChange}>asap</DropdownItem>
            </DropdownMenu>
          </PopupHeader>
          <h1>Upload using FedRAMP compatible SHA256 identifiers</h1>
          <UploadPreviews>
            {({ onUploadsStart, onError, onPreviewUpdate }) => (
              <Browser
                onBrowseFn={this.onBrowseFn}
                mediaClientConfig={mediaClientConfig}
                config={browseConfig}
                onUploadsStart={onUploadsStart}
                onError={onError}
                onPreviewUpdate={onPreviewUpdate}
              />
            )}
          </UploadPreviews>
        </PopupContainer>
      </MainWrapper>
    );
  }
}

export default () => <BrowserWrapper />;
