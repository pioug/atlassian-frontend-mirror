import React from 'react';
import { Component } from 'react';
import { createUserMediaClient } from '@atlaskit/media-test-helpers';
import { Subscription } from 'rxjs/Subscription';
import { Card } from '@atlaskit/media-card';
import Button from '@atlaskit/button/standard-button';
import { CardsWrapper, Header } from '../example-helpers/styled';
import { FileIdentifier, RECENTS_COLLECTION } from '../src';

const mediaClient = createUserMediaClient();

const collectionName = RECENTS_COLLECTION;
export interface ExampleState {
  fileIds: string[];
}

class Example extends Component<{}, ExampleState> {
  subscription?: Subscription;

  state: ExampleState = {
    fileIds: [],
  };

  componentDidMount() {
    this.getItems();
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  renderCards() {
    const { fileIds } = this.state;
    const cards = fileIds.map((id) => {
      const identifier: FileIdentifier = {
        id,
        mediaItemType: 'file',
        collectionName,
      };

      return (
        <Card
          mediaClientConfig={mediaClient.config}
          key={id}
          identifier={identifier}
          dimensions={{
            width: 100,
            height: 50,
          }}
        />
      );
    });

    return (
      <CardsWrapper>
        <h1>Cards</h1>
        {cards}
      </CardsWrapper>
    );
  }

  getItems = () => {
    this.subscription = mediaClient.collection
      .getItems(collectionName)
      .subscribe({
        next: (items) => {
          const fileIds = items.map((item) => item.id);

          this.setState({
            fileIds,
          });
        },
      });
  };

  fetchNextPage = () => {
    mediaClient.collection.loadNextPage(collectionName);
  };

  getFirstPage = () => {
    // We are intentionally creating a new subscription to simulate "new items" case
    mediaClient.collection.getItems(collectionName).subscribe();
  };

  renderHeader = () => {
    const { fileIds } = this.state;

    return (
      <Header>
        <Button appearance="primary" onClick={this.fetchNextPage}>
          Fetch next page
        </Button>
        <Button appearance="primary" onClick={this.getFirstPage}>
          Get first page
        </Button>
        Items ({fileIds.length})
      </Header>
    );
  };

  render() {
    return (
      <>
        {this.renderHeader()}
        {this.renderCards()}
      </>
    );
  }
}

export default () => <Example />;
