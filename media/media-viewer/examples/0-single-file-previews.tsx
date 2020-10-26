import React from 'react';
import {
  externalImageIdentifier,
  defaultCollectionName,
  createStorybookMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import { Card } from '@atlaskit/media-card';
import { Identifier } from '@atlaskit/media-client';
import { ButtonList, Container, Group } from '../example-helpers/styled';
import {
  archiveItem,
  audioItem,
  audioItemNoCover,
  docItem,
  bigDocItem,
  imageItem,
  emptyImage,
  largeImageItem,
  smallImageItem,
  unsupportedItem,
  videoHorizontalFileItem,
  videoItem,
  videoLargeFileItem,
  videoProcessingFailedItem,
  wideImageItem,
  verticalImageItem,
  videoSquareFileIdItem,
  zipItem,
  zipWithNestedFolderItem,
  zipItemMultipleFoldersAtRoot,
  zipItemLargeInnerFile,
  zipJiraArchiveItem,
  zipEncryptedItem,
  codeItem,
  emailItem,
  emailFailedItem,
} from '../example-helpers';
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
        <Container>
          <Group>
            <h2>Image</h2>
            <ButtonList>
              <li>{this.createItem(imageItem, 'Picture')}</li>
              <li>{this.createItem(smallImageItem, 'Icon')}</li>
              <li>{this.createItem(wideImageItem, 'Wide')}</li>
              <li>{this.createItem(verticalImageItem, 'Vertical')}</li>
              <li>{this.createItem(largeImageItem, 'Large')}</li>
            </ButtonList>
          </Group>
          <Group>
            <h2>Document</h2>
            <ButtonList>
              <li>{this.createItem(docItem, 'Normal')}</li>
              <li>{this.createItem(bigDocItem, 'Large')}</li>
            </ButtonList>
          </Group>
          <Group>
            <h2>Video</h2>
            <ButtonList>
              <li>{this.createItem(videoHorizontalFileItem, 'Horizontal')}</li>
              <li>{this.createItem(videoLargeFileItem, 'Large')}</li>
              <li>{this.createItem(videoItem, 'Normal')}</li>
              <li>{this.createItem(videoSquareFileIdItem, 'Square + SD')}</li>
            </ButtonList>
          </Group>
          <Group>
            <h2>Audio</h2>
            <ButtonList>
              <li>{this.createItem(audioItem, 'Normal')}</li>
              <li>{this.createItem(audioItemNoCover, 'Song without cover')}</li>
            </ButtonList>
          </Group>
          <Group>
            <h2>External images</h2>
            <ButtonList>
              <li>
                {this.createItem(externalImageIdentifier, 'Atlassian logo')}
              </li>
            </ButtonList>
          </Group>
          <Group>
            <h2>Archives</h2>
            <ButtonList>
              <li>{this.createItem(zipItem, 'Zip with all types')}</li>
              <li>
                {this.createItem(
                  zipWithNestedFolderItem,
                  'Zip with nested folders',
                )}
              </li>
              <li>
                {this.createItem(
                  zipItemMultipleFoldersAtRoot,
                  'Zip with folders at root',
                )}
              </li>
              <li>
                {this.createItem(zipItemLargeInnerFile, 'Zip with large file')}
              </li>
              <li>
                {this.createItem(zipJiraArchiveItem, 'Jira zipped folder')}
              </li>
              <li>{this.createItem(zipEncryptedItem, 'Zip encrypted file')}</li>
            </ButtonList>
          </Group>
          <Group>
            <h2>Code item</h2>
            <ButtonList>
              <li>{this.createItem(codeItem, 'Normal')}</li>
            </ButtonList>
          </Group>
          <Group>
            <h2>Email item</h2>
            <ButtonList>
              <li>{this.createItem(emailItem, 'Normal')}</li>
            </ButtonList>
          </Group>
          å
          <Group>
            <h2>Errors</h2>
            <ButtonList>
              <li>{this.createItem(unsupportedItem, 'Unsupported item')}</li>
              <li>
                {this.createItem(emailFailedItem, 'Unsupported email item')}
              </li>
              <li>{this.createItem(archiveItem, 'Archive has no preview')}</li>
              <li>
                {this.createItem(
                  videoProcessingFailedItem,
                  'Failed processing',
                )}
              </li>
              <li>{this.createItem(emptyImage, 'Empty File (version: 0)')}</li>
            </ButtonList>
          </Group>
          {selectedIdentifier && (
            <MediaViewer
              mediaClientConfig={mediaClientConfig}
              selectedItem={selectedIdentifier}
              dataSource={{ list: [selectedIdentifier] }}
              collectionName={defaultCollectionName}
              onClose={() => this.setState({ selectedIdentifier: undefined })}
            />
          )}
        </Container>
      </I18NWrapper>
    );
  }
}
