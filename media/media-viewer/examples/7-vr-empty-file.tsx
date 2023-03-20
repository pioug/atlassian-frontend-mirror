import React from 'react';
import {
  defaultCollectionName,
  createStorybookMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import { Card } from '@atlaskit/media-card';
import { Identifier } from '@atlaskit/media-client';
import { ButtonList, Group, MainWrapper } from '../example-helpers/MainWrapper';
import { emptyImage } from '../example-helpers';
import { MediaViewer } from '../src';
import { I18NWrapper } from '@atlaskit/media-test-helpers';
import { addGlobalEventEmitterListeners } from '@atlaskit/media-test-helpers';

addGlobalEventEmitterListeners();

const mediaClientConfig = createStorybookMediaClientConfig();

export type State = {
  selectedIdentifier?: Identifier;
};

export default class Example extends React.Component<{}, State> {
  state: State = { selectedIdentifier: undefined };

  setItem = (selectedIdentifier: Identifier) => () => {
    this.setState({ selectedIdentifier });
  };

  createItem = (identifier: Identifier, title: string) => {
    const onClick = this.setItem(identifier);

    return (
      <div>
        <h4>{title}</h4>
        <Card
          identifier={identifier}
          mediaClientConfig={mediaClientConfig}
          onClick={onClick}
        />
      </div>
    );
  };

  render() {
    const { selectedIdentifier } = this.state;

    return (
      <I18NWrapper>
        <MainWrapper>
          <Group>
            <h2>Empty</h2>
            <ButtonList>
              <li>{this.createItem(emptyImage, 'Empty File (version: 0)')}</li>
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
