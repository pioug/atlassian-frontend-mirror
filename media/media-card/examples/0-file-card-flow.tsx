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
  emptyImageFileId,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button/standard-button';
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
import { MainWrapper } from '../example-helpers';

const mediaClientConfig = createUploadMediaClientConfig();
const mediaClient = new MediaClient(mediaClientConfig);

export interface ComponentProps {}

export interface ComponentState {
  fileIds: string[];
  fileIdsDescription: string[];
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
  emptyImageFileId.id,
];

const fileIdsDescription = [
  'Generic file',
  'Audio file',
  'Audio no cover file',
  'Video file',
  'Gif file',
  'Video processing failed',
  'Error file',
  'Doc file',
  'Large pdf file',
  'Archive file',
  'Unknown file',
  'No metadata file',
  'Empty image file',
];
class Example extends Component<ComponentProps, ComponentState> {
  uploadController?: UploadController;
  state: ComponentState = {
    fileIds,
    fileIdsDescription,
  };

  renderCards() {
    const { fileIds, fileIdsDescription } = this.state;
    const cards = fileIds.map((id, order) => {
      const identifier: FileIdentifier = {
        id,
        mediaItemType: 'file',
        collectionName: defaultCollectionName,
      };
      return (
        <CardWrapper key={id}>
          <div>
            <h3>{fileIdsDescription[order]}</h3>
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
      next: (state) => {
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
      <>
        <CardFlowHeader>
          Upload file <input type="file" onChange={this.uploadFile} />
          <Button appearance="primary" onClick={this.cancelUpload}>
            Cancel upload
          </Button>
        </CardFlowHeader>
        {this.renderCards()}
      </>
    );
  }
}

export default () => (
  <MainWrapper>
    <Example />
  </MainWrapper>
);

// We export the example without FFs dropdown for SSR test:
// packages/media/media-card/src/__tests__/unit/server-side-hydrate.tsx
export const SSR = () => <Example />;
