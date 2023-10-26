import React, { useEffect, useState, useCallback } from 'react';
import type { InlineCardEvent } from '@atlaskit/media-card';
import { MediaInlineCard } from '@atlaskit/media-card';
import {
  MediaInlineCardErroredView,
  MediaInlineCardLoadingView,
  messages,
} from '@atlaskit/media-ui';
import type {
  ContextIdentifierProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { FileIdentifier, FileState } from '@atlaskit/media-client';
import { getMediaClient } from '@atlaskit/media-client-react';
import type { MediaProvider, ClipboardAttrs } from '../../ui/MediaCard';
import { getClipboardAttrs, mediaIdentifierMap } from '../../ui/MediaCard';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import type { IntlShape, WrappedComponentProps } from 'react-intl-next';
import { createIntl, injectIntl } from 'react-intl-next';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import type { RendererAppearance } from '../../ui/Renderer/types';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import type { RendererContext } from '../types';

type MediaInlineProviders = {
  mediaProvider?: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
};

export type RenderMediaInlineProps = {
  identifier: FileIdentifier;
  clipboardAttrs: ClipboardAttrs;
  mediaInlineProviders: MediaInlineProviders;
  intl?: IntlShape;
  children?: React.ReactNode;
  collection?: string;
  eventHandlers?: EventHandlers;
  rendererAppearance?: RendererAppearance;
  featureFlags?: MediaFeatureFlags;
  rendererContext?: RendererContext;
};

export type MediaInlineProps = {
  id: string;
  providers: ProviderFactory;
  collection?: string;
  eventHandlers?: EventHandlers;
  rendererAppearance?: RendererAppearance;
  featureFlags?: MediaFeatureFlags;
};

export const RenderMediaInline: React.FC<RenderMediaInlineProps> = ({
  rendererAppearance,
  intl,
  clipboardAttrs,
  mediaInlineProviders,
  collection: collectionName,
  featureFlags,
  eventHandlers,
  identifier,
}) => {
  const [contextIdentifierProvider, setContextIdentifierProvider] = useState<
    ContextIdentifierProvider | undefined
  >();

  const [viewMediaClientConfigState, setViewMediaClientConfigState] = useState<
    MediaClientConfig | undefined
  >();

  const [fileState, setFileState] = useState<FileState | undefined>();

  const updateContext = async (
    contextIdentifierProvider?: Promise<ContextIdentifierProvider>,
  ) => {
    if (contextIdentifierProvider) {
      const resolvedContextID = await contextIdentifierProvider;
      setContextIdentifierProvider(resolvedContextID);
    }
  };

  const updateFileState = useCallback(
    async (id: string, mediaClientConfig: MediaClientConfig) => {
      const mediaClient = getMediaClient(mediaClientConfig);
      const options = {
        collectionName,
      };
      try {
        const fileState = await mediaClient.file.getCurrentState(id, options);
        setFileState(fileState);
      } catch (error) {
        // do not set state on error
      }
    },
    [collectionName],
  );

  useEffect(() => {
    const { id } = identifier;
    const nodeIsInCache = id && mediaIdentifierMap.has(id);
    if (!nodeIsInCache) {
      mediaIdentifierMap.set(identifier.id as string, {
        ...identifier,
        collectionName,
      });
    }
    return () => {
      mediaIdentifierMap.delete(id);
    };
  }, [identifier, collectionName]);

  useEffect(() => {
    const { mediaProvider, contextIdentifierProvider } = mediaInlineProviders;
    const { id } = clipboardAttrs;
    updateViewMediaClientConfigState(mediaProvider);
    updateContext(contextIdentifierProvider);
    id &&
      viewMediaClientConfigState &&
      updateFileState(id, viewMediaClientConfigState);
  }, [
    mediaInlineProviders,
    contextIdentifierProvider,
    clipboardAttrs,
    viewMediaClientConfigState,
    updateFileState,
  ]);

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

  const handleMediaInlineClick = (result: InlineCardEvent) => {
    if (eventHandlers?.media?.onClick) {
      eventHandlers?.media?.onClick(result);
    }
  };
  const shouldOpenMediaViewer = rendererAppearance !== 'mobile';
  const shouldDisplayToolTip = rendererAppearance !== 'mobile';
  const { mediaProvider } = mediaInlineProviders;
  const { id, collection } = clipboardAttrs;
  return (
    <span
      {...getClipboardAttrs({
        id,
        collection,
        contextIdentifierProvider,
        fileState,
      })}
      data-node-type="mediaInline"
    >
      {mediaProvider ? (
        <MediaInlineCard
          identifier={identifier}
          onClick={handleMediaInlineClick}
          shouldOpenMediaViewer={shouldOpenMediaViewer}
          shouldDisplayToolTip={shouldDisplayToolTip}
          mediaClientConfig={viewMediaClientConfigState}
          mediaViewerItems={Array.from(mediaIdentifierMap.values())}
        />
      ) : (
        <MediaInlineCardErroredView
          message={(intl || createIntl({ locale: 'en' })).formatMessage(
            messages.couldnt_load_file,
          )}
        />
      )}
    </span>
  );
};

const MediaInline: React.FC<MediaInlineProps & WrappedComponentProps> = (
  props,
) => {
  const {
    collection,
    id,
    providers: providerFactory,
    intl,
    rendererAppearance,
    featureFlags,
  } = props;

  const clipboardAttrs: ClipboardAttrs = {
    id,
    collection,
  };

  const identifier: FileIdentifier = {
    id,
    mediaItemType: 'file',
    collectionName: collection!,
  };

  return (
    <WithProviders
      providers={['mediaProvider', 'contextIdentifierProvider']}
      providerFactory={providerFactory}
      renderNode={(
        mediaInlineProviders: MediaInlineProviders,
      ): React.ReactNode => {
        return (
          <RenderMediaInline
            identifier={identifier}
            clipboardAttrs={clipboardAttrs}
            eventHandlers={props.eventHandlers}
            rendererAppearance={rendererAppearance}
            intl={intl}
            mediaInlineProviders={mediaInlineProviders}
            collection={collection}
            featureFlags={featureFlags}
          />
        );
      }}
    />
  );
};

export default injectIntl(MediaInline);
