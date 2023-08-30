import React from 'react';

import { Identifier, MediaClient } from '@atlaskit/media-client';
import {
  createStorybookMediaClientConfig,
  defaultCollectionName,
  I18NWrapper,
} from '@atlaskit/media-test-helpers';

import { MediaViewer } from '../src';
import { zipItem } from '../example-helpers';
import { NativeMediaPreview } from '../example-helpers/NativeMediaPreview';
import { ButtonList, Group, MainWrapper } from '../example-helpers/MainWrapper';

interface State {
  selectedIdentifier?: Identifier;
}

const mediaClientConfig = createStorybookMediaClientConfig();
const mediaClient = new MediaClient(mediaClientConfig);

export default class Example extends React.Component<{}, State> {
  state: State = { selectedIdentifier: undefined };

  createItem = (identifier: Identifier, title: string) => {
    return (
      <div>
        <h4>{title}</h4>
        <NativeMediaPreview
          identifier={identifier}
          mediaClient={mediaClient}
          onClick={() => this.setState({ selectedIdentifier: identifier })}
        />
      </div>
    );
  };

  render() {
    const selectedIdentifier = this.state.selectedIdentifier;
    return (
      <I18NWrapper>
        <MainWrapper>
          <Group>
            <h2>Archive side bar</h2>
            <ButtonList>
              <li>{this.createItem(zipItem, 'Zip with all types')}</li>
            </ButtonList>
          </Group>
          {selectedIdentifier && (
            <MediaViewer
              mediaClientConfig={mediaClientConfig}
              selectedItem={selectedIdentifier}
              items={[selectedIdentifier]}
              collectionName={defaultCollectionName}
              onClose={() => this.setState({ selectedIdentifier: undefined })}
            />
          )}
        </MainWrapper>
      </I18NWrapper>
    );
  }
}
