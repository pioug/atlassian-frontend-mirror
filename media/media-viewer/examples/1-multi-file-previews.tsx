import React from 'react';
import Button from '@atlaskit/button/standard-button';
import AkSpinner from '@atlaskit/spinner';
import {
  externalImageIdentifier,
  externalSmallImageIdentifier,
  createStorybookMediaClient,
  defaultCollectionName,
  defaultMediaPickerCollectionName,
} from '@atlaskit/media-test-helpers';
import { ButtonList, Container, Group } from '../example-helpers/styled';
import {
  docIdentifier,
  largePdfIdentifier,
  imageIdentifier,
  imageIdentifier2,
  unsupportedIdentifier,
  videoHorizontalFileItem,
  videoIdentifier,
  wideImageIdentifier,
  audioItem,
  audioItemNoCover,
} from '../example-helpers';
import { MediaViewer, MediaViewerDataSource } from '../src';
import { videoFileId } from '@atlaskit/media-test-helpers';
import { I18NWrapper } from '@atlaskit/media-test-helpers';
import { Identifier, FileIdentifier, MediaStore } from '@atlaskit/media-client';
import { Card } from '@atlaskit/media-card';
import { addGlobalEventEmitterListeners } from '@atlaskit/media-test-helpers';

addGlobalEventEmitterListeners();

const mediaClient = createStorybookMediaClient();

export type State = {
  selected?: {
    dataSource: MediaViewerDataSource;
    identifier: Identifier;
  };
  firstItemFromDefaultCollection?: FileIdentifier;
  firstItemFromMediaPickerCollection?: FileIdentifier;
};

export default class Example extends React.Component<{}, State> {
  state: State = {};

  async componentDidMount() {
    const firstDefaultCollectionItem = await this.getFirstCollectionItem(
      defaultCollectionName,
    );
    this.setState({
      firstItemFromDefaultCollection: {
        id: firstDefaultCollectionItem.id,
        mediaItemType: 'file',
        occurrenceKey: firstDefaultCollectionItem.occurrenceKey,
      },
    });

    const firstDefaultMPCollectionItem = await this.getFirstCollectionItem(
      defaultMediaPickerCollectionName,
    );

    this.setState({
      firstItemFromMediaPickerCollection: {
        id: firstDefaultMPCollectionItem.id,
        mediaItemType: 'file',
        occurrenceKey: firstDefaultMPCollectionItem.occurrenceKey,
      },
    });
  }

  getFirstCollectionItem = async (collectionName: string) => {
    const store = new MediaStore(mediaClient.config);
    const items = (await store.getCollectionItems(collectionName, { limit: 1 }))
      .data.contents;

    return items[0];
  };

  private openList = () => {
    this.setState({
      selected: {
        dataSource: {
          list: [
            externalImageIdentifier,
            imageIdentifier,
            videoIdentifier,
            externalSmallImageIdentifier,
            videoHorizontalFileItem,
            wideImageIdentifier,
            audioItem,
            audioItemNoCover,
            docIdentifier,
            largePdfIdentifier,
            imageIdentifier2,
            unsupportedIdentifier,
          ],
        },
        identifier: imageIdentifier,
      },
    });
  };

  private openListWithItemNotOnList = () => {
    this.setState({
      selected: {
        dataSource: {
          list: [
            imageIdentifier,
            videoIdentifier,
            videoHorizontalFileItem,
            wideImageIdentifier,
            audioItem,
            audioItemNoCover,
            largePdfIdentifier,
            imageIdentifier2,
            unsupportedIdentifier,
          ],
        },
        identifier: docIdentifier,
      },
    });
  };

  private openErrorList = () => {
    const invalidItem: Identifier = {
      mediaItemType: 'file',
      id: 'invalid-id',
      occurrenceKey: 'invalid-key',
    };

    this.setState({
      selected: {
        dataSource: {
          list: [
            imageIdentifier,
            invalidItem,
            wideImageIdentifier,
            videoIdentifier,
            videoHorizontalFileItem,
            audioItem,
            audioItemNoCover,
            docIdentifier,
            largePdfIdentifier,
            imageIdentifier2,
            unsupportedIdentifier,
          ],
        },
        identifier: imageIdentifier,
      },
    });
  };

