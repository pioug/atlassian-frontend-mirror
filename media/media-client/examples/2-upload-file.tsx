import React from 'react';
import { Component, SyntheticEvent } from 'react';
import {
  defaultCollectionName,
  mediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';
import { MediaClientConfig } from '@atlaskit/media-core';
import { FileState, MediaClient, UploadController } from '../src';
import { FilesWrapper, FileWrapper } from '../example-helpers/styled';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';

export interface ComponentProps {}
export interface ComponentState {
  files: { [id: string]: FileState };
}

const mediaClientConfig: MediaClientConfig = {
  authProvider: mediaPickerAuthProvider('asap'),
};
const mediaClient = new MediaClient(mediaClientConfig);

class Example extends Component<ComponentProps, ComponentState> {
  fileStreams: ReplaySubject<FileState>[];
  uploadController?: UploadController;
  subscription?: Subscription;

  constructor(props: ComponentProps) {
    super(props);

    this.state = {
      files: {},
    };
    this.fileStreams = [];
  }

  onFileUpdate = (streamId: number) => (state: FileState) => {
    console.log('on update', streamId, state);
    this.setState({
      files: {
        ...this.state.files,
        [streamId]: state,
      },
    });
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
    const streamId = new Date().getTime();

    const subscription = stream.subscribe({
      next: this.onFileUpdate(streamId),
      complete() {
        console.log('stream complete');
      },
      error: (error) => {
        console.log('stream error', error);
        if (error === 'canceled') {
          const stream: FileState = {
            id: this.state.files[streamId].id,
            status: 'error',
            message: 'upload canceled',
          };

          this.onFileUpdate(streamId)(stream);
        }
      },
    });

    this.subscription = subscription;

    this.fileStreams.push(stream);
  };

  renderFiles = () => {
    const { files } = this.state;
    const fileData = Object.keys(files).map((fileId, key) => {
      const file = files[fileId];
      let name, progress, message;

      if (file.status !== 'error') {
        name = <div>name: {file.name}</div>;
      }

      if (file.status === 'uploading') {
        progress = <div>progress: {file.progress}</div>;
      }

      if (file.status === 'error') {
        message = <div>message: {file.message}</div>;
      }

      return (
        <FileWrapper status={file.status} key={key}>
          <div>Id: {file.id}</div>
          <div>Status: {file.status}</div>
          <div>
            {name}
            {progress}
            {message}
          </div>
        </FileWrapper>
      );
    });

    return <FilesWrapper>{fileData}</FilesWrapper>;
  };

  cancelUpload = () => {
    if (this.uploadController) {
      this.uploadController.abort();
    }
  };

  unsubscribe = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };

  render() {
    return (
      <>
        <input type="file" onChange={this.uploadFile} />
        <button onClick={this.unsubscribe}>Unsubscribe</button>
        <button onClick={this.cancelUpload}>Cancel upload</button>
        <div>
          <h1>Files</h1>
          {this.renderFiles()}
        </div>
      </>
    );
  }
}

export default () => (
  <div>
    <Example />
  </div>
);
