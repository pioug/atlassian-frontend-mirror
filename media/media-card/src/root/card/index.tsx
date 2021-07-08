import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  version as packageVersion,
  name as packageName,
} from '../../version.json';
import {
  UIAnalyticsEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { withMediaAnalyticsContext } from '@atlaskit/media-common';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import {
  FileAttributes,
  isMimeTypeSupportedByBrowser,
} from '@atlaskit/media-common';
import {
  addFileAttrsToUrl,
  FileDetails,
  FileIdentifier,
  FileState,
  globalMediaEventEmitter,
  Identifier,
  isDifferentIdentifier,
  isFileIdentifier,
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
  NumericalCardDimensions,
} from '../..';
import { CardView } from '../cardView';
import { ViewportDetector } from '../../utils/viewportDetector';
import { getDataURIDimension } from '../../utils/getDataURIDimension';
import {
  CardPreview,
  getCardPreviewFromFileState,
  getCardPreviewFromBackend,
} from './getCardPreview';
import { getFileDetails } from '../../utils/metadata';
import { isBigger } from '../../utils/dimensionComparer';
import { createObjectURLCache } from '../../utils/objectURLCache';
import { getCardStatus, extractCardStatusParams } from './getCardStatus';
import { InlinePlayer } from '../inlinePlayer';
import {
  fireMediaCardEvent,
  getFileAttributes,
  getRenderCommencedEventPayload,
  getCopiedFilePayload,
} from '../../utils/analytics';
import { FileAttributesProvider } from '../../utils/fileAttributesContext';
import {
  isLocalPreviewError,
  MediaCardError,
  ensureMediaCardError,
} from '../../errors';
import {
  fireOperationalEvent,
  relevantFeatureFlagNames,
} from './cardAnalytics';

export type CardWithAnalyticsEventsProps = CardProps & WithAnalyticsEventsProps;

const cardPreviewCache = createObjectURLCache();

export class CardBase extends Component<
  CardWithAnalyticsEventsProps,
  CardState
> {
  private hasBeenMounted: boolean = false;
  // Stores last retrieved file state for logging purposes
  private lastFileState?: FileState;
  private lastCardStatusUpdateTimestamp?: number;

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
      cardRef: null,
    };
  }

  // we add a listener for each of the cards on the page
  // and then check if the triggered listener is from the card
  // that contains a div in current window.getSelection()
  // won't work in IE11
  onCopyListener = () => {
    if (typeof window.getSelection === 'function') {
      const selection = window.getSelection();
      const { cardRef } = this.state;
      if (
        cardRef &&
        selection &&
        selection.containsNode &&
        selection.containsNode(cardRef, true)
      ) {
        this.fireFileCopiedEvent();
      }
    }
  };

  private getPreviewCacheKey = (id: string, dimensions: CardDimensions) => {
    // Dimensions are used to create a key.
    // Cache is invalidated when different dimensions are provided.
    return [id, dimensions.height, dimensions.width].join('-');
  };

  componentDidMount() {
    this.hasBeenMounted = true;
    this.fireCommencedEvent();
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
      this.fireCommencedEvent();
      this.updateStateForIdentifier();
    }

    if (this.state.status !== prevState.status) {
      const { status, cardPreview, error } = this.state;
      const { createAnalyticsEvent } = this.props;
      createAnalyticsEvent &&
        fireOperationalEvent(
          createAnalyticsEvent,
          status,
          this.fileAttributes,
          { cardPreview, error },
        );
    }
  }

  static getDerivedStateFromProps = (props: CardProps) => {
    const { identifier } = props;
    if (identifier.mediaItemType === 'external-image') {
      const { dataURI } = identifier;

      return {
        status: 'complete',
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
    const { cardRef } = this.state;
    const options = {
      dimensions,
      element: cardRef,
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

    // TODO: align these checks with helpers from Media Client
    // https://product-fabric.atlassian.net/browse/BMPT-1300
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
    const { id, collectionName, occurrenceKey } = identifier;
    this.subscription = mediaClient.file
      .getFileState(id, { collectionName, occurrenceKey })
      .subscribe({
        next: async (fileState) => {
          this.lastFileState = fileState;

          const thisCardStatusUpdateTimestamp = (performance || Date).now();
          let status = getCardStatus(
            fileState.status,
            extractCardStatusParams(fileState, this.props.featureFlags),
          );
          this.safeSetState({ fileState });

          let cardPreview: CardPreview | undefined;
          let error: MediaCardError | undefined;
          try {
            cardPreview = await this.getCardPreview(
              mediaClient,
              identifier,
              fileState,
              getFileDetails(fileState),
            );
          } catch (e) {
            const wrappedError = ensureMediaCardError('preview-fetch', e);
            // If the local preview fails, we don't need to display the error.
            // TODO: if file has local preview card will be complete status. But if the local preview fails,
            // and we don't change the status, we will have
            // [ !cardPreview && status == complete -> log succeeded event ]
            // https://product-fabric.atlassian.net/browse/BMPT-1315
            if (!isLocalPreviewError(wrappedError)) {
              status = 'error';
              error = wrappedError;
            }
          }

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

            if (status === 'error' && isErrorFileState(fileState) && !error) {
              error = new MediaCardError(
                'error-file-state',
                new Error(fileState.message),
              );
            }

            this.safeSetState({
              status,
              cardPreview,
              progress:
                status === 'uploading' && fileState.status === 'uploading'
                  ? fileState.progress
                  : 1,
              error: status === 'error' && error ? error : undefined,
            });

            this.lastCardStatusUpdateTimestamp = thisCardStatusUpdateTimestamp;
          }
        },
        error: (e) => {
          // If file state subscription decides that the card is complete
          // and later there is an error, we won't change the card's status.
          if (this.state.status === 'complete') {
            return;
          }
          const errorReason =
            this.fileAttributes.fileStatus === 'uploading'
              ? 'upload'
              : 'metadata-fetch';
          const error = new MediaCardError(errorReason, e);
          this.safeSetState({ error, status: 'error' });
          this.lastCardStatusUpdateTimestamp = (performance || Date).now();
        },
      });
  }

  private get metadata(): FileDetails {
    const { identifier } = this.props;
    return isFileIdentifier(identifier)
      ? this.state.fileState
        ? getFileDetails(this.state.fileState)
        : { id: identifier.id }
      : {
          id: identifier.mediaItemType,
          name: identifier.name || identifier.dataURI,
          mediaType: 'image',
        };
  }

  private get fileAttributes(): FileAttributes {
    return getFileAttributes(this.metadata, this.lastFileState?.status);
  }

  private fireCommencedEvent() {
    if (!this.state.isCardVisible) {
      return;
    }
    const { createAnalyticsEvent } = this.props;
    const payload = getRenderCommencedEventPayload(this.fileAttributes);
    fireMediaCardEvent(payload, createAnalyticsEvent);
  }

  private fireFileCopiedEvent = () => {
    const { createAnalyticsEvent } = this.props;
    fireMediaCardEvent(
      getCopiedFilePayload(this.metadata.id),
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
  };

  get actions(): CardAction[] {
    const { actions = [], identifier, shouldEnableDownloadButton } = this.props;
    const { status } = this.state;
    const { metadata } = this;

    if (
      isFileIdentifier(identifier) &&
      (status === 'failed-processing' || shouldEnableDownloadButton)
    ) {
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
    const { cardPreview } = this.state;
    const { metadata } = this;

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

  setRef = (cardRef: HTMLDivElement | null) => {
    !!cardRef && this.setState({ cardRef });
  };

  renderInlinePlayer = () => {
    const {
      identifier,
      mediaClient,
      dimensions,
      selected,
      testId,
      originalDimensions,
    } = this.props;

    return (
      <InlinePlayer
        mediaClient={mediaClient}
        dimensions={dimensions}
        originalDimensions={originalDimensions}
        identifier={identifier as FileIdentifier}
        onError={this.onInlinePlayerError}
        onClick={this.onClick}
        selected={selected}
        ref={this.setRef}
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
      status,
      progress,
      cardPreview: { dataURI, orientation } = {
        dataURI: undefined,
        orientation: 1,
      },
      error,
      cardRef,
    } = this.state;
    const { metadata } = this;
    const { onCardViewClick, onDisplayImage, actions, onMouseEnter } = this;

    const card = (
      <CardView
        status={status}
        error={error && error.secondaryError}
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
        onDisplayImage={onDisplayImage}
        previewOrientation={orientation}
        innerRef={this.setRef}
        testId={testId}
        featureFlags={featureFlags}
        titleBoxBgColor={titleBoxBgColor}
        titleBoxIcon={titleBoxIcon}
      />
    );

    return isLazy ? (
      <ViewportDetector targetRef={cardRef} onVisible={this.onCardInViewport}>
        {card}
      </ViewportDetector>
    ) : (
      card
    );
  };

  render() {
    const { isPlayingFile, mediaViewerSelectedItem } = this.state;
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
      <FileAttributesProvider
        data={getFileAttributes(this.metadata, this.lastFileState?.status)}
      >
        {content}
      </FileAttributesProvider>
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
    const { metadata } = this;
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
    const { metadata } = this;
    if (onMouseEnter) {
      const cardEvent = {
        event,
        mediaItemDetails: metadata,
      };
      onMouseEnter(cardEvent);
    }
  };
}

export const Card: React.ComponentType<CardWithAnalyticsEventsProps> = withMediaAnalyticsContext(
  {
    packageVersion,
    packageName,
    componentName: 'mediaCard',
    component: 'mediaCard',
  },
  {
    filterFeatureFlags: relevantFeatureFlagNames,
  },
)(withAnalyticsEvents()(CardBase));
