import React, { Component, useContext } from 'react';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import { filter } from '@atlaskit/adf-utils/traverse';
import type {
  CardAppearance,
  CardDimensions,
  CardOnClickCallback,
  NumericalCardDimensions,
} from '@atlaskit/media-card';
import { Card, CardLoading, CardError } from '@atlaskit/media-card';
import type { MediaClientConfig } from '@atlaskit/media-core';
import type {
  ImageResizeMode,
  FileIdentifier,
  ExternalImageIdentifier,
  Identifier,
  FileState,
  MediaClient,
} from '@atlaskit/media-client';
import { MediaClientContext } from '@atlaskit/media-client-react';
import type { MediaType } from '@atlaskit/adf-schema';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { withImageLoader } from '@atlaskit/editor-common/utils';
import type { ImageStatus } from '@atlaskit/editor-common/utils';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import type { RendererAppearance } from './Renderer/types';
import type { RendererContext } from '../react/types';
import type { MediaSSR } from '../types/mediaOptions';
import { useAnnotationRangeDispatch } from './annotations/contexts/AnnotationRangeContext';

export type MediaProvider = {
  viewMediaClientConfig: MediaClientConfig;
};

export interface MediaCardProps {
  id?: string;
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
  ssr?: MediaSSR;
  dataAttributes?: Record<string, any>;
}

export interface State {
  contextIdentifierProvider?: ContextIdentifierProvider;
  fileState?: FileState;
}

export const mediaIdentifierMap: Map<string, Identifier> = new Map();

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

export class MediaCardView extends Component<
  MediaCardProps & {
    mediaClient?: MediaClient;
    setHoverTarget?: (target: HTMLElement) => void;
  },
  State
> {
  state: State = {};

  async componentDidMount() {
    const {
      rendererContext,
      contextIdentifierProvider,
      id,
      url,
      collection: collectionName,
    } = this.props;

    if (contextIdentifierProvider) {
      this.setState({
        contextIdentifierProvider: await contextIdentifierProvider,
      });
    }

    const nodeIsInCache =
      (id && mediaIdentifierMap.has(id)) ||
      (url && mediaIdentifierMap.has(url));
    if (rendererContext && rendererContext.adDoc && !nodeIsInCache) {
      getListOfIdentifiersFromDoc(rendererContext.adDoc).forEach(
        (identifier) => {
          if (identifier.mediaItemType === 'file' && identifier.id === id) {
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

    if (id) {
      this.saveFileState(id);
    }
  }

  UNSAFE_componentWillReceiveProps(newProps: MediaCardProps) {
    const { id: newId } = newProps;
    if (newId && newId !== this.props.id) {
      this.saveFileState(newId);
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

  saveFileState = async (id: string) => {
    const { collection: collectionName, mediaClient } = this.props;
    const options = {
      collectionName,
    };
    try {
      if (mediaClient) {
        const fileState = await mediaClient.file.getCurrentState(id, options);
        this.setState({
          fileState,
        });
      }
    } catch (error) {
      // do not set state on error
    }
  };

  private renderLoadingCard = () => {
    const { cardDimensions } = this.props;

    return <CardLoading dimensions={cardDimensions} />;
  };

  private renderExternal(shouldOpenMediaViewer: boolean) {
    const {
      cardDimensions,
      resizeMode,
      appearance,
      url,
      imageStatus,
      disableOverlay,
      alt,
      featureFlags,
      ssr,
      rendererAppearance,
      mediaClient,
    } = this.props;

    if (imageStatus === 'loading' || !url) {
      return this.renderLoadingCard();
    }

    const identifier: ExternalImageIdentifier = {
      dataURI: url,
      name: url,
      mediaItemType: 'external-image',
    };

    // we need this statement for the mandatory mediaClientConfig below
    const mediaClientConfig = mediaClient?.mediaClientConfig;

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
        mediaViewerItems={Array.from(mediaIdentifierMap.values())}
        featureFlags={featureFlags}
        ssr={ssr?.mode}
        shouldHideTooltip={rendererAppearance === 'mobile'}
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
    const { contextIdentifierProvider, fileState } = this.state;
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
      ssr,
      mediaClient,
      setHoverTarget,
      dataAttributes,
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

    const mediaClientConfig = !!ssr
      ? ssr.config
      : mediaClient?.mediaClientConfig;

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
      <div
        {...getClipboardAttrs({
          id,
          alt,
          collection,
          contextIdentifierProvider,
          originalDimensions,
          fileState,
        })}
        {...dataAttributes}
        onMouseEnter={(event) => {
          // We will not allow a hover target to be set if any mouse button is depressed during the mouse enter state.
          // This could be due to the user trying to select text across the document.
          if (event.buttons === 0) {
            setHoverTarget && setHoverTarget(event.target as HTMLElement);
          }
        }}
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
          mediaViewerItems={Array.from(mediaIdentifierMap.values())}
          featureFlags={featureFlags}
          shouldEnableDownloadButton={shouldEnableDownloadButton}
          ssr={ssr?.mode}
          shouldHideTooltip={isMobile}
        />
      </div>
    );
  }
}

export type ClipboardAttrs = {
  id: string;
  alt?: string;
  collection?: string;
  contextIdentifierProvider?: ContextIdentifierProvider;
  originalDimensions?: NumericalCardDimensions;
  fileState?: FileState;
};

// Needed for copy & paste
export const getClipboardAttrs = ({
  id,
  alt,
  collection,
  contextIdentifierProvider,
  originalDimensions,
  fileState,
}: ClipboardAttrs): { [key: string]: string | number | undefined } => {
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

export const MediaCardInternal = (props: MediaCardProps) => {
  const mediaClient = useContext(MediaClientContext);
  const { setHoverTarget } = useAnnotationRangeDispatch();

  return (
    <MediaCardView
      {...props}
      mediaClient={mediaClient}
      setHoverTarget={setHoverTarget}
    />
  );
};

export const MediaCard = withImageLoader<MediaCardProps>(MediaCardInternal);
