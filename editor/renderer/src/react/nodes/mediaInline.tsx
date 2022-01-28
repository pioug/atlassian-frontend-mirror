import React, { useEffect, useState } from 'react';
import { MediaInlineCard } from '@atlaskit/media-card';
import {
  ProviderFactory,
  WithProviders,
} from '@atlaskit/editor-common/provider-factory';
import { FileIdentifier } from '@atlaskit/media-client';
import { MediaProvider } from '../../ui/MediaCard';
import { MediaClientConfig } from '@atlaskit/media-core/auth';

type MediaInlineProviders = {
  mediaProvider?: Promise<MediaProvider>;
};

export type RenderMediaInlineProps = {
  identifier: FileIdentifier;
  mediaProvider?: Promise<MediaProvider>;
  children?: React.ReactNode;
};

export type MediaInlineProps = {
  id: string;
  collection?: string;
  providers: ProviderFactory;
};

export const RenderMediaInline: React.FC<RenderMediaInlineProps> = (props) => {
  const { mediaProvider } = props;
  const [viewMediaClientConfigState, setViewMediaClientConfigState] = useState<
    MediaClientConfig
  >({} as any);

  useEffect(() => {
    updateViewMediaClientConfigState(mediaProvider);
  }, [mediaProvider]);

  const updateViewMediaClientConfigState = async (
    mediaProvider: Promise<MediaProvider> | undefined,
  ) => {
    if (mediaProvider) {
      const mediaClientConfig = await mediaProvider;
      setViewMediaClientConfigState(mediaClientConfig.viewMediaClientConfig);
    }
  };

  return (
    <MediaInlineCard
      identifier={props.identifier}
      shouldOpenMediaViewer={true}
      mediaClientConfig={viewMediaClientConfigState}
    />
  );
};

const MediaInline: React.FC<MediaInlineProps> = (props) => {
  const { collection, id, providers } = props;
  const identifier: FileIdentifier = {
    id,
    mediaItemType: 'file',
    collectionName: collection!,
  };

  return (
    <span>
      <WithProviders
        providers={['mediaProvider']}
        providerFactory={providers}
        renderNode={(providers: MediaInlineProviders): React.ReactNode => {
          const { mediaProvider } = providers;
          return (
            <RenderMediaInline
              identifier={identifier}
              mediaProvider={mediaProvider}
            />
          );
        }}
      />
    </span>
  );
};

export default MediaInline;
