import React from 'react';
import { Component } from 'react';
import {
  createStorybookMediaClient,
  imageFileId,
  audioFileId,
} from '@atlaskit/media-test-helpers';
import { MediaStore, ItemsPayload } from '../src';

const mediaClient = createStorybookMediaClient();
const store = new MediaStore({
  authProvider: mediaClient.config.authProvider,
});

interface ExampleState {
  payload: ItemsPayload;
}

class Example extends Component<{}, ExampleState> {
  state: ExampleState = {
    payload: {
      items: [],
    },
  };

  async componentDidMount() {
    const response = await store.getItems(
      [imageFileId.id, audioFileId.id],
      imageFileId.collectionName,
    );

    this.setState({
      payload: response.data,
    });
  }

  render() {
    const { payload } = this.state;

    return (
      <div>
        <h1>MediaStore={'>'}getItems()</h1>
        <pre>
          {payload.items.length
            ? JSON.stringify(payload.items, undefined, 2)
            : 'fetching items...'}
        </pre>
      </div>
    );
  }
}

export default () => <Example />;
