import { Identifier, MediaClient } from '@atlaskit/media-client';
import { MediaViewerFeatureFlags } from '../newgen/domain';
import { ReactNode } from 'react';

export interface MediaViewerDataSource {
  list?: Array<Identifier>;
  collectionName?: string;
}

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
  readonly mediaClient: MediaClient;
  readonly selectedItem: Identifier;
  readonly dataSource: MediaViewerDataSource;

  readonly collectionName: string;
  readonly pageSize?: number;

  readonly onClose?: () => void;

  readonly featureFlags?: MediaViewerFeatureFlags;
  readonly extensions?: MediaViewerExtensions;
  readonly contextId?: string;
}
