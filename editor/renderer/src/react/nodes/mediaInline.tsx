import React, { useEffect, useState } from 'react';
import { MediaInlineCard } from '@atlaskit/media-card';
import {
  MediaInlineCardErroredView,
  MediaInlineCardLoadingView,
  messages,
} from '@atlaskit/media-ui';
import {
  ProviderFactory,
  WithProviders,
} from '@atlaskit/editor-common/provider-factory';
import { FileIdentifier } from '@atlaskit/media-client';
import { getClipboardAttrs, MediaProvider } from '../../ui/MediaCard';
import { MediaClientConfig } from '@atlaskit/media-core/auth';
import { createIntl, injectIntl, WrappedComponentProps } from 'react-intl-next';

type MediaInlineProviders = {
  mediaProvider?: Promise<MediaProvider>;
};

export type RenderMediaInlineProps = {
  identifier: FileIdentifier;
  mediaProvider: Promise<MediaProvider>;
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
    MediaClientConfig | undefined
  >();

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

  /*
   * Only show the loading view if the media provider is not ready
   * prevents calling the media API before the provider is ready
   */
  if (!viewMediaClientConfigState) {
    return <MediaInlineCardLoadingView message="" isSelected={false} />;
  }

  return (
    <MediaInlineCard
      identifier={props.identifier}
      shouldOpenMediaViewer={true}
      mediaClientConfig={viewMediaClientConfigState}
    />
  );
};

const MediaInline: React.FC<MediaInlineProps & WrappedComponentProps> = (
  props,
) => {
  const { collection, id, providers, intl } = props;
  const identifier: FileIdentifier = {
    id,
    mediaItemType: 'file',
    collectionName: collection!,
  };
  const defaultIntl = createIntl({ locale: 'en' });

  return (
    <span
      {...getClipboardAttrs({ id, collection })}
      data-node-type="mediaInline"
    >
      <WithProviders
        providers={['mediaProvider']}
        providerFactory={providers}
        renderNode={(providers: MediaInlineProviders): React.ReactNode => {
          const { mediaProvider } = providers;
          if (!mediaProvider) {
            return (
              <MediaInlineCardErroredView
                message={(intl || defaultIntl).formatMessage(
                  messages.couldnt_load_file,
                )}
              />
            );
          }
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

export default injectIntl(MediaInline);
