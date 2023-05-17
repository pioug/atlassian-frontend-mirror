import { Identifier, MediaClient } from '@atlaskit/media-client';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { ReactNode } from 'react';

export type FileStateFlags = {
  wasStatusProcessing: boolean;
  wasStatusUploading: boolean;
};

export interface MediaViewerExtensionsActions {
  close: () => void;
}

export interface MediaViewerExtensions {
  sidebar?: {
    icon: ReactNode;
    renderer: (
      selectedIdentifier: Identifier,
      actions: MediaViewerExtensionsActions,
    ) => ReactNode;
  };
}

export interface MediaViewerProps {
  // Instance of media client.
  readonly mediaClient: MediaClient;
  // Media item from data source that will be visible to user.
  readonly selectedItem: Identifier;
  // Data source for media viewer.
  readonly items: Array<Identifier>;
  // The collection name.
  readonly collectionName: string;
  // Callback function to be called when user closes media viewer.
  readonly onClose?: () => void;
  // Includes media features like caption, timestamp etc.
  readonly featureFlags?: MediaFeatureFlags;
  // Sidebar configuration for media viewer.
  readonly extensions?: MediaViewerExtensions;
  // Retrieve auth based on a given context.
  readonly contextId?: string;
}
