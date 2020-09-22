import React from 'react';
import { Component, SyntheticEvent } from 'react';
import {
  defaultCollectionName,
  genericFileId,
  audioFileId,
  audioNoCoverFileId,
  videoFileId,
  videoProcessingFailedId,
  docFileId,
  largePdfFileId,
  archiveFileId,
  unknownFileId,
  errorFileId,
  gifFileId,
  noMetadataFileId,
  createUploadMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button/custom-theme-button';
import { Card } from '../src';
import {
  UploadController,
  FileIdentifier,
  FileState,
  MediaClient,
} from '@atlaskit/media-client';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import {
  CardWrapper,
  CardFlowHeader,
  CardsWrapper,
} from '../example-helpers/styled';

const mediaClientConfig = createUploadMediaClientConfig();
const mediaClient = new MediaClient(mediaClientConfig);

export interface ComponentProps {}
export interface ComponentState {
  fileIds: string[];
}

const fileIds = [
  genericFileId.id,
  audioFileId.id,
  audioNoCoverFileId.id,
  videoFileId.id,
  gifFileId.id,
  videoProcessingFailedId.id,
  errorFileId.id,
  docFileId.id,
  largePdfFileId.id,
  archiveFileId.id,
  unknownFileId.id,
  noMetadataFileId.id,
];
class Example extends Component<ComponentProps, ComponentState> {
  uploadController?: UploadController;
  state: ComponentState = {
    fileIds,
  };

  renderCards() {
    const { fileIds } = this.state;
    const cards = fileIds.map(id => {
      const identifier: FileIdentifier = {
        id,
        mediaItemType: 'file',
        collectionName: defaultCollectionName,
      };
      return (
        <CardWrapper key={id}>
          <div>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={identifier}
            />
          </div>
        </CardWrapper>
      );
    });

    return <CardsWrapper>{cards}</CardsWrapper>;
  }

  cancelUpload = () => {
    if (this.uploadController) {
      this.uploadController.abort();
    }
  };

  uploadFile = async (event: SyntheticEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files || !event.currentTarget.files.length) {
      return;
    }

    const file = event.currentTarget.files[0];
    const uplodableFile = {
      content: file,
      name: file.name,
      collection: defaultCollectionName,
    };
    const uploadController = new UploadController();
    const stream = mediaClient.file.upload(uplodableFile, uploadController);

    this.uploadController = uploadController;
    this.addStream(stream);
  };

  addStream = (stream: ReplaySubject<FileState>) => {
    let isIdSaved = false;

    const subscription = stream.subscribe({
      next: state => {
        const { fileIds } = this.state;

        if (!isIdSaved && state.status === 'uploading') {
          isIdSaved = true;
          this.setState({
            fileIds: [state.id, ...fileIds],
          });
        }

        if (state.status === 'processing') {
          // here we have the public id, AKA upload is finished
          console.log('public id', state.id);
          subscription.unsubscribe();
        }
      },
      complete() {
        console.log('stream complete');
      },
      error(error) {
        console.log('stream error', error);
      },
    });
  };

  render() {
    return (
      <div>
        <CardFlowHeader>
          Upload file <input type="file" onChange={this.uploadFile} />
          <Button appearance="primary" onClick={this.cancelUpload}>
            Cancel upload
          </Button>
        </CardFlowHeader>
        {this.renderCards()}
      </div>
    );
  }
}

export default () => <Example />;
