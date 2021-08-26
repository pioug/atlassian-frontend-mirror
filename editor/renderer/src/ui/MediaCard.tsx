import React from 'react';
import { Component } from 'react';

import { filter, ADFEntity } from '@atlaskit/adf-utils';
import {
  CardAppearance,
  CardDimensions,
  Card,
  CardLoading,
  CardError,
  CardOnClickCallback,
  NumericalCardDimensions,
} from '@atlaskit/media-card';
import { MediaClientConfig } from '@atlaskit/media-core';
import {
  ImageResizeMode,
  FileIdentifier,
  ExternalImageIdentifier,
  Identifier,
  getMediaClient,
  FileState,
} from '@atlaskit/media-client';
import { MediaType } from '@atlaskit/adf-schema';
import {
  withImageLoader,
  ImageStatus,
  ContextIdentifierProvider,
} from '@atlaskit/editor-common';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { RendererAppearance } from './Renderer/types';
import { RendererContext } from '../react/types';
import styled from 'styled-components';

export type MediaProvider = {
  viewMediaClientConfig: MediaClientConfig;
};

export interface MediaCardProps {
  id?: string;
  mediaProvider?: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
  eventHandlers?: {
    media?: {
      onClick?: CardOnClickCallback;
    };
  };
  shouldOpenMediaViewer?: boolean;
  type: MediaType;
  collection?: string;
  url?: string;
  cardDimensions?: CardDimensions;
  originalDimensions?: NumericalCardDimensions;
  resizeMode?: ImageResizeMode;
  appearance?: CardAppearance;
  rendererAppearance?: RendererAppearance;
  occurrenceKey?: string;
  imageStatus?: ImageStatus;
  disableOverlay?: boolean;
  useInlinePlayer?: boolean;
  rendererContext?: RendererContext;
  alt?: string;
  featureFlags?: MediaFeatureFlags;
  shouldEnableDownloadButton?: boolean;
}

export interface State {
  mediaClientConfig?: MediaClientConfig;
  contextIdentifierProvider?: ContextIdentifierProvider;
  fileState?: FileState;
}

const mediaIdentifierMap: Map<string, Identifier> = new Map();

export const getListOfIdentifiersFromDoc = (doc?: ADFEntity): Identifier[] => {
  if (!doc) {
    return [];
  }
  return filter(doc, (node) => node.type === 'media').reduce(
    (identifierList: Identifier[], mediaNode) => {
      if (mediaNode.attrs) {
        const { type, url: dataURI, id } = mediaNode.attrs;

        if (type === 'file' && id) {
          identifierList.push({
            mediaItemType: 'file',
            id,
          });
        } else if (type === 'external' && dataURI) {
          identifierList.push({
            mediaItemType: 'external-image',
            dataURI,
            name: dataURI,
          });
        }
      }
      return identifierList;
    },
    [],
  );
};

export class MediaCardInternal extends Component<MediaCardProps, State> {
  state: State = {};

  async componentDidMount() {
    const {
      rendererContext,
      mediaProvider,
      contextIdentifierProvider,
      id,
      url,
      collection: collectionName,
    } = this.props;

    if (!mediaProvider) {
      return;
    }

    if (contextIdentifierProvider) {
      this.setState({
        contextIdentifierProvider: await contextIdentifierProvider,
      });
    }
    const mediaProviderObject = await mediaProvider;
    const mediaClientConfig = mediaProviderObject.viewMediaClientConfig;

    const nodeIsInCache =
      (id && mediaIdentifierMap.has(id)) ||
      (url && mediaIdentifierMap.has(url));
    if (rendererContext && rendererContext.adDoc && !nodeIsInCache) {
      getListOfIdentifiersFromDoc(rendererContext.adDoc).forEach(
        (identifier) => {
          if (identifier.mediaItemType === 'file') {
            mediaIdentifierMap.set(identifier.id as string, {
              ...identifier,
              collectionName,
            });
          } else if (identifier.mediaItemType === 'external-image') {
            mediaIdentifierMap.set(identifier.dataURI as string, identifier);
          }
        },
      );
    }
    this.setState({
      mediaClientConfig: mediaClientConfig,
    });

    if (id) {
      this.saveFileState(id, mediaClientConfig);
    }
  }

  UNSAFE_componentWillReceiveProps(newProps: MediaCardProps) {
    const { mediaClientConfig } = this.state;
    const { id: newId } = newProps;
    if (mediaClientConfig && newId && newId !== this.props.id) {
      this.saveFileState(newId, mediaClientConfig);
    }
  }

  componentWillUnmount() {
    const { id, url: dataURI } = this.props;

    if (id) {
      mediaIdentifierMap.delete(id);
    } else if (dataURI) {
      mediaIdentifierMap.delete(dataURI);
    }
  }

  saveFileState = async (id: string, mediaClientConfig: MediaClientConfig) => {
    const { collection: collectionName, featureFlags } = this.props;
    const mediaClient = getMediaClient(mediaClientConfig, featureFlags);
    const options = {
      collectionName,
    };
    try {
      const fileState = await mediaClient.file.getCurrentState(id, options);
      this.setState({
        fileState,
      });
    } catch (error) {
      // do not set state on error
    }
  };

  private renderLoadingCard = () => {
    const { cardDimensions } = this.props;

    return <CardLoading dimensions={cardDimensions} />;
  };

