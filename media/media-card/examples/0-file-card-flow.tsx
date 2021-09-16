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

type fileId = {
  id: string;
  name?: string;
};
export interface ComponentState {
  fileIds: fileId[];
}

const fileIds = [
  { id: genericFileId.id, name: 'Generic file' },
  { id: audioFileId.id, name: 'Audio file' },
  { id: audioNoCoverFileId.id, name: 'Audio no cover file' },
  { id: videoFileId.id, name: 'Video file' },
  { id: gifFileId.id, name: 'Gif file' },
  { id: videoProcessingFailedId.id, name: 'Video processing failed' },
  { id: errorFileId.id, name: 'Error file' },
  { id: docFileId.id, name: 'Doc file' },
  { id: largePdfFileId.id, name: 'Large pdf file' },
  { id: archiveFileId.id, name: 'Archive file' },
  { id: unknownFileId.id, name: 'Unknown file' },
  { id: noMetadataFileId.id, name: 'No metadata file' },
  { id: emptyImageFileId.id, name: 'Empty image file' },
];

class Example extends Component<ComponentProps, ComponentState> {
  uploadController?: UploadController;
  state: ComponentState = {
    fileIds,
  };

  renderCards() {
    const { fileIds } = this.state;
    const cards = fileIds.map(({ id, name }) => {
      const identifier: FileIdentifier = {
        id,
        mediaItemType: 'file',
        collectionName: defaultCollectionName,
      };
      return (
        <CardWrapper key={id}>
          <div>
            <h3>{name}</h3>
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
            fileIds: [{ id: state.id }, ...fileIds],
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
