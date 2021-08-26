import React from 'react';
import { Component } from 'react';
import { Identifier, isExternalImageIdentifier } from '@atlaskit/media-client';
import { MediaViewer as MediaViewerNextGen } from '../media-viewer';
import { ItemSource } from '../domain';
import { MediaViewerProps, MediaViewerDataSource } from './types';
import { getIdentifierCollection } from '../utils/getIdentifierCollection';
import { getSelectedIndex } from '../utils';

export interface MediaViewerState {}

export class MediaViewer extends Component<MediaViewerProps, MediaViewerState> {
  // returns a valid MV data source including current the card identifier
  getDataSourceWithSelectedItem = (
    dataSource: MediaViewerDataSource,
    selectedItem: Identifier,
  ): MediaViewerDataSource => {
    // we want to ensure the card identifier is in the list
    const { list } = dataSource;
    if (list) {
      const selectedItemIndex = getSelectedIndex(list, selectedItem);

      if (selectedItemIndex === -1) {
        return {
          list: [selectedItem, ...list],
        };
      }
    }

    return dataSource;
  };

  render(): JSX.Element {
    const {
      featureFlags,
      onClose,
      mediaClient,
      selectedItem,
      collectionName,
      dataSource,
      pageSize,
      extensions,
      contextId,
    } = this.props;
    const defaultPageSize = 30;
    const dataSourceWithSelectedItem = this.getDataSourceWithSelectedItem(
      dataSource,
      selectedItem,
    );

    if (dataSourceWithSelectedItem.list) {
      const items: Identifier[] = dataSourceWithSelectedItem.list.map(
        (identifier) => ({
          ...identifier,
          collectionName: getIdentifierCollection(identifier, collectionName),
        }),
      );
      const itemSource: ItemSource = {
        kind: 'ARRAY',
        items: items,
      };
      const identifier = {
        ...selectedItem,
        collectionName,
      };
      return (
        <MediaViewerNextGen
          mediaClient={mediaClient}
          selectedItem={identifier}
          onClose={onClose}
          itemSource={itemSource}
          featureFlags={featureFlags}
          extensions={extensions}
          contextId={contextId}
        />
      );
    } else if (dataSourceWithSelectedItem.collectionName) {
      if (isExternalImageIdentifier(selectedItem)) {
        // if integrators pass an external image + collection, we remove the collection and just show the selectedItem
        return (
          <MediaViewerNextGen
            mediaClient={mediaClient}
            selectedItem={selectedItem}
            onClose={onClose}
            itemSource={{ kind: 'ARRAY', items: [selectedItem] }}
            featureFlags={featureFlags}
            contextId={contextId}
          />
        );
      }

      const itemSource: ItemSource = {
        kind: 'COLLECTION',
        collectionName: dataSourceWithSelectedItem.collectionName,
        pageSize: pageSize || defaultPageSize,
      };
      const identifier = {
        ...selectedItem,
        collectionName: dataSourceWithSelectedItem.collectionName,
      };

      return (
        <MediaViewerNextGen
          mediaClient={mediaClient}
          selectedItem={identifier}
          onClose={onClose}
          itemSource={itemSource}
          featureFlags={featureFlags}
          contextId={contextId}
        />
      );
    } else {
      throw new Error();
    }
  }
}
