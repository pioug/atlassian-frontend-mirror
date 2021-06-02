import React from 'react';
import { Component, ReactNode } from 'react';
import {
  createStorybookMediaClient,
  imageFileId,
  genericFileId,
  gifFileId,
  defaultCollectionName,
  animatedFileId,
} from '@atlaskit/media-test-helpers';
import uuid from 'uuid/v4';
import { FileState } from '../src';
import { FileStateWrapper } from '../example-helpers/styled';

export interface ExampleState {
  fileStates: { [id: string]: FileState };
}

const context = createStorybookMediaClient();

class Example extends Component<{}, ExampleState> {
  state: ExampleState = {
    fileStates: {},
  };

  componentDidMount() {
    // Items from collection number 1
    this.fetchItem(imageFileId.id, imageFileId.collectionName);
    this.fetchItem(genericFileId.id, genericFileId.collectionName);
    this.fetchItem(imageFileId.id, imageFileId.collectionName); // Calling the first item again (we won't be requesting it twice)

    // Items coming another collection:
    this.fetchItem(animatedFileId.id, animatedFileId.collectionName);

    // No collection:
    this.fetchItem(imageFileId.id); // Calling first item without collection on pourpuse

    // This is an invalid item it won't show in the payload. It will be ignored in the backend.
    this.fetchItem(uuid(), defaultCollectionName); // No existing item

    // What's going to happen:
    // We will be doing three requests to /items:
    //  - one for collection 1 (returning 3 items)
    //  - another with collection 2 (returning 1 item)
    //  - another for the other item without collection.
  }

  fetchItem(id: string, collectionName?: string) {
    context.file.getFileState(id, { collectionName }).subscribe({
      next: (state) => {
        const { fileStates } = this.state;

        fileStates[state.id] = state;
        this.setState({
          fileStates,
        });
      },
    });
  }

  fetchFirstItem = () => {
    this.fetchItem(imageFileId.id, imageFileId.collectionName);
  };

  fetchNewItem = () => {
    this.fetchItem(gifFileId.id, gifFileId.collectionName);
  };

  renderFileState = (): ReactNode => {
    const { fileStates } = this.state;
    const states = Object.keys(fileStates).map((id) => {
      let name = '';
      const fileState = fileStates[id];
      if (fileState.status !== 'error') {
        name = fileState.name;
      }

      return (
        <FileStateWrapper key={id}>
          <h3>Id: {id}</h3>
          <div>Name: {name}</div>
        </FileStateWrapper>
      );
    });

    return <div>{states}</div>;
  };

  render() {
    return (
      <div>
        <h1>
          Demonstrates that we batch calls to /items endpoint for file metadata.
        </h1>
        <p>
          Please refer to the comments on the code to understand this example
        </p>
        <button onClick={this.fetchFirstItem}>Fetch first item</button>
        <button onClick={this.fetchNewItem}>Fetch new item</button>
        {this.renderFileState()}
      </div>
    );
  }
}

export default () => <Example />;
