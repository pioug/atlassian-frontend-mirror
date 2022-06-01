// eslint-disable-line no-console
import React from 'react';
import { Component } from 'react';
import { IntlProvider } from 'react-intl-next';

import {
  defaultMediaPickerCollectionName,
  defaultMediaPickerAuthProvider,
  FeatureFlagsWrapper,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button/standard-button';
import { Browser } from '../src';
import { BrowserConfig, UploadPreviewUpdateEventPayload } from '../src/types';
import {
  PreviewsWrapper,
  PopupHeader,
  PopupContainer,
  PreviewsTitle,
} from '../example-helpers/stylesWrapper';
import { UploadPreview } from '../example-helpers/upload-preview';
import { UfoLoggerWrapper } from '../example-helpers/UfoWrapper';
import { MediaClientConfig } from '@atlaskit/media-core';
import { LOGGED_FEATURE_FLAGS } from '../src/util/analytics';

export interface BrowserWrapperState {
  previewsData: any[];
  isOpen: boolean;
}

const mediaClientConfig: MediaClientConfig = {
  authProvider: defaultMediaPickerAuthProvider(),
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
      <UfoLoggerWrapper>
        <FeatureFlagsWrapper filterFlags={LOGGED_FEATURE_FLAGS}>
          <IntlProvider locale="en">
            <PopupContainer>
              <PopupHeader>{buttons}</PopupHeader>
              <PreviewsWrapper>
                <PreviewsTitle>Upload previews</PreviewsTitle>
                {this.renderPreviews()}
                {browsers}
              </PreviewsWrapper>
            </PopupContainer>
          </IntlProvider>
        </FeatureFlagsWrapper>
      </UfoLoggerWrapper>
    );
  }
}

export default () => <BrowserWrapper />;
