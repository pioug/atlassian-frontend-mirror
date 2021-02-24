/**
 * The purpose of this example is to demo the integration between MediaPicker + id upfront + <Card />
 */

import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button/standard-button';
import {
  defaultMediaPickerCollectionName,
  createUploadMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import { Card } from '@atlaskit/media-card';
import { MediaPicker } from '../src';
import {
  PopupContainer,
  PopupHeader,
  CardsWrapper,
  CardItemWrapper,
} from '../example-helpers/styled';
import popupWarning from '../example-helpers/popup-warning';
import {
  UploadEndEventPayload,
  UploadsStartEventPayload,
  UploadPreviewUpdateEventPayload,
  Popup,
} from '../src/types';

const mediaClientConfig = createUploadMediaClientConfig();

export interface PopupWrapperState {
  fileIds: string[];
  uploadingFileIds: string[];
  popup?: Popup;
}

class PopupWrapper extends Component<{}, PopupWrapperState> {
  state: PopupWrapperState = {
    fileIds: [],
    uploadingFileIds: [],
  };

  static contextTypes = {
    // Required context in order to integrate analytics in media picker
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
  };

  async componentDidMount() {
    const popup = await MediaPicker(mediaClientConfig, {
      container: document.body,
      uploadParams: {
        collection: defaultMediaPickerCollectionName,
      },
      // Media picker requires `proxyReactContext` to enable analytics
      // otherwise, analytics Gasv3 integrations won't work
      proxyReactContext: this.context,
    });

    popup.on(
      'upload-preview-update',
      (event: UploadPreviewUpdateEventPayload) => {
        const { file, preview } = event;

        console.log('upload-preview-update file', file);
        console.log('upload-preview-update preview', preview);
      },
    );

    popup.show();

    popup.on('uploads-start', this.onUploadsStart);
    popup.on('upload-end', this.onUploadEnd);

    this.setState({ popup });
  }

  componentWillUnmount() {
    const { popup } = this.state;
    if (popup) {
      popup.removeAllListeners();
    }
  }

  onUploadsStart = (data: UploadsStartEventPayload) => {
    const { fileIds } = this.state;
    const { files: newFiles } = data;
    const ids = newFiles.map(file => file.id);

    this.setState({
      uploadingFileIds: ids,
      fileIds: [...fileIds, ...ids],
    });
  };

  onUploadEnd = (data: UploadEndEventPayload) => {
    const { uploadingFileIds } = this.state;
    const { file } = data;
    const index = uploadingFileIds.indexOf(file.id);

    if (index > -1) {
      uploadingFileIds.splice(index, 1);

      this.setState({ uploadingFileIds });
    }
  };

  onShow = () => {
    const { popup } = this.state;
    // Synchronously with next command tenantAuthProvider will be requested.
    if (popup) {
      popup.show().catch(console.error);
    }
  };

  renderCards = () => {
    const { fileIds } = this.state;
    const cards = fileIds.map((id, key) => {
      console.log(`<Card id="${id}" />`);

      return (
        <CardItemWrapper key={key}>
          <Card
            mediaClientConfig={mediaClientConfig}
            isLazy={false}
            identifier={{
              id,
              mediaItemType: 'file',
            }}
          />
        </CardItemWrapper>
      );
    });

    return <CardsWrapper>{cards}</CardsWrapper>;
  };

  render() {
    const { uploadingFileIds } = this.state;
    const length = uploadingFileIds.length;
    const isUploadFinished = !length;

    return (
      <>
        {popupWarning}
        <PopupContainer>
          <PopupHeader>
            <Button appearance="primary" onClick={this.onShow}>
              Show
            </Button>
            <div>Upload finished: {`${isUploadFinished}`}</div>
            <div>Uploading files: {length}</div>
          </PopupHeader>
          {this.renderCards()}
        </PopupContainer>
      </>
    );
  }
}

export default () => <PopupWrapper />;
