import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  UIAnalyticsEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import {
  addFileAttrsToUrl,
  FileDetails,
  FileIdentifier,
  FileState,
  globalMediaEventEmitter,
  Identifier,
  isDifferentIdentifier,
  isFileIdentifier,
  isImageRepresentationReady,
  isPreviewableType,
  MediaClient,
  MediaViewedEventPayload,
  RECENTS_COLLECTION,
} from '@atlaskit/media-client';
import { MediaViewer, MediaViewerDataSource } from '@atlaskit/media-viewer';

import { Subscription } from 'rxjs/Subscription';
import { IntlProvider } from 'react-intl';
import {
  CardAction,
  CardDimensions,
  CardProps,
  CardState,
  CardStatus,
  OriginalCardDimensions,
} from '../..';
import { CardView, CardViewBase } from '../cardView';
import { LazyContent } from '../../utils/lazyContent';
import { getDataURIDimension } from '../../utils/getDataURIDimension';
import { getFilePreviewFromFileState } from '../../utils/getFilePreviewFromFileState';
import { extendMetadata } from '../../utils/metadata';
import { isBigger } from '../../utils/dimensionComparer';
import {
  getCardProgressFromFileState,
  getCardStatus,
  getCardStatusFromFileState,
} from './getCardStatus';
import { InlinePlayer, InlinePlayerBase } from '../inlinePlayer';
import {
  AnalyticsErrorStateAttributes,
  AnalyticsLoadingAction,
  createAndFireCustomMediaEvent,
  fileIsPreviewable,
  getAnalyticsErrorStateAttributes,
  getAnalyticsStatus,
  getBaseAnalyticsContext,
  getCopiedFileAnalyticsPayload,
  getFileAttributes,
  getLoadingStatusAnalyticsPayload,
  getMediaCardAnalyticsContext,
  getMediaCardCommencedAnalyticsPayload,
  hasFilenameAndFilesize,
} from '../../utils/analytics';
import { MediaAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

export type CardWithAnalyticsEventsProps = CardProps & WithAnalyticsEventsProps;

export class CardBase extends Component<
  CardWithAnalyticsEventsProps,
  CardState
> {
  private hasBeenMounted: boolean = false;
  private lastAction?: AnalyticsLoadingAction = undefined;
  private lastErrorState?: AnalyticsErrorStateAttributes = {};
  // Stores last retrieved file state for logging purposes
  private lastFileState?: FileState;
  private lastCardStatusUpdateTimestamp?: number;
  cardRef: React.RefObject<CardViewBase | InlinePlayerBase> = React.createRef();

  subscription?: Subscription;
  static defaultProps: Partial<CardProps> = {
    appearance: 'auto',
    resizeMode: 'crop',
    isLazy: true,
    disableOverlay: false,
  };

  state: CardState = {
    status: 'loading',
    isCardVisible: !this.props.isLazy,
    previewOrientation: 1,
    isPlayingFile: false,
  };

  // we add a listener for each of the cards on the page
  // and then check if the triggered listener is from the card
  // that contains a div in current window.getSelection()
  // won't work in IE11
  onCopyListener = () => {
    if (typeof window.getSelection === 'function') {
      const selection = window.getSelection();

      if (
        this.cardRef.current &&
        this.cardRef.current.divRef.current instanceof Node &&
        selection &&
        selection.containsNode &&
        selection.containsNode(this.cardRef.current.divRef.current, true)
      ) {
        this.fireFileCopiedAnalytics();
      }
    }
  };

  componentDidMount() {
    this.hasBeenMounted = true;
    this.fireCardCommencedAnalytics();
    this.updateStateForIdentifier();
    document.addEventListener('copy', this.onCopyListener);
  }

  componentDidUpdate(prevProps: CardProps, prevState: CardState) {
    const {
      mediaClient: prevMediaClient,
      identifier: prevIdentifier,
      dimensions: prevDimensions,
    } = prevProps;
    const { isCardVisible: prevIsCardVisible } = prevState;
    const { mediaClient, identifier, dimensions } = this.props;
    const { isCardVisible } = this.state;
    const isDifferent = isDifferentIdentifier(prevIdentifier, identifier);

    if (
      (prevIsCardVisible !== isCardVisible && isCardVisible) ||
      prevMediaClient !== mediaClient ||
      isDifferent ||
      this.shouldRefetchImage(prevDimensions, dimensions)
    ) {
      this.fireCardCommencedAnalytics();
      this.updateStateForIdentifier();
    }
  }

  static getDerivedStateFromProps = (props: CardProps) => {
    const { identifier } = props;
    if (identifier.mediaItemType === 'external-image') {
      const { dataURI, name, mediaItemType } = identifier;

      return {
        status: 'complete',
        dataURI,
        metadata: {
          id: mediaItemType,
          name: name || dataURI,
          mediaType: 'image',
        },
      };
    }

    return null;
  };

  shouldRefetchImage = (current?: CardDimensions, next?: CardDimensions) => {
    if (!current || !next) {
      return false;
    }
    return isBigger(current, next);
  };

  componentWillUnmount() {
    this.hasBeenMounted = false;
    this.unsubscribe();
    this.releaseStateDataURI();
    document.removeEventListener('copy', this.onCopyListener);
  }

  releaseStateDataURI = () => {
    const { identifier } = this.props;
    const { dataURI } = this.state;
    // we don't want to release external previews, since it might be reused later on
    if (dataURI && identifier.mediaItemType !== 'external-image') {
      URL.revokeObjectURL(dataURI);
    }
  };

  async getResolvedId(): Promise<string> {
    const { identifier } = this.props;
    if (identifier.mediaItemType === 'external-image') {
      return identifier.mediaItemType;
    } else {
      return identifier.id;
    }
  }

  updateStateForIdentifier() {
    const { mediaClient, identifier } = this.props;
    const { isCardVisible } = this.state;

    if (!isCardVisible) {
      return;
    }

    if (identifier.mediaItemType === 'file') {
      this.unsubscribe();
      this.subscribeInternalFile(identifier, mediaClient);
    }
  }

  private getDataURIOriginalDimensions(): OriginalCardDimensions {
    const { appearance, dimensions } = this.props;
    const options = {
      appearance,
      dimensions,
      component: this,
    };
    const width = getDataURIDimension('width', options);
    const height = getDataURIDimension('height', options);
    return {
      width,
      height,
    };
  }

  private addContextToDataURI(
    dataURI: string,
    fileId: string,
    metadata: FileDetails,
    dimensions?: OriginalCardDimensions,
    collectionName?: string,
  ): string | undefined {
    const { contextId, alt } = this.props;

    if (!contextId) {
      return dataURI;
    }

    const { width, height } = dimensions || this.getDataURIOriginalDimensions();

    return addFileAttrsToUrl(dataURI, {
      id: fileId,
      collection: collectionName,
      contextId,
      mimeType: metadata.mimeType,
      name: metadata.name,
      size: metadata.size,
      width,
      height,
      alt,
    });
  }

  private async getObjectUrlFromBackendImageBlob(
    mediaClient: MediaClient,
    resolvedId: string,
    { width, height }: OriginalCardDimensions,
    collectionName: string | undefined,
  ): Promise<string | undefined> {
    const { resizeMode } = this.props;
    const mode = resizeMode === 'stretchy-fit' ? 'full-fit' : resizeMode;

    try {
      const blob = await mediaClient.getImage(resolvedId, {
        collection: collectionName,
        mode,
        height,
        width,
        allowAnimated: true,
      });

      return URL.createObjectURL(blob);
    } catch (e) {
      // We don't want to set status=error if the preview fails, we still want to display the metadata
    }
  }

  async subscribeInternalFile(
    identifier: FileIdentifier,
    mediaClient: MediaClient,
  ) {
    const { collectionName, occurrenceKey } = identifier;
    const resolvedId = await identifier.id;
    this.subscription = mediaClient.file
      .getFileState(resolvedId, { collectionName, occurrenceKey })
      .subscribe({
        next: async fileState => {
          let { dataURI } = this.state;
          this.lastFileState = fileState;

          const thisCardStatusUpdateTimestamp = (performance || Date).now();
          const metadata = extendMetadata(fileState, this.state.metadata);
          this.safeSetState({ metadata });

          const shouldFetchRemotePreview =
            isImageRepresentationReady(fileState) &&
            metadata.mediaType &&
            isPreviewableType(metadata.mediaType);

          if (!dataURI) {
            // No dataURI in state. Let's try and get one.
            // First, we try to get one from Preview possibly stored in FileState
            const { src, orientation = 1 } = await getFilePreviewFromFileState(
              fileState,
            );

            let { originalDimensions } = this.props;

            if (src) {
              dataURI = src;
              this.safeSetState({
                previewOrientation: orientation,
              });

              // Second, if there is no Preview in FileState we fetch one from /image backend
            } else if (shouldFetchRemotePreview) {
              originalDimensions =
                originalDimensions || this.getDataURIOriginalDimensions();
              dataURI = await this.getObjectUrlFromBackendImageBlob(
                mediaClient,
                resolvedId,
                originalDimensions,
                collectionName,
              );
            }

            if (dataURI) {
              // In case we've retrieved dataURI using one of the two methods above,
              // we want to embed some meta context into this URL for Copy/Paste to work.
              dataURI = this.addContextToDataURI(
                dataURI,
                resolvedId,
                metadata,
                originalDimensions,
                collectionName,
              );

              // Finally we store new dataURI into state
              this.releaseStateDataURI();
              this.safeSetState({
                dataURI,
              });
            }
          }

          const status = getCardStatusFromFileState(fileState, dataURI);

          this.fireLoadingStatusAnalyticsEvent({
            resolvedId,
            status,
            metadata,
          });

          if (
            !this.lastCardStatusUpdateTimestamp ||
            this.lastCardStatusUpdateTimestamp <= thisCardStatusUpdateTimestamp
          ) {
            const progress = getCardProgressFromFileState(fileState, dataURI);
            // These status and progress must not override values representing more recent FileState
            /* next() start        some await() delay in next()        status & progress update
             * -------                    ------------------           ------------------------
             *   |----[1]FileState:uploading------>|                                 |
             *   |                                 |                                 |
             *   |----[2]FileState:uploading------>|                                 |
             *   |                                 |                                 |
             *   |                                 |----[2]FileState:uploading------>| Update status to `uploading`
             *   |----[3]FileState:processing----->|                                 |
             *   |                                 |----[3]FileState:processing----->| Update status to `complete`
             *   |                                 |                                 |
             *   |                                 |----[1]FileState:uploading------>| We do not want to update status to `uploading` again!
             *
             */
            this.safeSetState({
              status,
              progress,
            });
            this.lastCardStatusUpdateTimestamp = thisCardStatusUpdateTimestamp;
          }
        },
        error: error => {
          this.fireLoadingStatusAnalyticsEvent({
            resolvedId,
            status: 'error',
            error,
          });
          this.safeSetState({ error, status: 'error' });
        },
      });
  }

  shouldFireLoadingStatusAnalyticsEvent = (
    action: AnalyticsLoadingAction,
    errorState: AnalyticsErrorStateAttributes,
  ) => {
    const previousFailReason =
      this.lastErrorState && this.lastErrorState.failReason;
    const previousErrorMessage =
      this.lastErrorState && this.lastErrorState.error;

    const isDifferentErrorState =
      errorState.failReason !== previousFailReason ||
      errorState.error !== previousErrorMessage;

    const isDifferentAction = action !== this.lastAction;

    return isDifferentAction || isDifferentErrorState;
  };

  fireLoadingStatusAnalyticsEvent = ({
    resolvedId,
    status,
    metadata,
    error,
  }: {
    resolvedId: string;
    status: CardStatus;
    metadata?: FileDetails;
    error?: Error;
  }) => {
    const { createAnalyticsEvent } = this.props;

    const previewable = fileIsPreviewable(metadata);
    const hasMinimalData = hasFilenameAndFilesize(metadata);
    const action = getAnalyticsStatus(previewable, hasMinimalData, status);
    const errorState = getAnalyticsErrorStateAttributes(
      previewable,
      hasMinimalData,
      this.lastFileState,
      error,
    );

    if (
      action &&
      this.shouldFireLoadingStatusAnalyticsEvent(action, errorState)
    ) {
      this.lastAction = action;
      this.lastErrorState = errorState;
      const fileAttributes = getFileAttributes(
        metadata,
        this.lastFileState && this.lastFileState.status,
      );

      createAndFireCustomMediaEvent(
        getLoadingStatusAnalyticsPayload(
          action,
          resolvedId,
          fileAttributes,
          errorState,
        ),
        createAnalyticsEvent,
      );
    }
  };

  async fireCardCommencedAnalytics() {
    const { createAnalyticsEvent } = this.props;
    const { isCardVisible } = this.state;

    if (!isCardVisible) {
      return;
    }

    const id = await this.getResolvedId();
    createAndFireCustomMediaEvent(
      getMediaCardCommencedAnalyticsPayload(id),
      createAnalyticsEvent,
    );
  }

  fireFileCopiedAnalytics = async () => {
    const { createAnalyticsEvent, identifier } = this.props;

    createAndFireCustomMediaEvent(
      await getCopiedFileAnalyticsPayload(identifier),
      createAnalyticsEvent,
    );
  };

  private safeSetState = (state: Partial<CardState>) => {
    if (this.hasBeenMounted) {
      this.setState(state as Pick<CardState, keyof CardState>);
    }
  };

  unsubscribe = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.hasBeenMounted) {
      this.setState({ dataURI: undefined });
    }
    this.lastAction = undefined;
    this.lastErrorState = {};
  };

  // This method is called when card fails and user press 'Retry'
  private onRetry = () => {
    this.lastAction = undefined;
    this.lastErrorState = {};
    this.fireCardCommencedAnalytics();
    this.updateStateForIdentifier();
  };

  get actions(): CardAction[] {
    const { actions = [], identifier } = this.props;
    const { status, metadata } = this.state;
    if (isFileIdentifier(identifier) && status === 'failed-processing') {
      const downloadAction = {
        label: 'Download',
        icon: <DownloadIcon label="Download" />,
        handler: async () =>
          this.props.mediaClient.file.downloadBinary(
            await identifier.id,
            (metadata as FileDetails).name,
            identifier.collectionName,
          ),
      };
      return [downloadAction, ...actions];
    } else {
      return actions;
    }
  }

  onCardViewClick = async (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => {
    const { identifier, useInlinePlayer, shouldOpenMediaViewer } = this.props;
    const { metadata } = this.state;

    this.onClick(event, analyticsEvent);

    if (!metadata) {
      return;
    }

    const isVideo = metadata && (metadata as FileDetails).mediaType === 'video';
    if (useInlinePlayer && isVideo) {
      this.setState({
        isPlayingFile: true,
      });
    } else if (shouldOpenMediaViewer) {
      let mediaViewerSelectedItem: Identifier | undefined;

      if (isFileIdentifier(identifier)) {
        mediaViewerSelectedItem = {
          id: await identifier.id,
          mediaItemType: 'file',
          collectionName: identifier.collectionName,
          occurrenceKey: identifier.occurrenceKey,
        };
      } else {
        mediaViewerSelectedItem = {
          mediaItemType: 'external-image',
          dataURI: identifier.dataURI,
          name: identifier.name,
        };
      }

      this.setState({
        mediaViewerSelectedItem,
      });
    }
  };

  onInlinePlayerError = () => {
    this.setState({
      isPlayingFile: false,
    });
  };

  renderInlinePlayer = () => {
    const {
      identifier,
      mediaClient,
      dimensions,
      selected,
      testId,
    } = this.props;

    return (
      <InlinePlayer
        mediaClient={mediaClient}
        dimensions={dimensions || {}}
        identifier={identifier as FileIdentifier}
        onError={this.onInlinePlayerError}
        onClick={this.onClick}
        selected={selected}
        ref={this.cardRef}
        testId={testId}
      />
    );
  };

  onMediaViewerClose = () => {
    this.setState({
      mediaViewerSelectedItem: undefined,
    });
  };

  private onDisplayImage = async () => {
    const { identifier } = this.props;
    let payloadPart: Pick<
      MediaViewedEventPayload,
      'fileId' | 'isUserCollection'
    >;
    if (isFileIdentifier(identifier)) {
      payloadPart = {
        fileId: await identifier.id,
        isUserCollection: identifier.collectionName === RECENTS_COLLECTION,
      };
    } else {
      payloadPart = {
        fileId: identifier.dataURI,
        isUserCollection: false,
      };
    }

    globalMediaEventEmitter.emit('media-viewed', {
      viewingLevel: 'minimal',
      ...payloadPart,
    });
  };

  renderMediaViewer = (): React.ReactPortal | undefined => {
    const { mediaViewerSelectedItem } = this.state;
    const {
      mediaClient,
      identifier,
      mediaViewerDataSource,
      contextId,
    } = this.props;
    if (!mediaViewerSelectedItem) {
      return;
    }

    const collectionName = isFileIdentifier(identifier)
      ? identifier.collectionName || ''
      : '';
    const dataSource: MediaViewerDataSource = mediaViewerDataSource || {
      list: [],
    };

    return ReactDOM.createPortal(
      <MediaViewer
        collectionName={collectionName}
        dataSource={dataSource}
        mediaClientConfig={mediaClient.config}
        selectedItem={mediaViewerSelectedItem}
        onClose={this.onMediaViewerClose}
        contextId={contextId}
      />,
      document.body,
    );
  };

  renderCard = () => {
    const {
      isLazy,
      appearance,
      resizeMode,
      dimensions,
      selectable,
      selected,
      disableOverlay,
      alt,
      testId,
    } = this.props;
    const { progress, metadata, dataURI, previewOrientation } = this.state;
    const {
      onRetry,
      onCardViewClick,
      onDisplayImage,
      actions,
      onMouseEnter,
    } = this;
    const status = getCardStatus(this.state, this.props);

    const card = (
      <CardView
        status={status}
        metadata={metadata}
        dataURI={dataURI}
        alt={alt}
        appearance={appearance}
        resizeMode={resizeMode}
        dimensions={dimensions}
        actions={actions}
        selectable={selectable}
        selected={selected}
        onClick={onCardViewClick}
        onMouseEnter={onMouseEnter}
        disableOverlay={disableOverlay}
        progress={progress}
        onRetry={onRetry}
        onDisplayImage={onDisplayImage}
        previewOrientation={previewOrientation}
        ref={this.cardRef}
        testId={testId}
      />
    );

    return isLazy ? (
      <LazyContent placeholder={card} onRender={this.onCardInViewport}>
        {card}
      </LazyContent>
    ) : (
      card
    );
  };

  renderContent() {
    const { isPlayingFile, mediaViewerSelectedItem } = this.state;
    const innerContent = isPlayingFile
      ? this.renderInlinePlayer()
      : this.renderCard();

    return this.context.intl ? (
      innerContent
    ) : (
      <IntlProvider locale="en">
        <>
          {innerContent}
          {mediaViewerSelectedItem ? this.renderMediaViewer() : null}
        </>
      </IntlProvider>
    );
  }

  render() {
    const { metadata } = this.state;

    return (
      <MediaAnalyticsContext
        data={getMediaCardAnalyticsContext(metadata, this.lastFileState)}
      >
        {this.renderContent()}
      </MediaAnalyticsContext>
    );
  }

  onCardInViewport = () => {
    this.setState({ isCardVisible: true });
  };

  onClick = (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => {
    const { onClick } = this.props;
    const { metadata } = this.state;
    if (onClick) {
      const cardEvent = {
        event,
        mediaItemDetails: metadata,
      };
      onClick(cardEvent, analyticsEvent);
    }
  };

  onMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const { onMouseEnter } = this.props;
    const { metadata } = this.state;
    if (onMouseEnter) {
      const cardEvent = {
        event,
        mediaItemDetails: metadata,
      };
      onMouseEnter(cardEvent);
    }
  };
}

export const Card: React.ComponentType<CardWithAnalyticsEventsProps> = withAnalyticsContext(
  getBaseAnalyticsContext(),
)(withAnalyticsEvents()(CardBase));