  private openCollection = (
    identifier: Identifier,
    collectionName: string,
  ) => () => {
    this.setState({
      selected: {
        dataSource: { collectionName },
        identifier,
      },
    });
  };

  private openNotFound = () => {
    this.setState({
      selected: {
        dataSource: { list: [imageIdentifier, wideImageIdentifier] },
        identifier: {
          mediaItemType: 'file',
          id: videoFileId.id,
          occurrenceKey: 'testOccurrenceKey',
        },
      },
    });
  };

  private openInvalidId = () => {
    const invalidItem: Identifier = {
      mediaItemType: 'file',
      id: 'invalid-id',
      occurrenceKey: 'invalid-key',
    };

    this.setState({
      selected: {
        identifier: invalidItem,
        dataSource: { list: [invalidItem] },
      },
    });
  };

  private openInvalidCollection = () => {
    this.setState({
      selected: {
        identifier: imageIdentifier,
        dataSource: { collectionName: 'invalid-name' },
      },
    });
  };

  private onClose = () => {
    this.setState({ selected: undefined });
  };

  render() {
    const {
      firstItemFromDefaultCollection,
      firstItemFromMediaPickerCollection,
      selected,
    } = this.state;
    return (
      <I18NWrapper>
        <Container>
          <Group>
            <h2>File lists</h2>
            <ButtonList>
              <li>
                <Button onClick={this.openList}>Small list</Button>
              </li>
              <li>
                <Button onClick={this.openListWithItemNotOnList}>
                  Small list with selected item not on the list
                </Button>
              </li>
            </ButtonList>
          </Group>

          <Group>
            <h2>Collection names</h2>
            <ButtonList>
              <li>
                <h4>{defaultCollectionName}</h4>
                {firstItemFromDefaultCollection ? (
                  <Card
                    mediaClientConfig={mediaClient.config}
                    identifier={{
                      collectionName: defaultCollectionName,
                      id: firstItemFromDefaultCollection.id,
                      mediaItemType: 'file',
                    }}
                    onClick={this.openCollection(
                      firstItemFromDefaultCollection,
                      defaultCollectionName,
                    )}
                  />
                ) : (
                  <AkSpinner />
                )}
              </li>
              <li>
                <h4>{defaultMediaPickerCollectionName}</h4>
                {firstItemFromMediaPickerCollection ? (
                  <Card
                    mediaClientConfig={mediaClient.config}
                    identifier={{
                      collectionName: defaultMediaPickerCollectionName,
                      id: firstItemFromMediaPickerCollection.id,
                      mediaItemType: 'file',
                    }}
                    onClick={this.openCollection(
                      firstItemFromMediaPickerCollection,
                      defaultMediaPickerCollectionName,
                    )}
                  />
                ) : (
                  <AkSpinner />
                )}
              </li>
            </ButtonList>
          </Group>

          <Group>
            <h2>Errors</h2>
            <ButtonList>
              <li>
                <Button onClick={this.openNotFound}>
                  Selected item not found
                </Button>
              </li>
              <li>
                <Button onClick={this.openInvalidId}>Invalid ID</Button>
              </li>
              <li>
                <Button onClick={this.openInvalidCollection}>
                  Invalid collection name
                </Button>
              </li>
              <li>
                <Button onClick={this.openErrorList}>Error list</Button>
              </li>
            </ButtonList>
          </Group>

          {selected && (
            <MediaViewer
              mediaClientConfig={mediaClient.config}
              selectedItem={selected.identifier}
              dataSource={selected.dataSource}
              collectionName={defaultCollectionName}
              onClose={this.onClose}
              pageSize={5}
            />
          )}
        </Container>
      </I18NWrapper>
    );
  }
}
