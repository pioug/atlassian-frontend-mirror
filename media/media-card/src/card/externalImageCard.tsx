import { useAnalyticsEvents, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
	type ExternalImageIdentifier,
	type FileDetails,
	type Identifier,
	type MediaClient,
	globalMediaEventEmitter,
} from '@atlaskit/media-client';
import {
	type FileAttributes,
	type MediaTraceContext,
	getRandomTelemetryId,
} from '@atlaskit/media-common';
import { MediaViewer } from '@atlaskit/media-viewer';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { ImageLoadError, type MediaCardError } from '../errors';
import {
	type CardEventProps,
	type CardPreview,
	type FileStateFlags,
	type SharedCardProps,
} from '../types';
import { type SSRStatus } from '../utils/analytics';
import { generateUniqueId } from '../utils/generateUniqueId';
import { getMediaCardCursor } from '../utils/getMediaCardCursor';
import {
	abortUfoExperience,
	completeUfoExperience,
	startUfoExperience,
	shouldPerformanceBeSampled,
} from '../utils/ufoExperiences';
import { useCurrentValueRef } from '../utils/useCurrentValueRef';
import { getDefaultCardDimensions } from '../utils/cardDimensions';
import { usePrevious } from '../utils/usePrevious';
import { fireOperationalEvent } from './cardAnalytics';
import { CardView } from './cardView';
import { performanceNow } from './performance';

type ExternalImageCardStatus = 'loading-preview' | 'complete' | 'error';

export interface ExternalImageCardProps extends SharedCardProps, CardEventProps {
	// Instance of MediaClient.
	readonly mediaClient: MediaClient;
	// Instance of identifier.
	readonly identifier: ExternalImageIdentifier;
	// Uses media MediaViewer to preview the media file.
	readonly shouldOpenMediaViewer?: boolean;
	// Media file list to display in Media Viewer.
	readonly mediaViewerItems?: Identifier[];
	// Retrieve auth based on a given context.
	readonly contextId?: string;
	// Disable tooltip for the card
	readonly shouldHideTooltip?: boolean;
}

