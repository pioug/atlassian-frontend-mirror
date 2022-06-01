import React, { Component, createRef } from 'react';
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
import {
  NumericalCardDimensions,
  withMediaAnalyticsContext,
} from '@atlaskit/media-common';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import { FileAttributes } from '@atlaskit/media-common';
import {
  FileDetails,
  FileIdentifier,
  FileState,
  globalMediaEventEmitter,
  Identifier,
  isDifferentIdentifier,
  isFileIdentifier,
  MediaViewedEventPayload,
  RECENTS_COLLECTION,
  isImageRepresentationReady,
  isExternalImageIdentifier,
  isProcessedFileState,
  imageResizeModeToFileImageMode,
  MediaStoreGetFileImageParams,
  MediaBlobUrlAttrs,
  MediaSubscription,
} from '@atlaskit/media-client';
import { MediaViewer, MediaViewerDataSource } from '@atlaskit/media-viewer';
import {
  injectIntl,
  IntlProvider,
  WrappedComponentProps,
} from 'react-intl-next';
import {
  CardAction,
  CardProps,
  CardState,
  CardStatus,
  CardPreview,
} from '../..';
import { CardView } from '../cardView';
import {
  ABS_VIEWPORT_ANCHOR_OFFSET_TOP,
  ViewportDetector,
  ViewportAnchor,
} from '../../utils/viewportDetector';
import { getRequestedDimensions } from '../../utils/getDataURIDimension';
import {
  getCardPreview,
  getCardPreviewFromCache,
  removeCardPreviewFromCache,
  getFilePreviewFromFileState,
  CardPreviewParams,
  shouldResolvePreview,
  getSSRCardPreview,
  isLocalPreview,
  isSSRPreview,
  isSSRClientPreview,
  isSSRDataPreview,
  fetchAndCacheRemotePreview,
} from './getCardPreview';
import { getFileDetails } from '../../utils/metadata';
import { InlinePlayer } from '../inlinePlayer';
import {
  getFileAttributes,
  extractErrorInfo,
  SSRStatus,
  SSRStatusFail,
  LOGGED_FEATURE_FLAGS,
} from '../../utils/analytics';
import {
  isLocalPreviewError,
  MediaCardError,
  ensureMediaCardError,
  ImageLoadError,
} from '../../errors';
import {
  fireOperationalEvent,
  fireCommencedEvent,
  fireCopiedEvent,
  fireScreenEvent,
} from './cardAnalytics';
import getDocument from '../../utils/document';
import {
  StoreSSRDataScript,
  getSSRData,
  MediaCardSsrData,
} from '../../utils/globalScope';
import { getCardStateFromFileState, createStateUpdater } from './cardState';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { isBigger } from '../../utils/dimensionComparer';
import { getMediaCardCursor } from '../../utils/getMediaCardCursor';
import {
  completeUfoExperience,
  startUfoExperience,
} from '../../utils/ufoExperiences';
import { generateUniqueId } from '../../utils/generateUniqueId';
import { FileStateFlags } from '../../types';

export type CardBaseProps = CardProps &
  WithAnalyticsEventsProps &
  Partial<WrappedComponentProps>;

export class CardBase extends Component<CardBaseProps, CardState> {
  // An internalOccurrenceKey is a randomly generated value to differentiate various instances
  // of Cards regardless of whether it shares the same file (either internal or external)
  private internalOccurrenceKey = generateUniqueId();
  private hasBeenMounted: boolean = false;
  private fileStateFlags: FileStateFlags = {
    wasStatusUploading: false,
    wasStatusProcessing: false,
  };
  private viewportPreAnchorRef = createRef<HTMLDivElement>();
  private viewportPostAnchorRef = createRef<HTMLDivElement>();
  private ssrReliability: SSRStatus = {
    server: { status: 'unknown' },
    client: { status: 'unknown' },
  };
  // We initialise timeElapsedTillCommenced
  // to avoid extra branching on a possibly undefined value.
  private timeElapsedTillCommenced: number = performance.now();
  subscription?: MediaSubscription;
  private ssrData?: MediaCardSsrData;
  static defaultProps: Partial<CardProps> = {
    appearance: 'auto',
    resizeMode: 'crop',
    isLazy: true,
    disableOverlay: false,
    // Media Feature Flag defaults are defined in @atlaskit/media-common
    featureFlags: {},
  };

