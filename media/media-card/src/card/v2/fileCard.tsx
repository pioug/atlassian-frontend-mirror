import {
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import {
  FileDetails,
  FileIdentifier,
  FileState,
  Identifier,
  MediaClient,
  MediaStoreGetFileImageParams,
  RECENTS_COLLECTION,
  addFileAttrsToUrl,
  globalMediaEventEmitter,
  imageResizeModeToFileImageMode,
  isFileIdentifier,
  isImageRepresentationReady,
} from '@atlaskit/media-client';
import {
  MediaFileStateError,
  useFileState,
} from '@atlaskit/media-client-react';
import {
  MediaTraceContext,
  SSR,
  getMediaTypeFromMimeType,
  getRandomHex,
  isMimeTypeSupportedByBrowser,
} from '@atlaskit/media-common';
import { getOrientation } from '@atlaskit/media-ui';
import { MediaViewer } from '@atlaskit/media-viewer';
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import {
  ImageLoadError,
  LocalPreviewError,
  MediaCardError,
  ensureMediaCardError,
  isLocalPreviewError,
  isUnsupportedLocalPreviewError,
} from '../../errors';
import {
  CardEventProps,
  CardPreview,
  CardStatus,
  FileStateFlags,
  SharedCardProps,
} from '../../types';
import {
  SSRStatus,
  SSRStatusFail,
  extractErrorInfo,
} from '../../utils/analytics';
import { isBigger } from '../../utils/dimensionComparer';
import getDocument from '../../utils/document';
import { generateUniqueId } from '../../utils/generateUniqueId';
import { getRequestedDimensions } from '../../utils/getDataURIDimension';
import { getMediaCardCursor } from '../../utils/getMediaCardCursor';
import {
  MediaCardSsrData,
  getSSRData,
  StoreSSRDataScript,
} from '../../utils/globalScope';
import { getFileDetails } from '../../utils/metadata';
import {
  abortUfoExperience,
  completeUfoExperience,
  startUfoExperience,
} from '../../utils/ufoExperiences';
import { useCurrentValueRef } from '../../utils/useCurrentValueRef';
import { usePrevious } from '../../utils/usePrevious';
import { videoIsPlayable } from '../../utils/videoIsPlayable';
import { takeSnapshot } from '../../utils/videoSnapshot';
import { ViewportDetector } from '../../utils/viewportDetector';
import {
  fireCommencedEvent,
  fireCopiedEvent,
  fireNonCriticalErrorEvent,
  fireOperationalEvent,
  fireScreenEvent,
} from '../cardAnalytics';
import {
  fetchAndCacheRemotePreview,
  getCardPreviewFromCache,
  getSSRCardPreview,
  isLocalPreview,
  isSSRClientPreview,
  isSSRDataPreview,
  isSSRPreview,
  removeCardPreviewFromCache,
  shouldResolvePreview,
} from '../getCardPreview';
import cardPreviewCache from '../getCardPreview/cache';
import { CardViewV2 } from './cardViewV2';
import { InlinePlayerLazyV2 } from './inlinePlayerLazyV2';

export interface FileCardProps extends SharedCardProps, CardEventProps {
  // Instance of MediaClient.
  readonly mediaClient: MediaClient;
  // Instance of file identifier.
  readonly identifier: FileIdentifier;
  // Lazy loads the media file.
  readonly isLazy?: boolean;
  // Uses the inline player for media file.
  readonly useInlinePlayer?: boolean;
  // Uses media MediaViewer to preview the media file.
  readonly shouldOpenMediaViewer?: boolean;
  // Media file list to display in Media Viewer.
  readonly mediaViewerItems?: Identifier[];
  // Retrieve auth based on a given context.
  readonly contextId?: string;
  // Enables the download button for media file.
  readonly shouldEnableDownloadButton?: boolean;
  // Server-Side-Rendering modes are "media" and "client"
  readonly ssr?: SSR;
  // Disable tooltip for the card
  readonly shouldHideTooltip?: boolean;
}

export type FileCardBaseProps = FileCardProps & WithAnalyticsEventsProps;

export const FileCard = ({
  appearance = 'auto',
  resizeMode = 'crop',
  isLazy = true,
  disableOverlay = false,
  // Media Feature Flag defaults are defined in @atlaskit/media-common
  featureFlags = {},
  identifier,
  ssr,
  mediaClient,
  dimensions,
  originalDimensions,
  contextId,
  alt,
  actions,
  shouldEnableDownloadButton,
  useInlinePlayer,
  shouldOpenMediaViewer,
  onFullscreenChange,
  selectable,
  selected,
  testId,
  titleBoxBgColor,
  titleBoxIcon,
  shouldHideTooltip,
  mediaViewerItems,
  onClick,
  onMouseEnter,
  createAnalyticsEvent,
}: FileCardBaseProps) => {
  //----------------------------------------------------------------//
  //---------------- State Initializer Functions -------------------//
  //----------------------------------------------------------------//

  const ssrDataRef = useRef<MediaCardSsrData>();
  const ssrReliabilityRef = useRef<SSRStatus>({
    server: { status: 'unknown' },
    client: { status: 'unknown' },
  });

  const [cardElement, setCardElement] = useState<HTMLDivElement | null>(null);

  const imageURLParams = useMemo<MediaStoreGetFileImageParams>(
    () => ({
      collection: identifier.collectionName,
      mode: resizeMode === 'stretchy-fit' ? 'full-fit' : resizeMode,
      ...getRequestedDimensions({ dimensions, element: cardElement }),
      allowAnimated: true,
    }),
    [cardElement, dimensions, identifier.collectionName, resizeMode],
  );

  const getMediaBlobUrlAttrs = useCallback(
    (fileState?: FileState) => {
      const { id, collectionName: collection } = identifier;
      const { mimeType, name, size } = getFileDetails(identifier, fileState);
      return contextId
        ? {
            id,
            collection,
            contextId,
            mimeType,
            name,
            size,
            ...(originalDimensions ||
              getRequestedDimensions({ dimensions, element: cardElement })),
            alt,
          }
        : undefined;
    },
    [alt, cardElement, contextId, dimensions, identifier, originalDimensions],
  );

  const getSSRPreview = (
    ssr: SSR,
    identifier: FileIdentifier,
    mediaClient: MediaClient,
  ): CardPreview | undefined => {
    ssrDataRef.current = getSSRData(identifier);
    if (ssrDataRef.current?.error) {
      ssrReliabilityRef.current.server = {
        status: 'fail',
        ...ssrDataRef.current.error,
      };
    }

    if (!ssrDataRef.current?.dataURI) {
      try {
        return getSSRCardPreview(
          ssr,
          mediaClient,
          identifier.id,
          imageURLParams,
          getMediaBlobUrlAttrs(fileStateValue),
        );
      } catch (e: any) {
        ssrReliabilityRef.current[ssr] = {
          status: 'fail',
          ...extractErrorInfo(e),
        };
      }
    } else {
      return { dataURI: ssrDataRef.current.dataURI, source: 'ssr-data' };
    }
  };

  const cardPreviewInitializer = () => {
    let cardPreview: CardPreview | undefined;
    const { id } = identifier;
    const fileImageMode = imageResizeModeToFileImageMode(resizeMode);
    cardPreview = getCardPreviewFromCache(id, fileImageMode);
    if (!cardPreview && ssr) {
      cardPreview = getSSRPreview(ssr, identifier, mediaClient);
    }
    return cardPreview;
  };

  const [cardPreview, setCardPreview] = useState(cardPreviewInitializer);

  // If cardPreview is available from local cache or external, `isCardVisible`
  // should be true to avoid flickers during re-mount of the component
  // should not be visible for SSR preview, otherwise we'll fire the metadata fetch from
  // outside the viewport
  const [isCardVisible, setIsCardVisible] = useState(
    () => !isLazy || (cardPreview && !isSSRPreview(cardPreview)),
  );
  const { fileState } = useFileState(identifier.id, {
    skipRemote: !isCardVisible,
    collectionName: identifier.collectionName,
    occurrenceKey: identifier.occurrenceKey,
  });

  const prevFileState = usePrevious(fileState);

  const fileStateValue: FileState | undefined = useMemo(() => {
    if (fileState && fileState?.status !== 'error') {
      return fileState;
    }
    return prevFileState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileState]);

  //----------------------------------------------------------------//
  //------------ State, Refs & Initial Values ----------------------//
  //----------------------------------------------------------------//

  const internalOccurrenceKey = useMemo(() => generateUniqueId(), []);
  const timeElapsedTillCommenced = useMemo(() => performance.now(), []);

  const fileStateFlagsRef = useRef<FileStateFlags>({
    wasStatusUploading: false,
    wasStatusProcessing: false,
  });

  // Generate unique traceId for file
  const traceContext = useMemo<MediaTraceContext>(
    () => ({
      traceId: getRandomHex(8),
    }),
    [],
  );

  const [status, setStatus] = useState<CardStatus>('loading');
  useEffect(() => {
    setStatus('loading');
  }, [identifier]);

  const [isPlayingFile, setIsPlayingFile] = useState(false);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

  const [isBannedLocalPreview, setIsBannedLocalPreview] = useState(false);
  const [previewDidRender, setPreviewDidRender] = useState(false);
  const [error, setError] = useState<MediaCardError | undefined>();
  const wasResolvedUpfrontPreviewRef = useRef(false);

  const [mediaViewerSelectedItem, setMediaViewerSelectedItem] =
    useState<Identifier | null>(null);

  const uploadProgressRef = useRef<number>();

  const metadata = useMemo<FileDetails>(() => {
    const getProcessingStatusFromFileState = (status: FileState['status']) => {
      switch (status) {
        case 'processed':
          return 'succeeded';
        case 'processing':
          return 'running';
        case 'failed-processing':
          return 'failed';
      }
    };

    if (fileStateValue && fileStateValue?.status !== 'error') {
      return {
        id: fileStateValue.id,
        name: fileStateValue.name,
        size: fileStateValue.size,
        mimeType: fileStateValue.mimeType,
        createdAt: fileStateValue.createdAt,
        mediaType: fileStateValue.mediaType,
        processingStatus: getProcessingStatusFromFileState(
          fileStateValue.status,
        ),
      };
    } else {
      return { id: identifier.id };
    }
  }, [fileStateValue, identifier.id]);

  const fileAttributes = useMemo(() => {
    return {
      fileMediatype: metadata.mediaType,
      fileMimetype: metadata.mimeType,
      fileId: metadata.id,
      fileSize: metadata.size,
      fileStatus: fileStateValue?.status,
    };
  }, [
    fileStateValue?.status,
    metadata.id,
    metadata.mediaType,
    metadata.mimeType,
    metadata.size,
  ]);

  const computedActions = useMemo(() => {
    if (status === 'failed-processing' || shouldEnableDownloadButton) {
      const downloadAction = {
        label: 'Download',
        icon: <DownloadIcon label="Download" />,
        handler: () =>
          mediaClient.file.downloadBinary(
            identifier.id,
            metadata.name,
            identifier.collectionName,
          ),
      };
      return [downloadAction, ...(actions ?? [])];
    } else {
      return actions;
    }
  }, [
    actions,
    identifier.collectionName,
    identifier.id,
    mediaClient.file,
    metadata.name,
    shouldEnableDownloadButton,
    status,
  ]);

  //----------------------------------------------------------------//
  //---------------------- Analytics  ------------------------------//
  //----------------------------------------------------------------//

  const fireOperationalEventRef = useCurrentValueRef(() => {
    const timeElapsedTillEvent = performance.now();
    const durationSinceCommenced =
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
        fileAttributes,
        performanceAttributes,
        ssrReliabilityRef.current,
        error,
        traceContext,
        fileStateValue?.metadataTraceContext,
      );
    completeUfoExperience(
      internalOccurrenceKey,
      status,
      fileAttributes,
      fileStateFlagsRef.current,
      ssrReliabilityRef.current,
      error,
    );
  });

  const fireNonCriticalErrorEventRef = useCurrentValueRef(
    (error: MediaCardError) => {
      createAnalyticsEvent &&
        fireNonCriticalErrorEvent(
          createAnalyticsEvent,
          status,
          fileAttributes,
          ssrReliabilityRef.current,
          error,
          traceContext,
          fileStateValue?.metadataTraceContext,
        );
    },
  );

  const fireScreenEventRef = useCurrentValueRef(() => {
    createAnalyticsEvent &&
      fireScreenEvent(createAnalyticsEvent, fileAttributes);
  });

  const fireCommencedEventRef = useCurrentValueRef(() => {
    createAnalyticsEvent &&
      fireCommencedEvent(
        createAnalyticsEvent,
        fileAttributes,
        {
          overall: { durationSincePageStart: timeElapsedTillCommenced },
        },
        traceContext,
      );
    startUfoExperience(internalOccurrenceKey);
  });

  const fireAbortedEventRef = useCurrentValueRef(() => {
    // UFO won't abort if it's already in a final state (succeeded, failed, aborted, etc)
    abortUfoExperience(internalOccurrenceKey, {
      fileAttributes,
      fileStateFlags: fileStateFlagsRef?.current,
      ssrReliability: ssrReliabilityRef?.current,
    });
  });

  //----------------------------------------------------------------//
  //---------------------- Callbacks & Handlers  -------------------//
  //----------------------------------------------------------------//

  const onImageError = (newCardPreview?: CardPreview) => {
    if (newCardPreview) {
      const failedSSRObject: SSRStatusFail = {
        status: 'fail',
        ...extractErrorInfo(new ImageLoadError(newCardPreview.source)),
      };

      if (isSSRClientPreview(newCardPreview)) {
        ssrReliabilityRef.current.client = failedSSRObject;
      }

      /*
        If the cardPreview failed and it comes from server (global scope / ssrData), it means that we have reused it in client and the error counts for both: server & client.
      */

      if (isSSRDataPreview(newCardPreview)) {
        ssrReliabilityRef.current.server = failedSSRObject;
        ssrReliabilityRef.current.client = failedSSRObject;
      }
    }

    // If the dataURI has been replaced, we can dismiss this error
    if (newCardPreview?.dataURI !== cardPreview?.dataURI) {
      return;
    }
    const error = new ImageLoadError(newCardPreview?.source);
    const isLocal = newCardPreview && isLocalPreview(newCardPreview);
    const isSSR =
      newCardPreview &&
      (isSSRClientPreview(newCardPreview) || isSSRDataPreview(newCardPreview));

    if (isLocal || isSSR) {
      if (isLocal) {
        setIsBannedLocalPreview(true);
        fireNonCriticalErrorEventRef.current &&
          fireNonCriticalErrorEventRef.current(error);
      }
      const fileImageMode = imageResizeModeToFileImageMode(resizeMode);
      isFileIdentifier(identifier) &&
        removeCardPreviewFromCache(identifier.id, fileImageMode);
      setCardPreview(undefined);
    } else {
      if (!['complete', 'error', 'failed-processing'].includes(status)) {
        setStatus('error');
        setError(error);
      }
    }
  };

  const onImageLoad = (newCardPreview?: CardPreview) => {
    if (newCardPreview) {
      if (
        isSSRClientPreview(newCardPreview) &&
        ssrReliabilityRef.current.client.status === 'unknown'
      ) {
        ssrReliabilityRef.current.client = { status: 'success' };
      }

      /*
        If the image loads successfully and it comes from server (global scope / ssrData), it means that we have reused it in client and the success counts for both: server & client.
      */

      if (
        isSSRDataPreview(newCardPreview) &&
        ssrReliabilityRef.current.server.status === 'unknown'
      ) {
        ssrReliabilityRef.current.server = { status: 'success' };
        ssrReliabilityRef.current.client = { status: 'success' };
      }
    }

    // If the dataURI has been replaced, we can dismiss this callback
    if (newCardPreview?.dataURI !== cardPreview?.dataURI) {
      return;
    }

    setPreviewDidRender(true);
  };

  const onCardClick = (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => {
    if (onClick) {
      const cardEvent = {
        event,
        mediaItemDetails: metadata,
      };
      onClick(cardEvent, analyticsEvent);
    }
  };

  const onCardViewClick = (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => {
    onCardClick(event, analyticsEvent);

    if (!metadata) {
      return;
    }

    const isVideo = metadata && (metadata as FileDetails).mediaType === 'video';
    if (useInlinePlayer && isVideo && !!cardPreview) {
      setIsPlayingFile(true);
      setShouldAutoplay(true);
    } else if (shouldOpenMediaViewer) {
      setMediaViewerSelectedItem({
        id: identifier.id,
        mediaItemType: 'file',
        collectionName: identifier.collectionName,
        occurrenceKey: identifier.occurrenceKey,
      });
    }
  };

  //----------------------------------------------------------------//
  //---------------------- Helper Functions  -----------------------//
  //----------------------------------------------------------------//

  const fetchRemotePreviewRef = useCurrentValueRef(
    (identifier: FileIdentifier) => {
      return fetchAndCacheRemotePreview(
        mediaClient,
        identifier.id,
        dimensions ?? {},
        imageURLParams,
        getMediaBlobUrlAttrs(fileStateValue),
      );
    },
  );

  const resolvePreviewRef = useCurrentValueRef(
    async (identifier: FileIdentifier, fileState: FileState) => {
      const filePreview = isBannedLocalPreview
        ? undefined
        : fileState.status !== 'error' &&
          'mimeType' in fileState &&
          isMimeTypeSupportedByBrowser(fileState.mimeType)
        ? fileState.preview
        : undefined;

      const isRemotePreviewReady = isImageRepresentationReady(fileState);

      try {
        const mode = imageURLParams.mode;
        const cachedPreview = cardPreviewCache.get(identifier.id, mode);
        const dimensionsAreBigger = isBigger(
          cachedPreview?.dimensions,
          dimensions,
        );

        if (cachedPreview && !dimensionsAreBigger) {
          return cachedPreview;
        }

        let localPreview: CardPreview;
        try {
          if (filePreview) {
            let value;
            try {
              const resolvedFilePreview = await filePreview;
              value = resolvedFilePreview.value;
            } catch (e) {
              throw new LocalPreviewError(
                'local-preview-rejected',
                e instanceof Error ? e : undefined,
              );
            }
            if (typeof value === 'string') {
              localPreview = {
                dataURI: value,
                orientation: 1,
                source: 'local',
              };
            } else if (value instanceof Blob) {
              const { type } = value;
              const mediaType = getMediaTypeFromMimeType(type);
              switch (mediaType) {
                case 'image':
                  try {
                    const orientation = await getOrientation(value as File);
                    const dataURI = URL.createObjectURL(value);
                    localPreview = {
                      dataURI,
                      orientation,
                      source: 'local',
                    };
                  } catch (e) {
                    throw new LocalPreviewError(
                      'local-preview-image',
                      e instanceof Error ? e : undefined,
                    );
                  }
                  break;
                case 'video':
                  try {
                    const dataURI = await takeSnapshot(value);
                    localPreview = {
                      dataURI,
                      orientation: 1,
                      source: 'local',
                    };
                  } catch (e) {
                    throw new LocalPreviewError(
                      'local-preview-video',
                      e instanceof Error ? e : undefined,
                    );
                  }
                  break;
                default:
                  throw new LocalPreviewError('local-preview-unsupported');
              }
            } else {
              throw new LocalPreviewError('local-preview-unsupported');
            }

            const preview = { ...localPreview, dimensions };

            let source: CardPreview['source'];
            switch (preview.source) {
              case 'local':
                source = 'cache-local';
                break;
              case 'remote':
                source = 'cache-remote';
                break;
              case 'ssr-server':
                source = 'cache-ssr-server';
                break;
              case 'ssr-client':
                source = 'cache-ssr-client';
                break;
              default:
                source = preview.source;
            }
            // We want to embed some meta context into dataURI for Copy/Paste to work.
            const mediaBlobUrlAttrs = getMediaBlobUrlAttrs(fileStateValue);
            const dataURI = mediaBlobUrlAttrs
              ? addFileAttrsToUrl(preview.dataURI, mediaBlobUrlAttrs)
              : preview.dataURI;
            // We store new cardPreview into cache
            cardPreviewCache.set(identifier.id, mode, {
              ...preview,
              source,
              dataURI,
            });
            setCardPreview({ ...preview, dataURI });
            return;
          }
        } catch (e: any) {
          /**
           * We report the error if:
           * - local preview is supported and fails
           * - local preview is unsupported and remote preview is NOT READY
           *   i.e. the function was called for "no reason".
           * We DON'T report the error if:
           * - local preview is unsupported and remote preview IS READY
           *   i.e. local preview is available and not supported,
           *   but we are after the remote preview instead.
           */
          if (
            !isUnsupportedLocalPreviewError(e) ||
            (isUnsupportedLocalPreviewError(e) && !isRemotePreviewReady)
          ) {
            fireNonCriticalErrorEventRef.current &&
              fireNonCriticalErrorEventRef.current(e);
          }
          /**
           * No matter the reason why the local preview failed, we break the process
           * if there is no remote preview available
           */
          if (!isRemotePreviewReady) {
            throw e;
          }
        }
        if (!isRemotePreviewReady) {
          /**
           * We throw this in case this function has been called
           * without checking isRemotePreviewReady first.
           * If remote preview is not ready, the call to getCardPreviewFromBackend
           * will generate a console error due to a 404 code
           */
          throw new MediaCardError('remote-preview-not-ready');
        }

        const remotePreview = await fetchAndCacheRemotePreview(
          mediaClient,
          identifier.id,
          dimensions ?? {},
          imageURLParams,
          getMediaBlobUrlAttrs(fileStateValue),
          traceContext,
        );

        setCardPreview(remotePreview);
        return;
      } catch (e) {
        const wrappedError = ensureMediaCardError('preview-fetch', e as Error);
        //  If remote preview fails, we set status 'error'
        //  If local preview fails (i.e, no remote preview available),
        //  we can stay in the same status until there is a remote preview available
        //  If it's any other error we set status 'error'
        if (isLocalPreviewError(wrappedError)) {
          // This error should already been logged inside the getCardPreview. No need to log it here.
          setIsBannedLocalPreview(true);
        } else {
          if (!['complete', 'error', 'failed-processing'].includes(status)) {
            setStatus('error');
            setError(wrappedError);
          }
        }
      }
    },
  );

  //----------------------------------------------------------------//
  //------------ resolveUpfrontPreview useEffect -------------------//
  //----------------------------------------------------------------//
  const prevCardPreview = usePrevious(cardPreview);
  const dimensionsRef = useCurrentValueRef(dimensions);

  useEffect(() => {
    const resolveUpfrontPreview = async (identifier: FileIdentifier) => {
      // We block any possible future call to this method regardless of the outcome (success or fail)
      // If it fails, the normal preview fetch should occur after the file state is fetched anyways
      wasResolvedUpfrontPreviewRef.current = true;
      try {
        const requestedDimensions = { ...dimensions };
        const newCardPreview = await fetchRemotePreviewRef.current(identifier);
        const areValidRequestedDimensions = !isBigger(
          requestedDimensions,
          dimensionsRef.current,
        );

        // If there are new and bigger dimensions in the props, and the upfront preview is still resolving,
        // the fetched preview is no longer valid, and thus, we dismiss it
        if (areValidRequestedDimensions) {
          setCardPreview(newCardPreview);
        }
      } catch (e) {
        // NO need to log error. If this call fails, a refetch will happen after
      }
    };

    const hadSSRCardPreview =
      ssr === 'client' &&
      !!prevCardPreview &&
      isSSRClientPreview(prevCardPreview);

    if (
      (isCardVisible || hadSSRCardPreview) &&
      !cardPreview &&
      !wasResolvedUpfrontPreviewRef.current
    ) {
      resolveUpfrontPreview(identifier);
    }
  }, [
    cardPreview,
    dimensions,
    dimensionsRef,
    fetchRemotePreviewRef,
    identifier,
    isCardVisible,
    prevCardPreview,
    ssr,
  ]);

  //----------------------------------------------------------------//
  //------------------------ handle fireCopiedEvent   --------------//
  //----------------------------------------------------------------//

  useEffect(() => {
    const fireCopiedCardEvent = () => {
      cardElement &&
        createAnalyticsEvent &&
        fireCopiedEvent(createAnalyticsEvent, metadata.id, cardElement);
    };

    // we add a listener for each of the cards on the page
    // and then check if the triggered listener is from the card
    // that contains a div in current window.getSelection()
    // won't work in IE11
    getDocument()?.addEventListener('copy', fireCopiedCardEvent);

    return () => {
      getDocument()?.removeEventListener('copy', fireCopiedCardEvent);
    };
  }, [cardElement, createAnalyticsEvent, metadata.id]);

  //----------------------------------------------------------------//
  //----------------- update status flags --------------------------//
  //----------------------------------------------------------------//

  useEffect(() => {
    if (fileStateValue?.status === 'processing') {
      fileStateFlagsRef.current.wasStatusProcessing = true;
    } else if (fileStateValue?.status === 'uploading') {
      fileStateFlagsRef.current.wasStatusUploading = true;
    }
  }, [fileStateValue?.status]);

  //----------------------------------------------------------------//
  //---------------- fetch and resolve card preview ----------------//
  //----------------------------------------------------------------//

  const prevDimensions = usePrevious(dimensions);
  const prevIsCardVisible = usePrevious(isCardVisible);
  const prevStatus = usePrevious(status);

  useEffect(() => {
    if (prevStatus !== undefined && status !== prevStatus) {
      fireOperationalEventRef.current();
    }
  }, [fireOperationalEventRef, prevStatus, status]);

  useEffect(() => {
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

    if (turnedVisible) {
      fireCommencedEventRef.current();
    }

    if (
      cardPreview &&
      turnedVisible &&
      isSSRDataPreview(cardPreview) &&
      isBigger(ssrDataRef.current?.dimensions, dimensions)
    ) {
      // If dimensions from Server have changed and are bigger,
      // we need to refetch
      // refetchSRRPreview
      fetchRemotePreviewRef
        .current(identifier)
        .then(setCardPreview)
        .catch((e) => {
          const wrappedError = ensureMediaCardError(
            'remote-preview-fetch-ssr',
            e as Error,
            true,
          );
          fireNonCriticalErrorEventRef.current(wrappedError);
        });
    }

    if (
      fileStateValue &&
      shouldResolvePreview({
        status,
        fileState: fileStateValue,
        prevDimensions,
        dimensions,
        hasCardPreview: !!cardPreview,
        isBannedLocalPreview,
        wasResolvedUpfrontPreview: wasResolvedUpfrontPreviewRef.current,
      })
    ) {
      resolvePreviewRef.current(identifier, fileStateValue);
    }
    if (
      turnedVisible &&
      ssr &&
      !!cardPreview &&
      isSSRClientPreview(cardPreview)
    ) {
      // Since the SSR preview brings the token in the query params,
      // We need to fetch the remote preview to be able to cache it,
      fetchRemotePreviewRef.current(identifier).catch(() => {
        // No need to log this error.
        // If preview fails, it will be refetched later
        //TODO: test this catch
        // https://product-fabric.atlassian.net/browse/MEX-1071
      });
    }
  }, [
    cardPreview,
    dimensions,
    fetchRemotePreviewRef,
    fileStateValue,
    fireCommencedEventRef,
    fireNonCriticalErrorEventRef,
    identifier,
    isBannedLocalPreview,
    isCardVisible,
    prevDimensions,
    prevIsCardVisible,
    resolvePreviewRef,
    ssr,
    status,
  ]);

  //----------------------------------------------------------------//
  //----------------- set complete status --------------------------//
  //----------------------------------------------------------------//

  useEffect(() => {
    if (
      previewDidRender &&
      // We should't complete if status is uploading
      ['loading-preview', 'processing'].includes(status)
    ) {
      setStatus('complete');
      // TODO MEX-788: add test for "do not remove the card preview when unsubscribing".
      setIsBannedLocalPreview(false);
    }
  }, [previewDidRender, status]);

  //----------------------------------------------------------------//
  //----------------- set isPlayingFile state ----------------------//
  //----------------------------------------------------------------//

  useEffect(() => {
    const isVideo = fileAttributes.fileMediatype === 'video';

    const { mimeType } = getFileDetails(identifier, fileStateValue);
    const isVideoPlayable = videoIsPlayable(
      isBannedLocalPreview,
      fileStateValue,
      mimeType,
    );

    if (
      /**
       * We need to check that the card is visible before switching to inline player
       * in order to avoid race conditions of the ViewportDector being unmounted before
       * it is able to set isCardVisible to true.
       */
      isCardVisible &&
      isVideo &&
      !isPlayingFile &&
      disableOverlay &&
      useInlinePlayer &&
      isVideoPlayable
    ) {
      setIsPlayingFile(true);
    }
  }, [
    isCardVisible,
    disableOverlay,
    fileAttributes.fileMediatype,
    fileStateValue,
    identifier,
    isBannedLocalPreview,
    isPlayingFile,
    useInlinePlayer,
  ]);

  //----------------------------------------------------------------//
  //----------------- fireScreenEvent ------------------------------//
  //----------------------------------------------------------------//

  useEffect(() => {
    if (prevStatus !== undefined && status !== prevStatus) {
      if (
        status === 'complete' ||
        (fileAttributes.fileMediatype === 'video' &&
          !!cardPreview &&
          status === 'processing')
      ) {
        fireScreenEventRef.current();
      }
    }
  }, [status, prevStatus, fileAttributes, cardPreview, fireScreenEventRef]);

  //----------------------------------------------------------------//
  //----------------- abort UFO experience -------------------------//
  //----------------------------------------------------------------//

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      fireAbortedEventRef.current();
    };
  }, [fireAbortedEventRef]);

  //----------------------------------------------------------------//
  //------------------ Subscribe to file state ---------------------//
  //----------------------------------------------------------------//

  const updateFileStateRef = useCurrentValueRef(() => {
    if (fileState) {
      // do not update the card status if the status is final
      if (['complete', 'error', 'failed-processing'].includes(status)) {
        return;
      }

      if (fileState.status !== 'error') {
        const mediaType =
          'mediaType' in fileState ? fileState.mediaType : undefined;
        const isPreviewable =
          !!mediaType &&
          ['audio', 'video', 'image', 'doc'].indexOf(mediaType) > -1;
        const isPreviewableFileState = !!fileState.preview;
        const isSupportedLocalPreview =
          mediaType === 'image' || mediaType === 'video';
        const hasLocalPreview =
          !isBannedLocalPreview &&
          isPreviewableFileState &&
          isSupportedLocalPreview &&
          !!fileState.mimeType &&
          isMimeTypeSupportedByBrowser(fileState.mimeType);

        const hasRemotePreview = isImageRepresentationReady(fileState);
        const hasPreview = hasLocalPreview || hasRemotePreview;
        let newStatus: CardStatus;
        switch (fileState.status) {
          case 'uploading':
          case 'failed-processing':
          case 'processing':
            newStatus = fileState.status;
            break;
          case 'processed':
            if (!isPreviewable || !hasPreview) {
              newStatus = 'complete';
              break;
            }
            newStatus = 'loading-preview';
            break;
          default:
            newStatus = 'loading';
        }

        const newProgress =
          newStatus === 'uploading' && fileState.status === 'uploading'
            ? fileState.progress
            : 1;

        setStatus(newStatus);
        uploadProgressRef.current = newProgress;
      } else {
        const e = new MediaFileStateError(
          fileState.id,
          fileState.reason,
          fileState.message,
          fileState.details,
        );

        const errorReason =
          status === 'uploading' ? 'upload' : 'metadata-fetch';
        setError(new MediaCardError(errorReason, e));
        setStatus('error');
      }
    }
  });

  useEffect(() => {
    updateFileStateRef.current();
  }, [fileState, updateFileStateRef]);

  //----------------------------------------------------------------//
  //---------------------- Render Card Function --------------------//
  //----------------------------------------------------------------//

  const renderCard = (
    withCallbacks = true,
    cardStatusOverride?: CardStatus,
    izLazyOverride?: boolean,
  ) => {
    const { mediaItemType } = identifier;

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
      !!cardPreview,
      metadata.mediaType,
    );

    const card = (
      <CardViewV2
        status={cardStatusOverride || status}
        error={error}
        mediaItemType={mediaItemType}
        metadata={metadata}
        cardPreview={cardPreview}
        alt={alt}
        appearance={appearance}
        resizeMode={resizeMode}
        dimensions={dimensions}
        actions={computedActions}
        selectable={selectable}
        selected={selected}
        onClick={withCallbacks ? onCardViewClick : undefined}
        onMouseEnter={
          withCallbacks
            ? (event: React.MouseEvent<HTMLDivElement>) => {
                onMouseEnter?.({
                  event,
                  mediaItemDetails: metadata,
                });
              }
            : undefined
        }
        disableOverlay={disableOverlay}
        progress={uploadProgressRef.current}
        onDisplayImage={
          withCallbacks
            ? () => {
                const payloadPart = {
                  fileId: identifier.id,
                  isUserCollection:
                    identifier.collectionName === RECENTS_COLLECTION,
                };

                globalMediaEventEmitter.emit('media-viewed', {
                  viewingLevel: 'minimal',
                  ...payloadPart,
                });
              }
            : undefined
        }
        innerRef={setCardElement}
        testId={testId}
        featureFlags={featureFlags}
        titleBoxBgColor={titleBoxBgColor}
        titleBoxIcon={titleBoxIcon}
        onImageError={withCallbacks ? onImageError : undefined}
        onImageLoad={withCallbacks ? onImageLoad : undefined}
        nativeLazyLoad={nativeLazyLoad}
        forceSyncDisplay={forceSyncDisplay}
        mediaCardCursor={mediaCardCursor}
        shouldHideTooltip={shouldHideTooltip}
      />
    );

    return isLazyWithOverride ? (
      <ViewportDetector
        cardEl={cardElement}
        onVisible={() => {
          setIsCardVisible(true);
        }}
      >
        {card}
      </ViewportDetector>
    ) : (
      card
    );
  };

  //----------------------------------------------------------------//
  //-------------------------- RENDER ------------------------------//
  //----------------------------------------------------------------//

  const inlinePlayerFallback = renderCard(false, 'loading', false);
  const collectionName = identifier.collectionName || '';

  return (
    <>
      {isPlayingFile ? (
        <Suspense fallback={inlinePlayerFallback}>
          <InlinePlayerLazyV2
            dimensions={dimensions}
            originalDimensions={originalDimensions}
            identifier={identifier}
            autoplay={!!shouldAutoplay}
            onFullscreenChange={onFullscreenChange}
            onError={() => {
              setIsPlayingFile(false);
            }}
            onClick={onCardClick}
            selected={selected}
            ref={setCardElement}
            testId={testId}
            cardPreview={cardPreview}
          />
        </Suspense>
      ) : (
        renderCard()
      )}
      {mediaViewerSelectedItem
        ? ReactDOM.createPortal(
            <MediaViewer
              collectionName={collectionName}
              items={mediaViewerItems || []}
              mediaClientConfig={mediaClient.config}
              selectedItem={mediaViewerSelectedItem}
              onClose={() => {
                setMediaViewerSelectedItem(null);
              }}
              contextId={contextId}
              featureFlags={featureFlags}
            />,
            document.body,
          )
        : null}
      {ssr === 'server' && (
        <StoreSSRDataScript
          identifier={identifier}
          dataURI={cardPreview?.dataURI}
          dimensions={getRequestedDimensions({
            dimensions,
            element: cardElement,
          })}
          error={
            ssrReliabilityRef.current.server?.status === 'fail'
              ? ssrReliabilityRef.current.server
              : undefined
          }
        />
      )}
    </>
  );
};
