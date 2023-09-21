import React, { useEffect, useMemo } from 'react';
import { Identifier } from '@atlaskit/media-client';
import { MediaViewer as MediaViewerNextGen } from '../media-viewer';
import { MediaMessage, MediaViewerProps } from './types';
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

  /**
   * Sends a notification for when MediaViewer opens or closes. We do so by
   * posting a message to a window of any target origin (i.e. '*') so please
   * ensure that we are NOT including any sensitive data in the message.
   * Read more details here: https://product-fabric.atlassian.net/browse/MEX-2566
   */
  useEffect(() => {
    const openingMsg: MediaMessage = {
      source: 'media',
      event: 'mediaViewerOpened',
    };
    parent.postMessage(openingMsg, '*');

    return () => {
      const closingMsg: MediaMessage = {
        source: 'media',
        event: 'mediaViewerClosed',
      };
      parent.postMessage(closingMsg, '*');
    };
  }, []);

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