  constructor(props: CardBaseProps) {
    super(props);

    let status: CardStatus = 'loading';
    let cardPreview: CardPreview | undefined;
    let error: MediaCardError | undefined;
    const { identifier, dimensions = {}, ssr, mediaClient } = this.props;

    if (isFileIdentifier(identifier)) {
      const { id } = identifier;
      cardPreview = getCardPreviewFromCache(id, dimensions);
      if (!cardPreview && ssr) {
        this.ssrData = getSSRData(identifier);
        if (this.ssrData?.error) {
          this.ssrReliability.server = {
            status: 'fail',
            ...this.ssrData.error,
          };
        }

        if (!this.ssrData?.dataURI) {
          try {
            cardPreview = getSSRCardPreview(
              ssr,
              mediaClient,
              identifier.id,
              this.getImageURLParams(identifier),
              this.getMediaBlobUrlAttrs(identifier),
            );
          } catch (e) {
            this.ssrReliability[ssr] = {
              status: 'fail',
              ...extractErrorInfo(e),
            };
          }
        } else {
          cardPreview = { dataURI: this.ssrData.dataURI, source: 'ssr-data' };
        }
      }
    } else if (isExternalImageIdentifier(identifier)) {
      this.fireCommencedEvent();
      status = 'loading-preview';
      const { dataURI } = identifier;
      cardPreview = { dataURI, orientation: 1, source: 'external' };
    }

    // If cardPreview is available from local cache or external, `isCardVisible`
    // should be true to avoid flickers during re-mount of the component
    // should not be visible for SSR preview, otherwise we'll fire the metadata fetch from
    // outside the viewport
    const isCardVisible =
      !this.props.isLazy || (!!cardPreview && !isSSRPreview(cardPreview));

    this.state = {
      status,
      isCardVisible,
      isPlayingFile: false,
      shouldAutoplay: false,
      cardPreview,
      cardRef: null,
      isBannedLocalPreview: false,
      previewDidRender: false,
      error,
    };
  }