  private renderExternal(shouldOpenMediaViewer: boolean) {
    const { mediaClientConfig } = this.state;
    const {
      cardDimensions,
      resizeMode,
      appearance,
      url,
      imageStatus,
      disableOverlay,
      alt,
      featureFlags,
    } = this.props;

    if (imageStatus === 'loading' || !url) {
      return this.renderLoadingCard();
    }

    const identifier: ExternalImageIdentifier = {
      dataURI: url,
      name: url,
      mediaItemType: 'external-image',
    };

    return (
      <Card
        // TODO MPT-315: clean up after we move mediaClientConfig into FileIdentifier
        // context is not really used when the type is external and we want to render the component asap
        mediaClientConfig={mediaClientConfig!}
        alt={alt}
        identifier={identifier}
        dimensions={cardDimensions}
        appearance={appearance}
        resizeMode={resizeMode}
        disableOverlay={disableOverlay}
        shouldOpenMediaViewer={shouldOpenMediaViewer}
        mediaViewerDataSource={{
          list: Array.from(mediaIdentifierMap.values()),
        }}
        featureFlags={featureFlags}
      />
    );
  }

  /**
   * We want to call provided `eventHandlers.media.onClick` when it's provided,
   * but we also don't want to call it when it's a video and inline video player is enabled.
   * This is due to consumers normally process this onClick call by opening media viewer and
   * we don't want that to happened described above text.
   */
  private getOnCardClickCallback = (isInlinePlayer: boolean) => {
    const { eventHandlers } = this.props;
    if (eventHandlers && eventHandlers.media && eventHandlers.media.onClick) {
      return ((result, analyticsEvent) => {
        const isVideo =
          result.mediaItemDetails &&
          result.mediaItemDetails.mediaType === 'video';
        const isVideoWithInlinePlayer = isInlinePlayer && isVideo;
        if (
          !isVideoWithInlinePlayer &&
          eventHandlers &&
          eventHandlers.media &&
          eventHandlers.media.onClick
        ) {
          eventHandlers.media.onClick(result, analyticsEvent);
        }
      }) as CardOnClickCallback;
    }

    return undefined;
  };

  render() {
    const {
      contextIdentifierProvider,
      mediaClientConfig,
      fileState,
    } = this.state;
    const {
      id,
      alt,
      type,
      collection,
      occurrenceKey,
      cardDimensions,
      resizeMode,
      rendererAppearance,
      disableOverlay,
      useInlinePlayer,
      originalDimensions,
      shouldOpenMediaViewer: forceOpenMediaViewer,
      featureFlags,
      shouldEnableDownloadButton,
    } = this.props;
    const isMobile = rendererAppearance === 'mobile';
    const shouldPlayInline =
      useInlinePlayer !== undefined ? useInlinePlayer : true;
    const isInlinePlayer = isMobile ? false : shouldPlayInline;

    const onCardClick = this.getOnCardClickCallback(isInlinePlayer);

    const shouldOpenMediaViewer =
      typeof forceOpenMediaViewer === 'boolean'
        ? forceOpenMediaViewer
        : !isMobile && !onCardClick;

    if (type === 'external') {
      return this.renderExternal(shouldOpenMediaViewer);
    }

    if (type === 'link') {
      return null;
    }

    if (!mediaClientConfig || !id) {
      return this.renderLoadingCard();
    }

    if (!id || type !== 'file') {
      return <CardError dimensions={cardDimensions} />;
    }
    const contextId =
      contextIdentifierProvider && contextIdentifierProvider.objectId;

    const identifier: FileIdentifier = {
      id,
      mediaItemType: 'file',
      collectionName: collection,
      occurrenceKey,
    };

    return (
      <CardWrapper
        {...getClipboardAttrs({
          id,
          alt,
          collection,
          contextIdentifierProvider,
          originalDimensions,
          fileState,
        })}
      >
        <Card
          identifier={identifier}
          alt={alt}
          contextId={contextId}
          mediaClientConfig={mediaClientConfig}
          dimensions={cardDimensions}
          originalDimensions={originalDimensions}
          onClick={onCardClick}
          resizeMode={resizeMode}
          isLazy={!isMobile}
          disableOverlay={disableOverlay}
          useInlinePlayer={isInlinePlayer}
          shouldOpenMediaViewer={shouldOpenMediaViewer}
          mediaViewerDataSource={{
            list: Array.from(mediaIdentifierMap.values()),
          }}
          featureFlags={featureFlags}
          shouldEnableDownloadButton={shouldEnableDownloadButton}
        />
      </CardWrapper>
    );
  }
}

export const CardWrapper = styled.div``;

// Needed for copy & paste
export const getClipboardAttrs = ({
  id,
  alt,
  collection,
  contextIdentifierProvider,
  originalDimensions,
  fileState,
}: {
  id: string;
  alt?: string;
  collection?: string;
  contextIdentifierProvider?: ContextIdentifierProvider;
  originalDimensions?: NumericalCardDimensions;
  fileState?: FileState;
}): { [key: string]: string | number | undefined } => {
  const contextId =
    contextIdentifierProvider && contextIdentifierProvider.objectId;
  const width = originalDimensions && originalDimensions.width;
  const height = originalDimensions && originalDimensions.height;
  let fileName = 'file'; // default name is needed for Confluence
  let fileSize = 1;
  let fileMimeType = '';

  if (fileState && fileState.status !== 'error') {
    fileSize = fileState.size;
    fileName = fileState.name;
    fileMimeType = fileState.mimeType;
  }

  return {
    'data-context-id': contextId,
    'data-type': 'file',
    'data-node-type': 'media',
    'data-width': width,
    'data-height': height,
    'data-id': id,
    'data-collection': collection,
    'data-file-name': fileName,
    'data-file-size': fileSize,
    'data-file-mime-type': fileMimeType,
    'data-alt': alt,
  };
};

export const MediaCard = withImageLoader<MediaCardProps>(MediaCardInternal);
