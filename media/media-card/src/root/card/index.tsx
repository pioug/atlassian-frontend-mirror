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
import { FileAttributes } from '@atlaskit/media-common';
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
  MediaViewedEventPayload,
  RECENTS_COLLECTION,
  isImageRepresentationReady,
  isExternalImageIdentifier,
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
import { CardView } from '../cardView';
import { ViewportDetector } from '../../utils/viewportDetector';
import { getRequestedDimensions } from '../../utils/getDataURIDimension';
import {
  shouldGetCardPreview,
  extractFilePreviewStatus,
  CardPreview,
  getCardPreview,
  getCardPreviewFromCache,
  getFilePreviewFromFileState,
  CardPreviewParams,
} from './getCardPreview';
import { getFileDetails } from '../../utils/metadata';
import { isBigger } from '../../utils/dimensionComparer';
import { getCardStatus } from './getCardStatus';
import { InlinePlayer } from '../inlinePlayer';
import { getFileAttributes } from '../../utils/analytics';
import { FileAttributesProvider } from '../../utils/fileAttributesContext';
import {
  isRemotePreviewError,
  MediaCardError,
  ensureMediaCardError,
} from '../../errors';
import {
  fireOperationalEvent,
  fireCommencedEvent,
  relevantFeatureFlagNames,
  fireCopiedEvent,
  fireScreenEvent,
} from './cardAnalytics';
import getDocument from '../../utils/document';

export type CardWithAnalyticsEventsProps = CardProps & WithAnalyticsEventsProps;

export class CardBase extends Component<
  CardWithAnalyticsEventsProps,
  CardState
