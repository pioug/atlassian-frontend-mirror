import React, { useMemo } from 'react';
import { Identifier } from '@atlaskit/media-client';
import { MediaViewer as MediaViewerNextGen } from '../media-viewer';
import { MediaViewerProps } from './types';
import { isSameIdentifier } from '../utils';
import { isFileIdentifier } from '@atlaskit/media-client';

const ensureCollectionName = (identifier: Identifier, collectionName: string) =>
  isFileIdentifier(identifier)
    ? {
        ...identifier,
        collectionName: identifier.collectionName || collectionName,
      }
    : identifier;

const normaliseItems = (
  items: Array<Identifier>,
  selectedItem: Identifier,
  collectionName: string,
) => {
  const selectedItemWithCollectionName = ensureCollectionName(
    selectedItem,
    collectionName,
  );

  let selectedIndex = -1;

  const itemsWithCollectionName = items.map((item, index) => {
    if (isSameIdentifier(item, selectedItemWithCollectionName)) {
      selectedIndex = index;
    }
    return ensureCollectionName(item, collectionName);
  });

  const itemsWithSelectedItem =
    selectedIndex === -1
      ? [selectedItem, ...itemsWithCollectionName]
      : itemsWithCollectionName;

  return {
    items: itemsWithSelectedItem,
    selectedItem: selectedItemWithCollectionName,
  };
};

export const MediaViewer = ({
  featureFlags,
  onClose,
  mediaClient,
  selectedItem,
  collectionName,
  items,
  extensions,
  contextId,
}: MediaViewerProps) => {
  const { items: normalisedItems, selectedItem: normalisedSelectedItem } =
    useMemo(
      () => normaliseItems(items, selectedItem, collectionName),
      [items, selectedItem, collectionName],
    );

  return (
    <MediaViewerNextGen
      mediaClient={mediaClient}
      selectedItem={normalisedSelectedItem}
      onClose={onClose}
      items={normalisedItems}
      featureFlags={featureFlags}
      extensions={extensions}
      contextId={contextId}
    />
  );
};
