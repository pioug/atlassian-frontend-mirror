// eslint-disable-line no-console
import React from 'react';
import { Component } from 'react';
import {
  mediaPickerAuthProvider,
  defaultMediaPickerCollectionName,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button/standard-button';
import { Browser } from '../src';
import { BrowserConfig, UploadPreviewUpdateEventPayload } from '../src/types';
import {
  PreviewsWrapper,
  PopupHeader,
  PopupContainer,
  PreviewsTitle,
} from '../example-helpers/styled';
import { UploadPreview } from '../example-helpers/upload-preview';
import { MediaClientConfig } from '@atlaskit/media-core';

export interface BrowserWrapperState {
  previewsData: any[];
  isOpen: boolean;
}

const mediaClientConfig: MediaClientConfig = {
  authProvider: mediaPickerAuthProvider(),
};

const browseConfig: BrowserConfig = {
  multiple: true,
  fileExtensions: ['image/jpeg', 'image/png'],
  uploadParams: {
    collection: defaultMediaPickerCollectionName,
  },
};

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  dropzoneContainer?: HTMLDivElement;

  state: BrowserWrapperState = {
    previewsData: [],
    isOpen: false,
  };

  renderBrowser = (key: number) => {
    const { isOpen } = this.state;

    return (
      <Browser
        key={key}
        mediaClientConfig={mediaClientConfig}
        config={browseConfig}
        isOpen={isOpen}
        onClose={this.onClose}
        onPreviewUpdate={this.onUploadPreviewUpdate}
      />
    );
  };

  onUploadPreviewUpdate = (data: UploadPreviewUpdateEventPayload) => {
    this.setState({ previewsData: [...this.state.previewsData, data] });
  };

  onOpen = () => () => {
    this.setState({
      isOpen: true,
    });
  };

  onClose = () => {
    this.setState({ isOpen: false });
  };

  private renderPreviews = () => {
    const { previewsData } = this.state;

    return previewsData.map((previewsData, index) => (
      <UploadPreview key={`${index}`} fileId={previewsData.fileId} />
    ));
  };

  render() {
    const array = Array.from({ length: 5 });
    const buttons = array.map((_: any, key: number) => {
      return (
        <Button key={key} appearance="primary" onClick={this.onOpen}>
          Open
        </Button>
      );
    });
    const browsers = array.map((_: any, key: number) =>
      this.renderBrowser(key),
    );

    return (
      <PopupContainer>
        <PopupHeader>{buttons}</PopupHeader>
        <PreviewsWrapper>
          <PreviewsTitle>Upload previews</PreviewsTitle>
          {this.renderPreviews()}
          {browsers}
        </PreviewsWrapper>
      </PopupContainer>
    );
  }
}

export default () => <BrowserWrapper />;
