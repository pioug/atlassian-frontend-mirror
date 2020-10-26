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
  isMimeTypeSupportedByBrowser,
  isErrorFileState,
  MediaClient,
  MediaViewedEventPayload,
  RECENTS_COLLECTION,
  isPreviewableType,
} from '@atlaskit/media-client';
import { MediaViewer, MediaViewerDataSource } from '@atlaskit/media-viewer';
import { Subscription } from 'rxjs/Subscription';
import { IntlProvider, intlShape } from 'react-intl';
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
import { isIntersectionObserverSupported } from '../../utils/intersectionObserver';
import { getDataURIDimension } from '../../utils/getDataURIDimension';
import {
  CardPreview,
  getCardPreviewFromFileState,
  getCardPreviewFromBackend,
} from './getCardPreview';
import { extendMetadata } from '../../utils/metadata';
import { isBigger } from '../../utils/dimensionComparer';
import { createObjectURLCache } from '../../utils/objectURLCache';
import { getCardStatus, getCardStatusFromFileState } from './getCardStatus';
import { updateProgressFromFileState } from './getCardProgress';
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

export type CardWithAnalyticsEventsProps = CardProps & WithAnalyticsEventsProps;

const cardPreviewCache = createObjectURLCache();

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
  private intersectionObserver?: IntersectionObserver;

  cardRef: React.RefObject<CardViewBase | InlinePlayerBase> = React.createRef();

  subscription?: Subscription;
  static defaultProps: Partial<CardProps> = {
    appearance: 'auto',
    resizeMode: 'crop',
    isLazy: true,
    disableOverlay: false,
    // Media Feature Flag defaults are defined in @atlaskit/media-common
    featureFlags: {},
  };

  static contextTypes = {
    // Required to detect a parent IntlProvider
    intl: intlShape,
  };

  constructor(props: CardWithAnalyticsEventsProps) {
    super(props);

    let cardPreview: CardPreview | undefined;

    const { identifier, dimensions = {} } = this.props;

    if (isFileIdentifier(identifier)) {
      const { id } = identifier;
      const cacheKey = this.getPreviewCacheKey(id, dimensions);
      cardPreview = cardPreviewCache.get(cacheKey);
    }

    /**
     * If cardPreview is available from local cache, `isCardVisible`
     * should be true to avoid flickers during re-mount of the component
     */
    this.state = {
      status: 'loading',
      isCardVisible: cardPreview ? true : !this.props.isLazy,
      isPlayingFile: false,
      cardPreview,
    };
  }

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

  private getPreviewCacheKey = (id: string, dimensions: CardDimensions) => {
    // Dimensions are used to create a key.
    // Cache is invalidated when different dimensions are provided.
    return [id, dimensions.height, dimensions.width].join('-');
  };

  // We want to detect when the component enters the viewport so we know when we
  // can fetch the /image preview
  private checkIfCardIsInViewport = () => {
    const { isLazy } = this.props;
    const target = this.cardRef.current && this.cardRef.current.divRef.current;

    if (!isLazy || !isIntersectionObserverSupported() || !target) {
      return;
    }

    const onIntersection: IntersectionObserverCallback = (
      entries,
      observer,
    ) => {
      for (let entry of entries) {
        if (entry.isIntersecting) {
          this.setState({ isCardVisible: true });
          observer.disconnect();
          break;
        }
      }
    };
    // IntersectionObserver uses root and target elements to detect intersections, defaulting root to the viewport
    this.intersectionObserver = new IntersectionObserver(onIntersection);

    if (target) {
      this.intersectionObserver.observe(target);
    }
  };

  private cleanupCardInViewportObserver = () => {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  };

  componentDidMount() {
    this.hasBeenMounted = true;
    this.fireCardCommencedAnalytics();
    this.updateStateForIdentifier();
    document.addEventListener('copy', this.onCopyListener);
    this.checkIfCardIsInViewport();
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
        metadata: {
          id: mediaItemType,
          name: name || dataURI,
          mediaType: 'image',
        },
        cardPreview: {
          dataURI,
          orientation: 1,
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
    this.cleanupCardInViewportObserver();
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

  private isLatestCardStatusUpdate = (
    cardStatusUpdateTimestamp: number,
  ): boolean =>
    !this.lastCardStatusUpdateTimestamp ||
    this.lastCardStatusUpdateTimestamp <= cardStatusUpdateTimestamp;

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

  private getCardPreview = async (
    mediaClient: MediaClient,
    identifier: FileIdentifier,
    fileState: FileState,
    metadata: FileDetails,
  ): Promise<CardPreview | undefined> => {
    const {
      dimensions = {},
      originalDimensions,
      resizeMode,
      featureFlags,
    } = this.props;
    const { id, collectionName } = identifier;

    // We aren't using the component state here, as cardPreviewCache has a shorter lifecycle
    const cacheKey = this.getPreviewCacheKey(id, dimensions);
    if (cardPreviewCache.has(cacheKey)) {
      return cardPreviewCache.get(cacheKey);
    }

    // don't use error fileStates
    if (isErrorFileState(fileState)) {
      return;
    }

    const { mediaType, mimeType } = fileState;
    const requestedDimensions = this.getRequestedDimensions();

    const shouldUseLocalPreview =
      mediaType !== 'doc' &&
      !!mimeType &&
      isMimeTypeSupportedByBrowser(mimeType);

    const previewableType = isPreviewableType(mediaType, featureFlags);

    const cardPreview =
      (shouldUseLocalPreview &&
        (await getCardPreviewFromFileState(fileState))) ||
      (previewableType &&
        (await getCardPreviewFromBackend(
          mediaClient,
          identifier,
          fileState,
          requestedDimensions,
          resizeMode,
        )));

    if (cardPreview) {
      if (cardPreview.dataURI) {
        // In case we've retrieved cardPreview using one of the two methods above,
        // we want to embed some meta context into dataURI for Copy/Paste to work.
        const contextDimensions = originalDimensions || requestedDimensions;
        cardPreview.dataURI = this.addContextToDataURI(
          cardPreview.dataURI,
          id,
          metadata,
          contextDimensions,
          collectionName,
        );
      }

      // We store new cardPreview into cache
      cardPreviewCache.set(cacheKey, cardPreview);

      return cardPreview;
    }
  };

  subscribeInternalFile(identifier: FileIdentifier, mediaClient: MediaClient) {
    const { featureFlags } = this.props;
    const { id, collectionName, occurrenceKey } = identifier;
    this.subscription = mediaClient.file
      .getFileState(id, { collectionName, occurrenceKey })
      .subscribe({
        next: async fileState => {
          let { progress: lastProgress, status: lastStatus } = this.state;
          this.lastFileState = fileState;

          const thisCardStatusUpdateTimestamp = (performance || Date).now();
          const metadata = extendMetadata(fileState, this.state.metadata);
          const status = getCardStatusFromFileState(fileState, featureFlags);
          this.safeSetState({ metadata });

          const cardPreview = await this.getCardPreview(
            mediaClient,
            identifier,
            fileState,
            metadata,
          );

          if (this.isLatestCardStatusUpdate(thisCardStatusUpdateTimestamp)) {
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
            this.fireLoadingStatusAnalyticsEvent({
              cardStatus: status,
              metadata,
              dataURI: cardPreview && cardPreview.dataURI,
              fileState,
            });

            this.safeSetState({
              status,
              cardPreview,
            });

            this.processingProgressTimer = updateProgressFromFileState(
              fileState,
              status,
              (progress: number) =>
                this.safeSetState({
                  progress,
                }),
              {
                lastStatus,
                lastProgress,
                lastTimer: this.processingProgressTimer,
                featureFlags,
              },
            );
            this.lastCardStatusUpdateTimestamp = thisCardStatusUpdateTimestamp;
          }
        },
        error: error => {
          const metadata: FileDetails = { id };
          const cardStatus: CardStatus = 'error';
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
      this.setState({ cardPreview: undefined });
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
    const { metadata, cardPreview } = this.state;

    this.onClick(event, analyticsEvent);

    if (!metadata) {
      return;
    }

    const isVideo = metadata && (metadata as FileDetails).mediaType === 'video';
    if (useInlinePlayer && isVideo && !!cardPreview) {
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
        dimensions={dimensions}
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
      featureFlags,
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
        featureFlags={featureFlags}
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
      titleBoxBgColor,
      titleBoxIcon,
    } = this.props;
    const { mediaItemType } = identifier;
    const {
      metadata,
      progress,
      cardPreview: { dataURI, orientation } = {
        dataURI: undefined,
        orientation: 1,
      },
    } = this.state;
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
        previewOrientation={orientation}
        ref={this.cardRef}
        testId={testId}
        featureFlags={featureFlags}
        titleBoxBgColor={titleBoxBgColor}
        titleBoxIcon={titleBoxIcon}
      />
    );
    const shouldUseLazyContent = isLazy && !isIntersectionObserverSupported(); // We use LazyContent for old browsers

    return shouldUseLazyContent ? (
      <LazyContent placeholder={card} onRender={this.onCardInViewport}>
        {card}
      </LazyContent>
    ) : (
      card
    );
  };

  render() {
    const { metadata, isPlayingFile, mediaViewerSelectedItem } = this.state;
    const innerContent = (
      <>
        {isPlayingFile ? this.renderInlinePlayer() : this.renderCard()}
        {mediaViewerSelectedItem ? this.renderMediaViewer() : null}
      </>
    );

    const content = this.context.intl ? (
      innerContent
    ) : (
      <IntlProvider locale="en">{innerContent}</IntlProvider>
    );

    return (
      <MediaAnalyticsContext
        data={getMediaCardAnalyticsContext(
          metadata,
          this.lastFileState,
          this.props.featureFlags,
        )}
      >
        {content}
      </MediaAnalyticsContext>
    );
  }

  private onCardInViewport = () => {
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
