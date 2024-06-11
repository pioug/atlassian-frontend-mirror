import { type UIAnalyticsEvent, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import {
	type FileDetails,
	type FileIdentifier,
	type FileState,
	globalMediaEventEmitter,
	type Identifier,
	type ImageResizeMode,
	type MediaBlobUrlAttrs,
	RECENTS_COLLECTION,
	imageResizeModeToFileImageMode,
	isProcessedFileState,
} from '@atlaskit/media-client';
import { MediaFileStateError, useFileState, useMediaClient } from '@atlaskit/media-client-react';
import {
	getRandomHex,
	isMimeTypeSupportedByBrowser,
	type MediaFeatureFlags,
	type MediaTraceContext,
	type NumericalCardDimensions,
	type SSR,
	isVideoMimeTypeSupportedByBrowser,
} from '@atlaskit/media-common';
import { MediaViewer } from '@atlaskit/media-viewer';
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { MediaCardError } from '../../errors';
import {
	type CardAppearance,
	type CardDimensions,
	type CardEventProps,
	type CardStatus,
	type FileStateFlags,
	type TitleBoxIcon,
} from '../../types';
import getDocument from '../../utils/document';
import { generateUniqueId } from '../../utils/generateUniqueId';
import { resolveCardPreviewDimensions } from '../../utils/getDataURIDimension';
import { getMediaCardCursor } from '../../utils/getMediaCardCursor';
import { getFileDetails } from '../../utils/metadata';
import {
	abortUfoExperience,
	completeUfoExperience,
	startUfoExperience,
} from '../../utils/ufoExperiences';
import { useCurrentValueRef } from '../../utils/useCurrentValueRef';
import { usePrevious } from '../../utils/usePrevious';
import { ViewportDetector } from '../../utils/viewportDetector';
import { getDefaultCardDimensions } from '../../utils/cardDimensions';
import {
	fireCommencedEvent,
	fireCopiedEvent,
	fireNonCriticalErrorEvent,
	fireOperationalEvent,
	fireScreenEvent,
} from '../cardAnalytics';
import { isSSRPreview } from '../getCardPreview';
import { CardViewV2 } from './cardViewV2';
import { CardViews } from './cardviews';
import { InlinePlayerLazyV2 } from './inlinePlayerLazyV2';
import { useFilePreview, type MediaFilePreview } from '@atlaskit/media-file-preview';
import { type CardAction } from '../actions';
import { performanceNow } from './performance';
import { useContext } from 'react';
import { DateOverrideContext } from '../../dateOverrideContext';
import { SvgView } from './svgView';

export interface FileCardProps extends CardEventProps {
	/** Overlay the media file. */
	readonly disableOverlay?: boolean;
	/** Resize the media to 'crop' | 'fit' | 'full-fit' | 'stretchy-fit'. */
	readonly resizeMode?: ImageResizeMode;
	/* Includes media features like caption, timestamp etc. */
	readonly featureFlags?: MediaFeatureFlags;
	/** Sets meida card appearance */
	readonly appearance?: CardAppearance;
	/** Custom media card dimension like width and height. */
	readonly dimensions?: CardDimensions;
	/** Original media card dimension like width and height. */
	readonly originalDimensions?: NumericalCardDimensions;
	/** Array of additional media card actions. */
	readonly actions?: Array<CardAction>;
	/** Enable media card selectable. */
	readonly selectable?: boolean;
	/** Renders media card as selected, if selected is true. */
	readonly selected?: boolean;
	/** Alternate text for an media card. */
	readonly alt?: string;
	/** ID for testing the media card. */
	readonly testId?: string;
	/** Sets the title box background color. */
	readonly titleBoxBgColor?: string;
	/** Sets the title box icon. */
	readonly titleBoxIcon?: TitleBoxIcon;
	/** Instance of file identifier. */
	readonly identifier: FileIdentifier;
	/** Lazy loads the media file. */
	readonly isLazy?: boolean;
	/** Uses the inline player for media file. */
	readonly useInlinePlayer?: boolean;
	/** Uses media MediaViewer to preview the media file. */
	readonly shouldOpenMediaViewer?: boolean;
	/** Media file list to display in Media Viewer. */
	readonly mediaViewerItems?: Identifier[];
	/** Retrieve auth based on a given context. */
	readonly contextId?: string;
	/** Enables the download button for media file. */
	readonly shouldEnableDownloadButton?: boolean;
	/** Server-Side-Rendering modes are "server" and "client" */
	readonly ssr?: SSR;
	/** Disable tooltip for the card */
	readonly shouldHideTooltip?: boolean;
}

export type FileCardBaseProps = FileCardProps & WithAnalyticsEventsProps;

const LoadedCardView = getBooleanFF('platform.media-experience.card-views-refactor_b91lr')
	? CardViews
	: CardViewV2;

export const FileCard = ({
	appearance = 'auto',
	resizeMode = 'crop',
	isLazy = true,
	disableOverlay = false,
	// Media Feature Flag defaults are defined in @atlaskit/media-common
	featureFlags = {},
	identifier,
	ssr,
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
	videoControlsWrapperRef,
}: FileCardBaseProps) => {
	//----------------------------------------------------------------//
	//------------ State, Refs & Initial Values ----------------------//
	//----------------------------------------------------------------//

	const mediaClient = useMediaClient();

	const [cardElement, setCardElement] = useState<HTMLDivElement | null>(null);

	const cardDimensions = dimensions || getDefaultCardDimensions(appearance);

	// Calculate the preview dimensions if card dimensions are "percentage" based
	const previewDimensions = useMemo(
		() =>
			// resolving dimensions is eventually an expensive operation if the dimensions are a percentage
			// thus needs to be memoized
			resolveCardPreviewDimensions({
				dimensions: cardDimensions,
				element: cardElement,
			}),
		[cardDimensions, cardElement],
	);

	const [isCardVisible, setIsCardVisible] = useState(!isLazy);

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

	const dateOverrides = useContext(DateOverrideContext);
	const overridenDate = dateOverrides?.[identifier.id];

	//----------------------------------------------------------------//
	//------------ State, Refs & Initial Values ----------------------//
	//----------------------------------------------------------------//

	const internalOccurrenceKey = useMemo(() => generateUniqueId(), []);
	const timeElapsedTillCommenced = useMemo(() => performanceNow(), []);

	const fileStateFlagsRef = useRef<FileStateFlags>({
		wasStatusUploading: false,
		wasStatusProcessing: false,
	});

	const mediaViewerButtonRef = useRef<HTMLButtonElement>(null);

	// Generate unique traceId for file
	const traceContext = useMemo<MediaTraceContext>(
		() => ({
			traceId: getRandomHex(8),
		}),
		[],
	);

	const [status, setStatus] = useState<CardStatus>('loading');

	const [isPlayingFile, setIsPlayingFile] = useState(false);
	const [shouldRenderSVG, setShouldRenderSVG] = useState(false);
	const [shouldAutoplay, setShouldAutoplay] = useState(false);

	const [previewDidRender, setPreviewDidRender] = useState(false);

	const mediaBlobUrlAttrs = useMemo<MediaBlobUrlAttrs | undefined>(() => {
		const { id, collectionName: collection } = identifier;
		const { mimeType, name, size } = getFileDetails(identifier, fileStateValue);
		return contextId
			? {
					id,
					collection,
					contextId,
					mimeType,
					name,
					size,
					...(originalDimensions || previewDimensions),
					alt,
				}
			: undefined;
	}, [alt, previewDimensions, contextId, fileStateValue, identifier, originalDimensions]);

	const {
		preview,
		status: previewStatus,
		error: previewError,
		nonCriticalError,
		ssrReliability,
		onImageError: onImageErrorBase,
		onImageLoad: onImageLoadBase,
		getSsrScriptProps,
	} = useFilePreview({
		mediaBlobUrlAttrs,
		resizeMode: imageResizeModeToFileImageMode(resizeMode),
		identifier,
		ssr,
		dimensions: previewDimensions,
		traceContext,
		skipRemote: !isCardVisible,
	});

	const [error, setError] = useState<MediaCardError | undefined>();

	// CXP-2723 TODO: TEMPORARY VARIABLES
	const finalError =
		error ||
		(previewError && previewError.primaryReason !== 'failed-processing' ? previewError : undefined);
	const finalStatus = finalError ? 'error' : status;

	const [mediaViewerSelectedItem, setMediaViewerSelectedItem] = useState<Identifier | null>(null);

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
				processingStatus: getProcessingStatusFromFileState(fileStateValue.status),
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
	}, [fileStateValue?.status, metadata.id, metadata.mediaType, metadata.mimeType, metadata.size]);

	const computedActions = useMemo(() => {
		if (finalStatus === 'failed-processing' || shouldEnableDownloadButton) {
			const downloadAction = {
				label: 'Download',
				icon: <DownloadIcon label="Download" />,
				handler: () =>
					mediaClient.file.downloadBinary(identifier.id, metadata.name, identifier.collectionName),
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
		finalStatus,
	]);

	//----------------------------------------------------------------//
	//---------------------- Analytics  ------------------------------//
	//----------------------------------------------------------------//

	const fireOperationalEventRef = useCurrentValueRef(() => {
		const timeElapsedTillEvent = performanceNow();
		const durationSinceCommenced = timeElapsedTillEvent - timeElapsedTillCommenced;

		const performanceAttributes = {
			overall: {
				durationSincePageStart: timeElapsedTillEvent,
				durationSinceCommenced,
			},
		};
		createAnalyticsEvent &&
			fireOperationalEvent(
				createAnalyticsEvent,
				finalStatus,
				fileAttributes,
				performanceAttributes,
				ssrReliability,
				finalError,
				traceContext,
				fileStateValue?.metadataTraceContext,
			);
		completeUfoExperience(
			internalOccurrenceKey,
			finalStatus,
			fileAttributes,
			fileStateFlagsRef.current,
			ssrReliability,
			finalError,
		);
	});

	const fireNonCriticalErrorEventRef = useCurrentValueRef((error: MediaCardError) => {
		createAnalyticsEvent &&
			fireNonCriticalErrorEvent(
				createAnalyticsEvent,
				finalStatus,
				fileAttributes,
				ssrReliability,
				error,
				traceContext,
				fileStateValue?.metadataTraceContext,
			);
	});

	useEffect(() => {
		if (nonCriticalError) {
			fireNonCriticalErrorEventRef.current(nonCriticalError);
		}
	}, [nonCriticalError, fireNonCriticalErrorEventRef]);

	const fireScreenEventRef = useCurrentValueRef(() => {
		createAnalyticsEvent && fireScreenEvent(createAnalyticsEvent, fileAttributes);
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
			ssrReliability: ssrReliability,
		});
	});

	//----------------------------------------------------------------//
	//--------------------- Focus on Close Viewer  -------------------//
	//----------------------------------------------------------------//

	const wasViewerPreviouslyOpen = usePrevious(mediaViewerSelectedItem);

	useEffect(() => {
		if (wasViewerPreviouslyOpen && !mediaViewerSelectedItem) {
			mediaViewerButtonRef.current?.focus();
		}
	}, [wasViewerPreviouslyOpen, mediaViewerSelectedItem]);

	//----------------------------------------------------------------//
	//---------------------- Callbacks & Handlers  -------------------//
	//----------------------------------------------------------------//

	const onImageError = (newCardPreview?: MediaFilePreview) => {
		onImageErrorBase(newCardPreview);
	};

	const onImageLoad = (newCardPreview?: MediaFilePreview) => {
		onImageLoadBase(newCardPreview);

		setPreviewDidRender(true);
	};

	const onCardClick = (
		event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
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
		event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
		analyticsEvent?: UIAnalyticsEvent,
	) => {
		onCardClick(event, analyticsEvent);

		if (!metadata) {
			return;
		}

		const isVideo = metadata.mediaType === 'video';

		const isBrowserSupported = metadata.mimeType && isMimeTypeSupportedByBrowser(metadata.mimeType);

		// TODO: this should be handled by Inline Player
		const isPlayable =
			!!fileState &&
			(fileState.status === 'processed' ||
				(isBrowserSupported && ['processing', 'uploading'].includes(fileState.status)));

		if (useInlinePlayer && isVideo && isPlayable && finalStatus !== 'error') {
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

	const prevStatus = usePrevious(finalStatus);
	const prevIsCardVisible = usePrevious(isCardVisible);

	useEffect(() => {
		if (prevStatus !== undefined && finalStatus !== prevStatus) {
			fireOperationalEventRef.current();
		}
	}, [fireOperationalEventRef, prevStatus, finalStatus]);

	useEffect(() => {
		const turnedVisible = !prevIsCardVisible && isCardVisible;

		if (turnedVisible) {
			fireCommencedEventRef.current();
		}
	}, [fireCommencedEventRef, isCardVisible, prevIsCardVisible]);

	//----------------------------------------------------------------//
	//----------------- set complete status --------------------------//
	//----------------------------------------------------------------//

	useEffect(() => {
		if (
			previewDidRender &&
			// We should't complete if status is uploading
			['loading-preview', 'processing'].includes(finalStatus)
		) {
			setStatus('complete');
			// TODO MEX-788: add test for "do not remove the card preview when unsubscribing".
		}
	}, [previewDidRender, finalStatus]);

	//----------------------------------------------------------------//
	//----------------- set isPlayingFile state ----------------------//
	//----------------------------------------------------------------//

	useEffect(() => {
		const isVideo = fileAttributes.fileMediatype === 'video';

		const { mimeType } = getFileDetails(identifier, fileStateValue);
		const isVideoPlayable =
			(mimeType && isVideoMimeTypeSupportedByBrowser(mimeType)) ||
			(fileStateValue && isProcessedFileState(fileStateValue));

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
			isVideoPlayable &&
			finalStatus !== 'error'
		) {
			setIsPlayingFile(true);
		}
	}, [
		isCardVisible,
		disableOverlay,
		fileAttributes.fileMediatype,
		fileStateValue,
		identifier,
		isPlayingFile,
		finalStatus,
		useInlinePlayer,
	]);

	//----------------------------------------------------------------//
	// Switch to SVG
	//----------------------------------------------------------------//

	useEffect(() => {
		if (
			getBooleanFF('platform.media-card-svg-rendering_6tdbv') &&
			/**
			 * We need to check that the card is visible before switching to SVG
			 * in order to avoid race conditions of the ViewportDector being unmounted before
			 * it is able to set isCardVisible to true.
			 */
			isCardVisible &&
			metadata.mimeType === 'image/svg+xml' &&
			disableOverlay // SVG won't be supported when overlay is on
		) {
			setShouldRenderSVG(true);
		}
	}, [isCardVisible, disableOverlay, metadata]);

	//----------------------------------------------------------------//
	//----------------- fireScreenEvent ------------------------------//
	//----------------------------------------------------------------//

	useEffect(() => {
		if (prevStatus !== undefined && finalStatus !== prevStatus) {
			if (
				finalStatus === 'complete' ||
				(fileAttributes.fileMediatype === 'video' && !!preview && finalStatus === 'processing')
			) {
				fireScreenEventRef.current();
			}
		}
	}, [finalStatus, prevStatus, fileAttributes, preview, fireScreenEventRef]);

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
			if (['complete', 'error', 'failed-processing'].includes(finalStatus)) {
				return;
			}

			if (fileState.status !== 'error') {
				let newStatus: CardStatus;
				switch (fileState.status) {
					case 'uploading':
					case 'failed-processing':
					case 'processing':
						newStatus = fileState.status;
						break;
					case 'processed':
						// Set complete if processing is done and there is no preview
						if (!preview && previewStatus === 'complete') {
							newStatus = 'complete';
							break;
						}
						newStatus = 'loading-preview';
						break;
					default:
						newStatus = 'loading';
				}

				const newProgress =
					newStatus === 'uploading' && fileState.status === 'uploading' ? fileState.progress : 1;

				setStatus(newStatus);
				uploadProgressRef.current = newProgress;
			} else {
				const e = new MediaFileStateError(
					fileState.id,
					fileState.reason,
					fileState.message,
					fileState.details,
				);

				const errorReason = finalStatus === 'uploading' ? 'upload' : 'metadata-fetch';
				setError(new MediaCardError(errorReason, e));
				setStatus('error');
			}
		}
	});

	useEffect(() => {
		updateFileStateRef.current();
	}, [fileState, preview, previewStatus, updateFileStateRef]);

	//----------------------------------------------------------------//
	// Shared Card View & SVG View resources
	//----------------------------------------------------------------//

	const mediaCardCursor = getMediaCardCursor(
		!!useInlinePlayer,
		!!shouldOpenMediaViewer,
		finalStatus === 'error' || finalStatus === 'failed-processing',
		!!preview,
		metadata.mediaType,
	);

	const onImageMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
		onMouseEnter?.({
			event,
			mediaItemDetails: metadata,
		});
	};

	//----------------------------------------------------------------//
	//---------------------- Render Card Function --------------------//
	//----------------------------------------------------------------//

	const renderCard = (
		withCallbacks = true,
		cardStatusOverride?: CardStatus,
		izLazyOverride?: boolean,
	) => {
		const { mediaItemType } = identifier;

		const isLazyWithOverride = izLazyOverride === undefined ? isLazy : izLazyOverride;

		// We should natively lazy load an SSR preview when card is not visible,
		// otherwise we'll fire the metadata fetch from outside the viewport
		// Side note: We should not lazy load if the cardPreview is available from local cache,
		// in order to avoid flickers during re-mount of the component
		// CXP-2723 TODO: Create test cases for the above scenarios
		const nativeLazyLoad = isLazyWithOverride && !isCardVisible && preview && isSSRPreview(preview);
		// Force Media Image to always display img for SSR
		const forceSyncDisplay = !!ssr;

		const card = (
			<LoadedCardView
				status={cardStatusOverride || finalStatus}
				error={finalError}
				mediaItemType={mediaItemType}
				metadata={metadata}
				cardPreview={preview}
				alt={alt}
				resizeMode={resizeMode}
				dimensions={cardDimensions}
				actions={computedActions}
				selectable={selectable}
				selected={selected}
				shouldOpenMediaViewer={shouldOpenMediaViewer}
				openMediaViewerButtonRef={mediaViewerButtonRef}
				onClick={withCallbacks ? onCardViewClick : undefined}
				onMouseEnter={withCallbacks ? onImageMouseEnter : undefined}
				disableOverlay={disableOverlay}
				progress={uploadProgressRef.current}
				onDisplayImage={
					withCallbacks
						? () => {
								const payloadPart = {
									fileId: identifier.id,
									isUserCollection: identifier.collectionName === RECENTS_COLLECTION,
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
				titleBoxBgColor={titleBoxBgColor}
				titleBoxIcon={titleBoxIcon}
				onImageError={withCallbacks ? onImageError : undefined}
				onImageLoad={withCallbacks ? onImageLoad : undefined}
				nativeLazyLoad={nativeLazyLoad}
				forceSyncDisplay={forceSyncDisplay}
				mediaCardCursor={mediaCardCursor}
				shouldHideTooltip={shouldHideTooltip}
				overriddenCreationDate={overridenDate}
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
						dimensions={cardDimensions}
						originalDimensions={originalDimensions}
						identifier={identifier}
						autoplay={!!shouldAutoplay}
						onFullscreenChange={onFullscreenChange}
						onError={(e) => {
							setError(new MediaCardError('error-file-state', e));
							setStatus('error');
							setIsPlayingFile(false);
						}}
						onClick={onCardClick}
						selected={selected}
						ref={setCardElement}
						testId={testId}
						cardPreview={preview}
						videoControlsWrapperRef={videoControlsWrapperRef}
					/>
				</Suspense>
			) : shouldRenderSVG ? (
				<SvgView
					testId={testId}
					identifier={identifier}
					status={finalStatus}
					fileName={metadata.name}
					cardPreview={preview}
					alt={alt}
					resizeMode={resizeMode}
					dimensions={cardDimensions}
					selected={selected}
					onClick={onCardViewClick}
					onMouseEnter={onImageMouseEnter}
					progress={uploadProgressRef.current}
					onImageError={onImageError}
					onImageLoad={onImageLoad}
					mediaCardCursor={mediaCardCursor}
					shouldOpenMediaViewer={shouldOpenMediaViewer}
					openMediaViewerButtonRef={mediaViewerButtonRef}
				/>
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
			{/* Print the SSR result to be used during hydration */}
			{getSsrScriptProps && <script {...getSsrScriptProps()} />}
		</>
	);
};