export const ExternalImageCard = ({
	mediaClient,
	appearance = 'auto',
	resizeMode = 'crop',
	disableOverlay = false,
	// Media Feature Flag defaults are defined in @atlaskit/media-common
	featureFlags = {},
	identifier,
	dimensions,
	contextId,
	alt,
	actions,
	shouldOpenMediaViewer,
	selectable,
	selected,
	testId,
	titleBoxBgColor,
	titleBoxIcon,
	shouldHideTooltip,
	mediaViewerItems,
	onClick,
	onMouseEnter,
}: ExternalImageCardProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const cardDimensions = dimensions || getDefaultCardDimensions(appearance);
	const internalOccurrenceKey = useMemo(() => generateUniqueId(), []);
	const timeElapsedTillCommenced = useMemo(() => performanceNow(), []);

	// Generate unique traceId for file
	const traceContext = useMemo<MediaTraceContext>(
		() => ({
			traceId: getRandomTelemetryId(),
		}),
		[],
	);

	const fileStateFlagsRef = useRef<FileStateFlags>({
		wasStatusUploading: false,
		wasStatusProcessing: false,
	});

	const startUfoExperienceRef = useCurrentValueRef(() => {
		if (shouldSendPerformanceEventRef.current) {
			startUfoExperience(internalOccurrenceKey);
		}
	});

	const [status, setStatus] = useState<ExternalImageCardStatus>('loading-preview');

	const cardPreview = useMemo(
		() => ({
			dataURI: identifier.dataURI,
			orientation: 1,
			source: 'external' as const,
		}),
		[identifier.dataURI],
	);

	const metadata: FileDetails = {
		id: identifier.mediaItemType,
		name: identifier.name || identifier.dataURI,
		mediaType: 'image',
	};

	const fileAttributes: FileAttributes = {
		fileMediatype: 'image',
		fileId: metadata.id,
	};

	// for analytics
	const ssrReliability: SSRStatus = {
		server: { status: 'unknown' },
		client: { status: 'unknown' },
	};

	const [previewDidRender, setPreviewDidRender] = useState(false);
	const [error, setError] = useState<MediaCardError | undefined>();

	const [mediaViewerSelectedItem, setMediaViewerSelectedItem] = useState<Identifier | null>(null);

	const shouldSendPerformanceEventRef = useRef(shouldPerformanceBeSampled());

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
				status,
				fileAttributes,
				performanceAttributes,
				ssrReliability,
				error,
				traceContext,
				undefined,
			);
		shouldSendPerformanceEventRef.current &&
			completeUfoExperience(
				internalOccurrenceKey,
				status,
				fileAttributes,
				fileStateFlagsRef.current,
				ssrReliability,
				error,
			);
	});

	const fireAbortedEventRef = useCurrentValueRef(() => {
		// UFO won't abort if it's already in a final state (succeeded, failed, aborted, etc)
		if (shouldSendPerformanceEventRef.current) {
			abortUfoExperience(internalOccurrenceKey, {
				fileAttributes,
				fileStateFlags: fileStateFlagsRef?.current,
				ssrReliability: ssrReliability,
			});
		}
	});

	//----------------------------------------------------------------//
	//------------------------ useEffects ----------------------------//
	//----------------------------------------------------------------//

	useEffect(() => {
		startUfoExperienceRef.current();
	}, [startUfoExperienceRef]);

	const prevStatus = usePrevious(status);

	useEffect(() => {
		if (prevStatus !== undefined && status !== prevStatus) {
			fireOperationalEventRef.current();
		}
	}, [fireOperationalEventRef, prevStatus, status]);

	useEffect(() => {
		if (previewDidRender && status === 'loading-preview') {
			setStatus('complete');
		}
	}, [previewDidRender, status]);

	useEffect(() => {
		return () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			fireAbortedEventRef.current();
		};
	}, [fireAbortedEventRef]);

	//----------------------------------------------------------------//
	//---------------------- Render Functions ------------------------//
	//----------------------------------------------------------------//

	const renderMediaViewer = () => {
		if (!mediaViewerSelectedItem) {
			return;
		}

		return ReactDOM.createPortal(
			<MediaViewer
				collectionName={''}
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
		);
	};

	//----------------------------------------------------------------//
	//-------------------------- RENDER ------------------------------//
	//----------------------------------------------------------------//

	const mediaCardCursor = getMediaCardCursor(
		false,
		!!shouldOpenMediaViewer,
		status === 'error',
		!!cardPreview,
		metadata.mediaType,
	);

	return (
		<>
			<CardView
				identifier={identifier}
				status={status}
				error={error}
				mediaItemType={identifier.mediaItemType}
				metadata={metadata}
				cardPreview={cardPreview}
				alt={alt}
				resizeMode={resizeMode}
				dimensions={cardDimensions}
				actions={actions}
				selectable={selectable}
				selected={selected}
				onClick={(
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

					if (shouldOpenMediaViewer) {
						setMediaViewerSelectedItem({
							mediaItemType: 'external-image',
							dataURI: identifier.dataURI,
							name: identifier.name,
						});
					}
				}}
				onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => {
					onMouseEnter?.({
						event,
						mediaItemDetails: metadata,
					});
				}}
				disableOverlay={disableOverlay}
				onDisplayImage={() => {
					const payloadPart = {
						fileId: identifier.dataURI,
						isUserCollection: false,
					};

					globalMediaEventEmitter.emit('media-viewed', {
						viewingLevel: 'minimal',
						...payloadPart,
					});
				}}
				testId={testId}
				titleBoxBgColor={titleBoxBgColor}
				titleBoxIcon={titleBoxIcon}
				onImageError={(newCardPreview?: CardPreview) => {
					// If the dataURI has been replaced, we can dismiss this error
					if (newCardPreview?.dataURI !== cardPreview?.dataURI) {
						return;
					}
					const error = new ImageLoadError(newCardPreview?.source);
					setStatus('error');
					setError(error);
				}}
				onImageLoad={(newCardPreview?: CardPreview) => {
					// If the dataURI has been replaced, we can dismiss this callback
					if (newCardPreview?.dataURI !== cardPreview?.dataURI) {
						return;
					}
					setPreviewDidRender(true);
				}}
				mediaCardCursor={mediaCardCursor}
				shouldHideTooltip={shouldHideTooltip}
			/>
			{mediaViewerSelectedItem ? renderMediaViewer() : null}
		</>
	);
};
