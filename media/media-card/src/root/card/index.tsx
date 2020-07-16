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
  NumericalCardDimensions,
} from '../..';
import { CardView, CardViewBase } from '../cardView';
import { LazyContent } from '../../utils/lazyContent';
import { getDataURIDimension } from '../../utils/getDataURIDimension';
import {
  FilePreview,
  getFilePreviewFromFileState,
} from '../../utils/getFilePreviewFromFileState';
import { extendMetadata } from '../../utils/metadata';
import { isBigger } from '../../utils/dimensionComparer';
import {
  getCardStatus,
  getCardStatusFromFileState,
  updateCardStatusFromFileState,
} from './getCardStatus';
import { InlinePlayer, InlinePlayerBase } from '../inlinePlayer';
import {
  createAndFireCustomMediaEvent,
  getBaseAnalyticsContext,
  getCopiedFileAnalyticsPayload,
  getFileAttributes,
  getLoadingStatusAnalyticsPayload,
  getMediaCardAnalyticsContext,
  getMediaCardCommencedAnalyticsPayload,
  getAnalyticsLoadingStatus,
  AnalyticsLoadingStatusArgs,
  AnalyticsLoadingStatus,
} from '../../utils/analytics';
import { MediaAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { objectURLCache } from './objectURLCache';

export type CardWithAnalyticsEventsProps = CardProps & WithAnalyticsEventsProps;

export class CardBase extends Component<
  CardWithAnalyticsEventsProps,
  CardState
> {
  private hasBeenMounted: boolean = false;
  private lastLoadingStatus?: AnalyticsLoadingStatus = undefined;
  // Stores last retrieved file state for logging purposes
  private lastFileState?: FileState;
  private lastCardStatusUpdateTimestamp?: number;
  private processingProgressTimer?: number;
  cardRef: React.RefObject<CardViewBase | InlinePlayerBase> = React.createRef();

  subscription?: Subscription;
  static defaultProps: Partial<CardProps> = {
    appearance: 'auto',
    resizeMode: 'crop',
    isLazy: true,
    disableOverlay: false,
    featureFlags: { newExp: false },
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
    document.removeEventListener('copy', this.onCopyListener);
  }

  getId(): string {
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

  private getRequestedDimensions(): NumericalCardDimensions {
    const { dimensions } = this.props;
    const options = {
      dimensions,
      element: this.cardRef.current && this.cardRef.current.divRef.current,
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
    { width, height }: NumericalCardDimensions,
    collectionName?: string,
  ): string {
    const { contextId, alt } = this.props;

    if (!contextId) {
      return dataURI;
    }

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
    id: string,
    { width, height }: NumericalCardDimensions,
    collectionName: string | undefined,
  ): Promise<string | undefined> {
    const { resizeMode } = this.props;
    const mode = resizeMode === 'stretchy-fit' ? 'full-fit' : resizeMode;

    try {
      const blob = await mediaClient.getImage(id, {
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

  subscribeInternalFile(identifier: FileIdentifier, mediaClient: MediaClient) {
    const { id, collectionName, occurrenceKey } = identifier;
    this.subscription = mediaClient.file
      .getFileState(id, { collectionName, occurrenceKey })
      .subscribe({
        next: async fileState => {
          let {
            dataURI,
            progress: lastProgress,
            status: lastStatus,
          } = this.state;
          const { dimensions = {} } = this.props;
          this.lastFileState = fileState;

          const thisCardStatusUpdateTimestamp = (performance || Date).now();
          const metadata = extendMetadata(fileState, this.state.metadata);
          this.safeSetState({ metadata });

          const shouldFetchRemotePreview =
            isImageRepresentationReady(fileState) &&
            metadata.mediaType &&
            isPreviewableType(metadata.mediaType);

          // Dimensions are used to create a key. We want to be able to
          // request new image from backend when different dimensions are provided.
          const cacheKey = [id, dimensions.height, dimensions.width].join('-');

          if (!dataURI && objectURLCache.has(cacheKey)) {
            // No dataURI in state. Let's try and get one.
            // First, we try to get one from the cache
            dataURI = objectURLCache.get(cacheKey);
          }

          if (!dataURI) {
            // Second, we try to get one from Preview possibly stored in FileState
            let filePreview: FilePreview;

            try {
              filePreview = await getFilePreviewFromFileState(fileState);
            } catch (err) {
              // no preview could be fetched from FileState
              filePreview = { orientation: 1 };
            }

            let { originalDimensions } = this.props;
            let requestedDimensions: NumericalCardDimensions | undefined;

            if (filePreview.src) {
              dataURI = filePreview.src;
              this.safeSetState({
                previewOrientation: filePreview.orientation,
              });

              // Third, if there is no Preview in FileState we fetch one from /image backend
            } else if (shouldFetchRemotePreview) {
              requestedDimensions = this.getRequestedDimensions();
              dataURI = await this.getObjectUrlFromBackendImageBlob(
                mediaClient,
                id,
                requestedDimensions,
                collectionName,
              );
            }

            if (dataURI) {
              // In case we've retrieved dataURI using one of the two methods above,
              // we want to embed some meta context into this URL for Copy/Paste to work.
              const contextDimensions =
                originalDimensions ||
                requestedDimensions ||
                this.getRequestedDimensions();
              dataURI = this.addContextToDataURI(
                dataURI,
                id,
                metadata,
                contextDimensions,
                collectionName,
              );

              // We store new dataURI into cache
              objectURLCache.set(cacheKey, dataURI);
            }
          }

          if (dataURI) {
            // Finally we store retrieved dataURI into state
            this.safeSetState({
              dataURI,
            });
          }

          const status = getCardStatusFromFileState(fileState);
          this.fireLoadingStatusAnalyticsEvent({
            cardStatus: status,
            metadata,
            dataURI,
            fileState,
          });

          if (
            !this.lastCardStatusUpdateTimestamp ||
            this.lastCardStatusUpdateTimestamp <= thisCardStatusUpdateTimestamp
          ) {
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
            this.processingProgressTimer = updateCardStatusFromFileState(
              fileState,
              status,
              // status is not modified inside this function. There is no need to set state here
              // TODO: move setState(status) out of this callback
              (status: CardStatus, progress: number) =>
                this.safeSetState({
                  status,
                  progress,
                }),
              {
                lastStatus,
                lastProgress,
                lastTimer: this.processingProgressTimer,
              },
            );
            this.lastCardStatusUpdateTimestamp = thisCardStatusUpdateTimestamp;
          }
        },
        error: error => {
          const metadata: FileDetails = { id };
          const cardStatus = 'error';
          this.fireLoadingStatusAnalyticsEvent({ metadata, cardStatus, error });
          this.safeSetState({ error, status: cardStatus });
        },
      });
  }

  shouldFireLoadingStatusAnalyticsEvent = (
    loadingStatus: AnalyticsLoadingStatus,
  ) => {
    const { failReason: lastFailReason, error: lastError, action: lastAction } =
      this.lastLoadingStatus || {};
    const { failReason, error, action } = loadingStatus;
    const result =
      action !== lastAction ||
      failReason !== lastFailReason ||
      error !== lastError;
    return result;
  };

  fireLoadingStatusAnalyticsEvent = (args: AnalyticsLoadingStatusArgs) => {
    const loadingStatus = getAnalyticsLoadingStatus(args);
    if (
      loadingStatus &&
      this.shouldFireLoadingStatusAnalyticsEvent(loadingStatus)
    ) {
      this.lastLoadingStatus = loadingStatus;
      const { createAnalyticsEvent, featureFlags } = this.props;
      const { action, failReason, error } = loadingStatus;
      const { metadata, fileState } = args;
      const { status } = fileState || {};
      const fileAttributes = getFileAttributes(metadata, status);
      createAndFireCustomMediaEvent(
        getLoadingStatusAnalyticsPayload({
          action,
          actionSubjectId: metadata.id,
          fileAttributes,
          failReason,
          error,
          featureFlags,
        }),
        createAnalyticsEvent,
      );
    }
  };

  fireCardCommencedAnalytics() {
    const { createAnalyticsEvent, featureFlags } = this.props;
    const { isCardVisible } = this.state;

    if (!isCardVisible) {
      return;
    }

    const id = this.getId();
    createAndFireCustomMediaEvent(
      getMediaCardCommencedAnalyticsPayload(id, featureFlags),
      createAnalyticsEvent,
    );
  }

  fireFileCopiedAnalytics = () => {
    const { createAnalyticsEvent, identifier, featureFlags } = this.props;

    createAndFireCustomMediaEvent(
      getCopiedFileAnalyticsPayload(identifier, featureFlags),
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
    this.lastLoadingStatus = undefined;
  };

  // This method is called when card fails and user press 'Retry'
  private onRetry = () => {
    this.lastLoadingStatus = undefined;
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
        handler: () =>
          this.props.mediaClient.file.downloadBinary(
            identifier.id,
            (metadata as FileDetails).name,
            identifier.collectionName,
          ),
      };
      return [downloadAction, ...actions];
    } else {
      return actions;
    }
  }

  onCardViewClick = (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => {
    const { identifier, useInlinePlayer, shouldOpenMediaViewer } = this.props;
    const { metadata, dataURI } = this.state;

    this.onClick(event, analyticsEvent);

    if (!metadata) {
      return;
    }

    const isVideo = metadata && (metadata as FileDetails).mediaType === 'video';
    if (useInlinePlayer && isVideo && !!dataURI) {
      this.setState({
        isPlayingFile: true,
      });
    } else if (shouldOpenMediaViewer) {
      let mediaViewerSelectedItem: Identifier | undefined;

      if (isFileIdentifier(identifier)) {
        mediaViewerSelectedItem = {
          id: identifier.id,
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

  private onDisplayImage = () => {
    const { identifier } = this.props;
    let payloadPart: Pick<
      MediaViewedEventPayload,
      'fileId' | 'isUserCollection'
    >;
    if (isFileIdentifier(identifier)) {
      payloadPart = {
        fileId: identifier.id,
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
      identifier,
      isLazy,
      appearance,
      resizeMode,
      dimensions,
      selectable,
      selected,
      disableOverlay,
      alt,
      testId,
      featureFlags,
    } = this.props;
    const { mediaItemType } = identifier;
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
        mediaItemType={mediaItemType}
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
        featureFlags={featureFlags}
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
        data={getMediaCardAnalyticsContext(
          metadata,
          this.lastFileState,
          this.props.featureFlags,
        )}
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