> {
  private hasBeenMounted: boolean = false;
  // Stores last retrieved file state for logging purposes
  private lastFileState?: FileState;
  private lastCardStatusUpdateTimestamp?: number;
  // We initialise timeElapsedTillCommenced
  // to avoid extra branching on a possibly undefined value.
  private timeElapsedTillCommenced: number = performance.now();

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

    let status: CardStatus = 'loading';
    let cardPreview: CardPreview | undefined;

    const { identifier, dimensions = {} } = this.props;

    if (isFileIdentifier(identifier)) {
      const { id } = identifier;
      cardPreview = getCardPreviewFromCache(id, dimensions);
    } else if (isExternalImageIdentifier(identifier)) {
      this.fireCommencedEvent();
      status = 'complete';
      const { dataURI } = identifier;
      cardPreview = { dataURI, orientation: 1, source: 'external' };
    }

    /**
     * If cardPreview is available from local cache, `isCardVisible`
     * should be true to avoid flickers during re-mount of the component
     */
    const isCardVisible = cardPreview ? true : !this.props.isLazy;
    this.state = {
      status,
      isCardVisible,
      isPlayingFile: false,
      cardPreview,
      cardRef: null,
    };
  }

  componentDidMount() {
    this.hasBeenMounted = true;
    const { isCardVisible } = this.state;
    const { identifier } = this.props;
    if (isCardVisible && isFileIdentifier(identifier)) {
      this.updateStateForIdentifier(identifier);
    }
    // we add a listener for each of the cards on the page
    // and then check if the triggered listener is from the card
    // that contains a div in current window.getSelection()
    // won't work in IE11
    getDocument().addEventListener('copy', this.fireCopiedEvent);
  }

  componentDidUpdate(prevProps: CardProps, prevState: CardState) {
    const {
      mediaClient: prevMediaClient,
      identifier: prevIdentifier,
      dimensions: prevDimensions,
    } = prevProps;
    const { isCardVisible: prevIsCardVisible } = prevState;
    const { mediaClient, identifier, dimensions } = this.props;
    const { isCardVisible, cardPreview } = this.state;
    const isDifferent = isDifferentIdentifier(prevIdentifier, identifier);
    const turnedVisible = !prevIsCardVisible && isCardVisible;

    if (isExternalImageIdentifier(identifier) && isDifferent) {
      this.fireCommencedEvent();
      const { dataURI } = identifier;
      this.setState({
        status: 'complete',
        cardPreview: { dataURI, orientation: 1, source: 'external' },
        isCardVisible: true,
      });
    }
    if (
      isFileIdentifier(identifier) &&
      (turnedVisible ||
        prevMediaClient !== mediaClient ||
        isDifferent ||
        // TODO: should not resubscribe on resize. Only refetch
        this.shouldRefetchImage(prevDimensions, dimensions))
    ) {
      this.updateStateForIdentifier(identifier);
    }

    if (this.state.status !== prevState.status) {
      this.fireOperationalEvent();
      if (
        this.state.status === 'complete' ||
        (this.fileAttributes.fileMediatype === 'video' &&
          !!cardPreview &&
          this.state.status === 'processing')
      ) {
        this.fireScreenEvent();
      }
    }
  }

  shouldRefetchImage = (current?: CardDimensions, next?: CardDimensions) => {
    if (!current || !next) {
      return false;
    }
    return isBigger(current, next);
  };

  componentWillUnmount() {
    this.hasBeenMounted = false;
    this.unsubscribe();
    getDocument().removeEventListener('copy', this.fireCopiedEvent);
  }

  updateStateForIdentifier(identifier: FileIdentifier) {
    this.fireCommencedEvent();
    this.subscribeInternalFile(identifier);
  }

  private isLatestCardStatusUpdate = (
    cardStatusUpdateTimestamp: number,
  ): boolean =>
    !this.lastCardStatusUpdateTimestamp ||
    this.lastCardStatusUpdateTimestamp <= cardStatusUpdateTimestamp;

  private onLocalPreviewError = (error: MediaCardError) => {
    // TODO: track local preview success rate
    // https://product-fabric.atlassian.net/browse/MEX-774
  };

  private createAddContextToDataURI = (
    fileId: string,
    fileState: FileState,
    { width, height }: NumericalCardDimensions,
    collectionName?: string,
  ) => (dataURI: string): string => {
    const { contextId, alt } = this.props;

    if (!contextId) {
      return dataURI;
    }
    const metadata = getFileDetails(fileState);

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
  };

  getCardPreviewParams = (
    id: string,
    collectionName: string | undefined,
    fileState: FileState,
  ): CardPreviewParams => {
    const {
      dimensions = {},
      originalDimensions,
      resizeMode,
      mediaClient,
    } = this.props;
    const { cardRef } = this.state;

    const requestedDimensions = getRequestedDimensions({
      dimensions,
      element: cardRef,
    });

    return {
      mediaClient,
      id,
      collectionName,
      dimensions,
      resizeMode,
      requestedDimensions,
      onLocalPreviewError: this.onLocalPreviewError,
      filePreview: getFilePreviewFromFileState(fileState),
      isRemotePreviewReady: isImageRepresentationReady(fileState),
      addContextToDataURI: this.createAddContextToDataURI(
        id,
        fileState,
        originalDimensions || requestedDimensions,
        collectionName,
      ),
    };
  };

  subscribeInternalFile(identifier: FileIdentifier) {
    const { mediaClient } = this.props;
    const { id, collectionName, occurrenceKey } = identifier;
    this.unsubscribe();
    this.subscription = mediaClient.file
      .getFileState(id, { collectionName, occurrenceKey })
      .subscribe({
        next: async (fileState) => {
          this.lastFileState = fileState;

          const thisCardStatusUpdateTimestamp = (performance || Date).now();

          const filePreviewStatus = extractFilePreviewStatus(
            fileState,
            this.props.featureFlags,
          );
          let status = getCardStatus(fileState.status, filePreviewStatus);
          this.safeSetState({ fileState });

          let cardPreview: CardPreview | undefined;
          let error: MediaCardError | undefined;

          if (shouldGetCardPreview(status, filePreviewStatus)) {
            try {
              cardPreview = await getCardPreview(
                this.getCardPreviewParams(id, collectionName, fileState),
              );
              if (['loading-preview', 'processing'].includes(status)) {
                status = 'complete';
              }
            } catch (e) {
              const wrappedError = ensureMediaCardError('preview-fetch', e);
              // If remote preview fails, we set status 'error'
              // If the local preview fails (i.e, no remote preview available),
              // we can stay in the same status until there is a remote preview available
              if (isRemotePreviewError(wrappedError)) {
                status = 'error';
                error = wrappedError;
              }
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

  private fireOperationalEvent() {
    const { timeElapsedTillCommenced } = this;
    const { status, cardPreview, error } = this.state;
    const { createAnalyticsEvent } = this.props;

    const timeElapsedTillEvent = performance.now();
    const durationSinceCommenced =
      timeElapsedTillCommenced &&
      timeElapsedTillEvent - timeElapsedTillCommenced;

    const performanceAttributes = {
      overall: {
        durationSincePageStart: timeElapsedTillEvent,
        durationSinceCommenced,
      },
    };

    createAnalyticsEvent &&
      fireOperationalEvent(
        createAnalyticsEvent,
        status,
        this.fileAttributes,
        performanceAttributes,
        { cardPreview, error },
      );
  }

  private fireCommencedEvent() {
    this.timeElapsedTillCommenced = performance.now();
    const { createAnalyticsEvent } = this.props;
    createAnalyticsEvent &&
      fireCommencedEvent(createAnalyticsEvent, this.fileAttributes, {
        overall: { durationSincePageStart: this.timeElapsedTillCommenced },
      });
  }

  private fireCopiedEvent = () => {
    const { createAnalyticsEvent } = this.props;
    const { cardRef } = this.state;
    cardRef &&
      createAnalyticsEvent &&
      fireCopiedEvent(createAnalyticsEvent, this.metadata.id, cardRef);
  };

  private fireScreenEvent = () => {
    const { createAnalyticsEvent } = this.props;
    createAnalyticsEvent &&
      fireScreenEvent(createAnalyticsEvent, this.fileAttributes);
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
    const { metadata, timeElapsedTillCommenced } = this;
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
        timeElapsedTillCommenced={timeElapsedTillCommenced}
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
