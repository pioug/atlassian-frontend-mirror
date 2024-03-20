import React from 'react';

import ReactDOM from 'react-dom';

import { type MediaBaseAttributes } from '@atlaskit/adf-schema';
import type { FileIdentifier, MediaClientConfig } from '@atlaskit/media-client';
import { MediaViewer } from '@atlaskit/media-viewer';

interface RenderMediaViewerProps {
  mediaClientConfig: MediaClientConfig;
  onClose: () => void;
  selectedNodeAttrs: MediaBaseAttributes;
}

export const RenderMediaViewer = ({
  mediaClientConfig,
  onClose,
  selectedNodeAttrs,
}: RenderMediaViewerProps) => {
  const { id, collection = '' } = selectedNodeAttrs;
  const identifier: FileIdentifier = {
    id,
    mediaItemType: 'file',
    collectionName: collection,
  };
  return ReactDOM.createPortal(
    <MediaViewer
      collectionName={collection}
      items={[]}
      mediaClientConfig={mediaClientConfig!}
      selectedItem={identifier}
      onClose={onClose}
    />,
    document.body,
  );
};
