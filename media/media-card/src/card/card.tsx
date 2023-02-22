import React, { Component, Suspense } from 'react';
import ReactDOM from 'react-dom';
import {
  UIAnalyticsEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  NumericalCardDimensions,
  SSR,
  withMediaAnalyticsContext,
} from '@atlaskit/media-common';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import {
  FileAttributes,
  MediaTraceContext,
  getRandomHex,
} from '@atlaskit/media-common';
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
  MediaClient,
} from '@atlaskit/media-client';
import { MediaViewer, MediaViewerDataSource } from '@atlaskit/media-viewer';
import {
  injectIntl,
  IntlProvider,
  WrappedComponentProps,
} from 'react-intl-next';
import { CardAction } from './actions';
import { CardProps, CardState, CardStatus, CardPreview } from '../types';
import { CardView } from './cardView';
import { ViewportDetector } from '../utils/viewportDetector';
import { getRequestedDimensions } from '../utils/getDataURIDimension';
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
import { getFileDetails } from '../utils/metadata';
import { InlinePlayerLazy } from './inlinePlayerLazy';
import {
  getFileAttributes,
  extractErrorInfo,
  SSRStatus,
  SSRStatusFail,
  LOGGED_FEATURE_FLAGS,
} from '../utils/analytics';
import {
  isLocalPreviewError,
  MediaCardError,
  ensureMediaCardError,
  ImageLoadError,
} from '../errors';
import {
  fireOperationalEvent,
  fireCommencedEvent,
  fireCopiedEvent,
  fireScreenEvent,
  fireNonCriticalErrorEvent,
} from './cardAnalytics';
import getDocument from '../utils/document';
import {
  StoreSSRDataScript,
  getSSRData,
  MediaCardSsrData,
} from '../utils/globalScope';
import { getCardStateFromFileState, createStateUpdater } from './cardState';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { isBigger } from '../utils/dimensionComparer';
import { getMediaCardCursor } from '../utils/getMediaCardCursor';
import {
  completeUfoExperience,
  startUfoExperience,
} from '../utils/ufoExperiences';
import { generateUniqueId } from '../utils/generateUniqueId';
import { FileStateFlags } from '../types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

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
  private ssrReliability: SSRStatus = {
    server: { status: 'unknown' },
    client: { status: 'unknown' },
  };
  // We initialise timeElapsedTillCommenced
  // to avoid extra branching on a possibly undefined value.
  private timeElapsedTillCommenced: number = performance.now();
  subscription?: MediaSubscription;
  private ssrData?: MediaCardSsrData;
  // Generate unique traceId for file
  private traceContext: MediaTraceContext = {
    traceId: getRandomHex(8),
  };
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
    const { identifier, resizeMode, ssr, mediaClient } = this.props;

    if (isFileIdentifier(identifier)) {
      const { id } = identifier;
      const fileImageMode = imageResizeModeToFileImageMode(resizeMode);
      cardPreview = getCardPreviewFromCache(id, fileImageMode);
      if (!cardPreview && ssr) {
        cardPreview = this.getSSRPreview(ssr, identifier, mediaClient);
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
      wasResolvedUpfrontPreview: false,
    };
  }

  private getSSRPreview(
    ssr: SSR,
    identifier: FileIdentifier,
    mediaClient: MediaClient,
  ): CardPreview | undefined {
    this.ssrData = getSSRData(identifier);
    if (this.ssrData?.error) {
      this.ssrReliability.server = {
        status: 'fail',
        ...this.ssrData.error,
      };
    }

    if (!this.ssrData?.dataURI) {
      try {
        return getSSRCardPreview(
          ssr,
          mediaClient,
          identifier.id,
          this.getImageURLParams(identifier),
          this.getMediaBlobUrlAttrs(identifier),
        );
      } catch (e: any) {
        this.ssrReliability[ssr] = {
          status: 'fail',
          ...extractErrorInfo(e),
        };
      }
    } else {
      return { dataURI: this.ssrData.dataURI, source: 'ssr-data' };
    }
  }

  componentDidMount() {
    this.hasBeenMounted = true;
    const { isCardVisible, cardPreview } = this.state;
    const { identifier, ssr, dimensions } = this.props;

    if (isCardVisible && isFileIdentifier(identifier)) {
      this.updateStateForIdentifier(identifier);
      if (!cardPreview) {
        this.resolveUpfrontPreview(identifier);
      }
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
    getDocument()?.addEventListener('copy', this.fireCopiedEvent);
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
      resizeMode,
    } = this.props;
    const {
      isCardVisible,
      cardPreview,
      status,
      fileState,
      isBannedLocalPreview,
      previewDidRender,
      isPlayingFile,
      wasResolvedUpfrontPreview,
    } = this.state;

    const isDifferent = isDifferentIdentifier(prevIdentifier, identifier);
    /**
     * Variable turnedVisible should only be true when media card
     * was invisible in the previous state and is visible in the current one
     *
     * prevIsCardVisible | isCardVisible |  turnedVisible
     * ----------------------------------------------------
     *       false       |    false      |      false
     *       false       |    true       |      true
     *       true        |    true       |      false
     *       true        |    false      |      false       (unreachable case)
     * ----------------------------------------------------
     */
    const turnedVisible = !prevIsCardVisible && isCardVisible;
    const isNewMediaClient = prevMediaClient !== mediaClient;
    const fileImageMode = imageResizeModeToFileImageMode(resizeMode);

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
      turnedVisible &&
      !cardPreview &&
      !wasResolvedUpfrontPreview
    ) {
      // This is a one-off call, only meant to happen when turnedVisible = true (only once in the component's lifecycle)
      this.resolveUpfrontPreview(identifier);
    } else if (
      isFileIdentifier(identifier) &&
      fileState &&
      shouldResolvePreview({
        status,
        fileState,
        prevDimensions,
        dimensions,
        identifier,
        fileImageMode,
        featureFlags,
        hasCardPreview: !!cardPreview,
        isBannedLocalPreview,
        wasResolvedUpfrontPreview,
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
    getDocument()?.removeEventListener('copy', this.fireCopiedEvent);
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
    const { dimensions = {}, mediaClient, createAnalyticsEvent } = this.props;

    return {
      mediaClient,
      id,
      dimensions,
      onLocalPreviewError: this.fireNonCriticalErrorEvent,
      filePreview: isBannedLocalPreview
        ? undefined
        : getFilePreviewFromFileState(fileState),
      isRemotePreviewReady: isImageRepresentationReady(fileState),
      imageUrlParams: this.getImageURLParams(identifier),
      mediaBlobUrlAttrs: this.getMediaBlobUrlAttrs(identifier, fileState),
      createAnalyticsEvent,
      featureFlags: this.props.featureFlags,
      traceContext: this.traceContext,
    };
  };

  private setCacheSSRPreview = (identifier: FileIdentifier) => {
    this.fetchAndCacheRemotePreview(identifier).catch(() => {
      // No need to log this error.
      // If preview fails, it will be refetched later
      //TODO: test this catch
      // https://product-fabric.atlassian.net/browse/MEX-1071
    });
  };

  private refetchSSRPreview = async (identifier: FileIdentifier) => {
    try {
      const cardPreview = await this.fetchAndCacheRemotePreview(identifier);
      this.safeSetState({ cardPreview });
    } catch (e) {
      const wrappedError = ensureMediaCardError(
        'remote-preview-fetch-ssr',
        e as Error,
        true,
      );
      this.fireNonCriticalErrorEvent(wrappedError);
    }
  };

  private resolveUpfrontPreview = async (identifier: FileIdentifier) => {
    const requestedDimensions = { ...this.props.dimensions };

    try {
      const cardPreview = await this.fetchAndCacheRemotePreview(identifier);

      const { dimensions: currentDimensions } = this.props;
      const areValidRequestedDimensions = !isBigger(
        requestedDimensions,
        currentDimensions,
      );

      // If there are new and bigger dimensions in the props, and the upfront preview is still resolving,
      // the fetched preview is no longer valid, and thus, we dismiss it and set the flag wasResolvedUpfrontPreview = true
      // to trigger a normal preview fetch.
      if (areValidRequestedDimensions) {
        this.safeSetState({
          cardPreview,
          wasResolvedUpfrontPreview: true,
        });
      } else {
        this.safeSetState({ wasResolvedUpfrontPreview: true });
      }
    } catch (e) {
      this.safeSetState({ wasResolvedUpfrontPreview: true });
      // NO need to log error. If this call fails, a refetch will happen after
    }
  };

  private fetchAndCacheRemotePreview = (identifier: FileIdentifier) => {
    const { mediaClient, dimensions = {} } = this.props;
    return fetchAndCacheRemotePreview(
      mediaClient,
      identifier.id,
      dimensions,
      this.getImageURLParams(identifier),
      this.getMediaBlobUrlAttrs(identifier),
    );
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
      const wrappedError = ensureMediaCardError('preview-fetch', e as Error);
      //  If remote preview fails, we set status 'error'
      //  If local preview fails (i.e, no remote preview available),
      //  we can stay in the same status until there is a remote preview available
      //  If it's any other error we set status 'error'
      if (isLocalPreviewError(wrappedError)) {
        // This error should already been logged inside the getCardPreview. No need to log it here.
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
        this.fireNonCriticalErrorEvent(error);
      }
      const { identifier, resizeMode } = this.props;
      const fileImageMode = imageResizeModeToFileImageMode(resizeMode);
      isFileIdentifier(identifier) &&
        removeCardPreviewFromCache(identifier.id, fileImageMode);
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
    const { status, error, fileState } = this.state;
    const { createAnalyticsEvent } = this.props;

    createAnalyticsEvent &&
      fireOperationalEvent(
        createAnalyticsEvent,
        status,
        this.fileAttributes,
        this.getPerformanceAttributes(),
        this.ssrReliability,
        error,
        this.traceContext,
        fileState?.metadataTraceContext,
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
      fireCommencedEvent(
        createAnalyticsEvent,
        this.fileAttributes,
        {
          overall: { durationSincePageStart: this.timeElapsedTillCommenced },
        },
        this.traceContext,
      );
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

  private fireNonCriticalErrorEvent = (error: MediaCardError) => {
    const { createAnalyticsEvent } = this.props;
    const { fileState } = this.state;
    createAnalyticsEvent &&
      fireNonCriticalErrorEvent(
        createAnalyticsEvent,
        this.state.status,
        this.fileAttributes,
        this.ssrReliability,
        error,
        this.traceContext,
        fileState?.metadataTraceContext,
      );
  };

  private safeSetState = (newState: Partial<CardState>) => {
    if (this.hasBeenMounted) {
      /**
       * createStateUpdater helper returns a callback to be passed to setState.
       * It decides wether to update the 'status' depending on the current state vs the input state.
       * From docs: "Both state and props received by the updater function are guaranteed to be up-to-date."
       * If the input state brings an error and it won't be updating the state, the error will be logged as non-critical inside the helper.
       * If the error persists int the state, it means it is a critical error and should be logged as a failed event for Card
       */
      this.setState(
        createStateUpdater(newState, this.fireNonCriticalErrorEvent) as (
          // TODO: revisit this casting
          prevState: CardState,
        ) => Pick<CardState, keyof CardState>,
      );
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

    const card = this.renderCard(false, 'loading', false);

    return (
      <Suspense fallback={card}>
        <InlinePlayerLazy
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
      </Suspense>
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

  renderCard = (
    withCallbacks = true,
    cardStatusOverride?: CardStatus,
    izLazyOverride?: boolean,
  ) => {
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
    const { status, progress, cardPreview, error, cardRef, isCardVisible } =
      this.state;
    const { metadata } = this;
    const { onCardViewClick, onDisplayImage, actions, onMouseEnter } = this;

    const isLazyWithOverride =
      izLazyOverride === undefined ? isLazy : izLazyOverride;

    // Card can be artificially turned visible before entering the viewport
    // For example, when we have the image in cache
    const nativeLazyLoad = isLazyWithOverride && !isCardVisible;
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
        status={cardStatusOverride || status}
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
        onClick={withCallbacks ? onCardViewClick : undefined}
        onMouseEnter={withCallbacks ? onMouseEnter : undefined}
        disableOverlay={disableOverlay}
        progress={progress}
        onDisplayImage={withCallbacks ? onDisplayImage : undefined}
        innerRef={this.setRef}
        testId={testId}
        featureFlags={featureFlags}
        titleBoxBgColor={titleBoxBgColor}
        titleBoxIcon={titleBoxIcon}
        onImageError={withCallbacks ? this.onImageError : undefined}
        onImageLoad={withCallbacks ? this.onImageLoad : undefined}
        nativeLazyLoad={nativeLazyLoad}
        forceSyncDisplay={forceSyncDisplay}
        mediaCardCursor={mediaCardCursor}
      />
    );

    return isLazyWithOverride ? (
      <ViewportDetector cardEl={cardRef} onVisible={this.onCardInViewport}>
        {card}
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

export const Card: React.ComponentType<CardBaseProps> =
  withMediaAnalyticsContext(
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