  componentDidMount() {
    this.hasBeenMounted = true;
    const { isCardVisible, cardPreview } = this.state;
    const { identifier, ssr, dimensions } = this.props;

    if (isCardVisible && isFileIdentifier(identifier)) {
      this.updateStateForIdentifier(identifier);
    }
    if (
      isCardVisible &&
      !!ssr &&
      !!cardPreview &&
      isFileIdentifier(identifier)
    ) {
      if (isSSRClientPreview(cardPreview)) {
        // Since the SSR preview brings the token in the query params,
        // We need to fetch the remote preview to be able to cache it,
        this.setCacheSSRPreview(identifier);
      }
      if (
        isSSRDataPreview(cardPreview) &&
        isBigger(this.ssrData?.dimensions, dimensions)
      ) {
        // If dimensions from Server have changed and are bigger,
        // we need to refetch
        this.refetchSSRPreview(identifier);
      }
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
    const {
      mediaClient,
      identifier,
      dimensions,
      featureFlags,
      useInlinePlayer,
      disableOverlay,
    } = this.props;
    const {
      isCardVisible,
      cardPreview,
      status,
      fileState,
      isBannedLocalPreview,
      previewDidRender,
      isPlayingFile,
    } = this.state;

    const isDifferent = isDifferentIdentifier(prevIdentifier, identifier);
    const turnedVisible = !prevIsCardVisible && isCardVisible;
    const isNewMediaClient = prevMediaClient !== mediaClient;

    this.updateFileStateFlag(fileState);

    if (isExternalImageIdentifier(identifier) && isDifferent) {
      this.fireCommencedEvent();
      const { dataURI } = identifier;
      this.setState({
        status: 'loading-preview',
        cardPreview: { dataURI, orientation: 1, source: 'external' },
        isCardVisible: true,
      });
    }
    if (
      isFileIdentifier(identifier) &&
      (turnedVisible ||
        (!!this.subscription && (isNewMediaClient || isDifferent)))
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
    if (
      isFileIdentifier(identifier) &&
      fileState &&
      shouldResolvePreview({
        status,
        fileState,
        dimensions,
        prevDimensions,
        featureFlags,
        hasCardPreview: !!cardPreview,
        isBannedLocalPreview,
      })
    ) {
      this.resolvePreview(identifier, fileState);
    }
    if (
      turnedVisible &&
      this.props.ssr &&
      !!cardPreview &&
      isSSRClientPreview(cardPreview) &&
      isFileIdentifier(identifier)
    ) {
      // Since the SSR preview brings the token in the query params,
      // We need to fetch the remote preview to be able to cache it,
      this.setCacheSSRPreview(identifier);
    }

    if (
      previewDidRender &&
      // We should't complete if status is uploading
      ['loading-preview', 'processing'].includes(status)
    ) {
      this.safeSetState({ status: 'complete' });
      this.unsubscribe();
    }

    const isVideo = this.fileAttributes.fileMediatype === 'video';

    const videoAvailableToPlay = fileState && isProcessedFileState(fileState);

    if (
      isVideo &&
      !isPlayingFile &&
      disableOverlay &&
      useInlinePlayer &&
      videoAvailableToPlay &&
      getMediaFeatureFlag('timestampOnVideo', this.props.featureFlags)
    ) {
      this.setState({
        isPlayingFile: true,
      });
    }
  }

  componentWillUnmount() {
    this.hasBeenMounted = false;
    this.unsubscribe();
    getDocument().removeEventListener('copy', this.fireCopiedEvent);
  }

  updateStateForIdentifier(identifier: FileIdentifier) {
    this.fireCommencedEvent();
    this.subscribeInternalFile(identifier);
  }

  private getImageURLParams = ({
    collectionName: collection,
  }: FileIdentifier): MediaStoreGetFileImageParams => ({
    collection,
    mode: imageResizeModeToFileImageMode(this.props.resizeMode),
    ...this.requestedDimensions,
    allowAnimated: true,
  });

  private getMediaBlobUrlAttrs = (
    identifier: FileIdentifier,
    fileState?: FileState,
  ): MediaBlobUrlAttrs | undefined => {
    const { id, collectionName: collection } = identifier;
    const { originalDimensions, contextId, alt } = this.props;
    const { mimeType, name, size } = getFileDetails(identifier, fileState);
    return contextId
      ? {
          id,
          collection,
          contextId,
          mimeType,
          name,
          size,
          ...(originalDimensions || this.requestedDimensions),
          alt,
        }
      : undefined;
  };

  private getCardPreviewParams = (
    identifier: FileIdentifier,
    fileState: FileState,
  ): CardPreviewParams => {
    const { isBannedLocalPreview } = this.state;
    const { id } = identifier;
    const { dimensions = {}, mediaClient } = this.props;

    return {
      mediaClient,
      id,
      dimensions,
      onLocalPreviewError: this.fireLocalPreviewErrorEvent,
      filePreview: isBannedLocalPreview
        ? undefined
        : getFilePreviewFromFileState(fileState),
      isRemotePreviewReady: isImageRepresentationReady(fileState),
      imageUrlParams: this.getImageURLParams(identifier),
      mediaBlobUrlAttrs: this.getMediaBlobUrlAttrs(identifier, fileState),
    };
  };

  private setCacheSSRPreview = (identifier: FileIdentifier) => {
    const { mediaClient, dimensions = {} } = this.props;
    fetchAndCacheRemotePreview(
      mediaClient,
      identifier.id,
      dimensions,
      this.getImageURLParams(identifier),
      this.getMediaBlobUrlAttrs(identifier),
    ).catch(() => {
      // No need to log this error.
      // If preview fails, it will be refetched later
      //TODO: test this catch
      // https://product-fabric.atlassian.net/browse/MEX-1071
    });
  };

  private refetchSSRPreview = async (identifier: FileIdentifier) => {
    const { mediaClient, dimensions = {} } = this.props;
    try {
      const cardPreview = await fetchAndCacheRemotePreview(
        mediaClient,
        identifier.id,
        dimensions,
        this.getImageURLParams(identifier),
        this.getMediaBlobUrlAttrs(identifier),
      );
      this.safeSetState({ cardPreview });
    } catch (e) {
      // No need to log this error.
      // If preview fails, it will be refetched later
    }
  };

  private resolvePreview = async (
    identifier: FileIdentifier,
    fileState: FileState,
  ) => {
    try {
      const params = this.getCardPreviewParams(identifier, fileState);
      const cardPreview = await getCardPreview(params);
      this.safeSetState({ cardPreview });
    } catch (e) {
      const wrappedError = ensureMediaCardError('preview-fetch', e);
      //  If remote preview fails, we set status 'error'
      //  If local preview fails (i.e, no remote preview available),
      //  we can stay in the same status until there is a remote preview available
      //  If it's any other error we set status 'error'
      if (isLocalPreviewError(wrappedError)) {
        this.safeSetState({ isBannedLocalPreview: true });
      } else {
        this.safeSetState({ status: 'error', error: wrappedError });
      }
    }
  };

  updateFileStateFlag(fileState?: FileState) {
    if (!fileState) {
      return;
    }
    const { status } = fileState;
    if (status === 'processing') {
      this.fileStateFlags.wasStatusProcessing = true;
    } else if (status === 'uploading') {
      this.fileStateFlags.wasStatusUploading = true;
    }
  }

  subscribeInternalFile(identifier: FileIdentifier) {
    const { mediaClient } = this.props;
    const { isBannedLocalPreview } = this.state;
    const { id, collectionName, occurrenceKey } = identifier;
    this.unsubscribe();
    this.subscription = mediaClient.file
      .getFileState(id, { collectionName, occurrenceKey })
      .subscribe({
        next: (fileState) => {
          const { featureFlags } = this.props;
          const newState = getCardStateFromFileState(
            fileState,
            isBannedLocalPreview,
            featureFlags,
          );
          this.safeSetState(newState);
        },
        error: (e) => {
          const errorReason =
            this.state.status === 'uploading' ? 'upload' : 'metadata-fetch';
          const error = new MediaCardError(errorReason, e);
          this.safeSetState({ error, status: 'error' });
        },
      });
  }

  private get requestedDimensions(): NumericalCardDimensions {
    const { dimensions } = this.props;
    const { cardRef: element } = this.state || {};
    return getRequestedDimensions({ dimensions, element });
  }

  private get metadata(): FileDetails {
    return getFileDetails(this.props.identifier, this.state?.fileState);
  }

  private get fileAttributes(): FileAttributes {
    return getFileAttributes(this.metadata, this.state?.fileState?.status);
  }

  private getPerformanceAttributes = () => {
    const { timeElapsedTillCommenced } = this;
    const timeElapsedTillEvent = performance.now();
    const durationSinceCommenced =
      timeElapsedTillCommenced &&
      timeElapsedTillEvent - timeElapsedTillCommenced;

    return {
      overall: {
        durationSincePageStart: timeElapsedTillEvent,
        durationSinceCommenced,
      },
    };
  };

  private logSSRImageError = (cardPreview?: CardPreview) => {
    if (cardPreview) {
      const failedSSRObject: SSRStatusFail = {
        status: 'fail',
        ...extractErrorInfo(new ImageLoadError(cardPreview.source)),
      };

      if (isSSRClientPreview(cardPreview)) {
        this.ssrReliability.client = failedSSRObject;
      }

      /*
        If the cardPreview failed and it comes from server (global scope / ssrData), it means that we have reused it in client and the error counts for both: server & client.
      */

      if (isSSRDataPreview(cardPreview)) {
        this.ssrReliability.server = failedSSRObject;
        this.ssrReliability.client = failedSSRObject;
      }
    }
  };

  private onImageError = (cardPreview?: CardPreview) => {
    this.logSSRImageError(cardPreview);
    const { cardPreview: currentPreview } = this.state;
    // If the dataURI has been replaced, we can dismiss this error
    if (cardPreview?.dataURI !== currentPreview?.dataURI) {
      return;
    }
    const error = new ImageLoadError(cardPreview?.source);
    const isLocal = cardPreview && isLocalPreview(cardPreview);
    const isSSR =
      cardPreview &&
      (isSSRClientPreview(cardPreview) || isSSRDataPreview(cardPreview));

    if (isLocal || isSSR) {
      const updateState: Partial<CardState> = { cardPreview: undefined };
      if (isLocal) {
        updateState.isBannedLocalPreview = true;
        this.fireLocalPreviewErrorEvent(error);
      }
      const { identifier, dimensions = {} } = this.props;
      isFileIdentifier(identifier) &&
        removeCardPreviewFromCache(identifier.id, dimensions);
      this.safeSetState(updateState);
    } else {
      this.safeSetState({
        status: 'error',
        error,
      });
    }
  };

  private onImageLoad = (cardPreview?: CardPreview) => {
    if (cardPreview) {
      if (
        isSSRClientPreview(cardPreview) &&
        this.ssrReliability.client.status === 'unknown'
      ) {
        this.ssrReliability.client = { status: 'success' };
      }

      /*
        If the image loads successfully and it comes from server (global scope / ssrData), it means that we have reused it in client and the success counts for both: server & client.
      */

      if (
        isSSRDataPreview(cardPreview) &&
        this.ssrReliability.server.status === 'unknown'
      ) {
        this.ssrReliability.server = { status: 'success' };
        this.ssrReliability.client = { status: 'success' };
      }
    }

    const { cardPreview: currentPreview } = this.state;
    // If the dataURI has been replaced, we can dismiss this callback
    if (cardPreview?.dataURI !== currentPreview?.dataURI) {
      return;
    }

    this.safeSetState({ previewDidRender: true });
  };

  private fireOperationalEvent() {
    const { status, error } = this.state;
    const { createAnalyticsEvent } = this.props;

    createAnalyticsEvent &&
      fireOperationalEvent(
        createAnalyticsEvent,
        status,
        this.fileAttributes,
        this.getPerformanceAttributes(),
        this.ssrReliability,
        error,
      );
    completeUfoExperience(
      this.internalOccurrenceKey,
      status,
      this.fileAttributes,
      this.fileStateFlags,
      this.ssrReliability,
      error,
    );
  }

  private fireCommencedEvent() {
    this.timeElapsedTillCommenced = performance.now();
    const { createAnalyticsEvent } = this.props;
    createAnalyticsEvent &&
      fireCommencedEvent(createAnalyticsEvent, this.fileAttributes, {
        overall: { durationSincePageStart: this.timeElapsedTillCommenced },
      });
    startUfoExperience(this.internalOccurrenceKey);
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

  private fireLocalPreviewErrorEvent = (error: MediaCardError) => {
    // TODO: track local preview success rate
    // https://product-fabric.atlassian.net/browse/MEX-774
  };

  private safeSetState = (state: Partial<CardState>) => {
    if (this.hasBeenMounted) {
      // If it's setting the status, we need to use a state updater function,
      // which ensures that no non-final status overrides a final status.
      // If no status is set, we don't need a sate updater
      const updater = !!state.status
        ? createStateUpdater(state)
        : (state as Pick<CardState, keyof CardState>);

      this.setState(updater);
    }
  };

  unsubscribe = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.hasBeenMounted) {
      // TODO MEX-788: add test for "do not remove the card preview when unsubscribing".
      this.setState({ isBannedLocalPreview: false });
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
        shouldAutoplay: true,
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
      onFullscreenChange,
    } = this.props;
    const { shouldAutoplay, cardPreview } = this.state;

    return (
      <InlinePlayer
        mediaClient={mediaClient}
        dimensions={dimensions}
        originalDimensions={originalDimensions}
        identifier={identifier as FileIdentifier}
        autoplay={!!shouldAutoplay}
        onFullscreenChange={onFullscreenChange}
        onError={this.onInlinePlayerError}
        onClick={this.onClick}
        selected={selected}
        ref={this.setRef}
        testId={testId}
        cardPreview={cardPreview}
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
      ssr,
      useInlinePlayer,
      shouldOpenMediaViewer,
    } = this.props;
    const { mediaItemType } = identifier;
    const {
      status,
      progress,
      cardPreview,
      error,
      cardRef,
      isCardVisible,
    } = this.state;
    const { metadata } = this;
    const { onCardViewClick, onDisplayImage, actions, onMouseEnter } = this;

    // Card can be artificially turned visible before entering the viewport
    // For example, when we have the image in cache
    const nativeLazyLoad = isLazy && !isCardVisible;
    // Force Media Image to always display img for SSR
    const forceSyncDisplay = !!ssr;

    const mediaCardCursor = getMediaCardCursor(
      !!useInlinePlayer,
      !!shouldOpenMediaViewer,
      status === 'error' || status === 'failed-processing',
      !!this.state.cardPreview,
      metadata.mediaType,
    );

    const card = (
      <CardView
        status={status}
        error={error}
        mediaItemType={mediaItemType}
        metadata={metadata}
        cardPreview={cardPreview}
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
        innerRef={this.setRef}
        testId={testId}
        featureFlags={featureFlags}
        titleBoxBgColor={titleBoxBgColor}
        titleBoxIcon={titleBoxIcon}
        onImageError={this.onImageError}
        onImageLoad={this.onImageLoad}
        nativeLazyLoad={nativeLazyLoad}
        forceSyncDisplay={forceSyncDisplay}
        mediaCardCursor={mediaCardCursor}
      />
    );

    return isLazy ? (
      <ViewportDetector
        cardEl={cardRef}
        preAnchorRef={this.viewportPreAnchorRef}
        postAnchorRef={this.viewportPostAnchorRef}
        onVisible={this.onCardInViewport}
      >
        <ViewportAnchor
          ref={this.viewportPreAnchorRef}
          offsetTop={-ABS_VIEWPORT_ANCHOR_OFFSET_TOP}
        />
        {card}
        <ViewportAnchor
          ref={this.viewportPostAnchorRef}
          offsetTop={ABS_VIEWPORT_ANCHOR_OFFSET_TOP}
        />
      </ViewportDetector>
    ) : (
      card
    );
  };

  private storeSSRData = () => {
    const { ssr, identifier } = this.props;
    const { cardPreview: { dataURI } = {} } = this.state;

    return (
      isFileIdentifier(identifier) &&
      ssr === 'server' && (
        <StoreSSRDataScript
          identifier={identifier}
          dataURI={dataURI}
          dimensions={this.requestedDimensions}
          error={
            this.ssrReliability.server?.status === 'fail'
              ? this.ssrReliability.server
              : undefined
          }
        />
      )
    );
  };

  render() {
    const { isPlayingFile, mediaViewerSelectedItem } = this.state;
    const innerContent = (
      <>
        {isPlayingFile ? this.renderInlinePlayer() : this.renderCard()}
        {mediaViewerSelectedItem ? this.renderMediaViewer() : null}
        {this.storeSSRData()}
      </>
    );

    return this.props.intl ? (
      innerContent
    ) : (
      <IntlProvider locale="en">{innerContent}</IntlProvider>
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

export const Card: React.ComponentType<CardBaseProps> = withMediaAnalyticsContext(
  {
    packageVersion,
    packageName,
    componentName: 'mediaCard',
    component: 'mediaCard',
  },
  {
    filterFeatureFlags: LOGGED_FEATURE_FLAGS,
  },
)(
  withAnalyticsEvents()(
    injectIntl(
      CardBase as React.ComponentType<CardBaseProps & WrappedComponentProps>,
      {
        enforceContext: false,
      },
    ),
  ),
);
