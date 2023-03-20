import React from 'react';
import { MediaViewer as MediaViewerNextGen } from '../media-viewer';
import { MediaViewerProps } from './types';
import { normaliseInput } from './normaliseInput';

export const MediaViewer = ({
  featureFlags,
  onClose,
  mediaClient,
  selectedItem,
  collectionName,
  items,
  extensions,
  contextId,
  dataSource,
}: MediaViewerProps) => {
  const { normalisedSelectedItem, normalisedItems } = normaliseInput({
    selectedItem,
    collectionName,
    items,
    dataSource,
  });

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
