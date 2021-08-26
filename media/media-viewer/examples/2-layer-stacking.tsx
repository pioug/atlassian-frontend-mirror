import React from 'react';
import Button from '@atlaskit/button/standard-button';
import ModalDialog, { ModalBody } from '@atlaskit/modal-dialog';
import {
  createStorybookMediaClientConfig,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { imageItem } from '../example-helpers';
import { MediaViewer } from '../src';
import { Identifier } from '@atlaskit/media-client';

const mediaClientConfig = createStorybookMediaClientConfig();

export type State = {
  selectedItem?: Identifier;
};

export default class Example extends React.Component<{}, State> {
  state: State = { selectedItem: undefined };
  setItem = (selectedItem: Identifier) => () => {
    this.setState({ selectedItem });
  };

  render() {
    return (
      <div>
        <ModalDialog>
          <ModalBody>
            <h1>This is a modal dialog</h1>
            <p>MediaViewer should open on top of the modal dialog</p>
            <Button onClick={this.setItem(imageItem)}>Open MediaViewer</Button>
          </ModalBody>
        </ModalDialog>

        {this.state.selectedItem && (
          <MediaViewer
            mediaClientConfig={mediaClientConfig}
            selectedItem={this.state.selectedItem}
            dataSource={{ list: [this.state.selectedItem] }}
            collectionName={defaultCollectionName}
            onClose={() => this.setState({ selectedItem: undefined })}
          />
        )}
      </div>
    );
  }
}
