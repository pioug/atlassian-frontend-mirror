import React, { useRef, useState, useEffect } from 'react';
import {
	type FileIdentifier,
	type FileState,
	type MediaFileArtifacts,
	globalMediaEventEmitter,
} from '@atlaskit/media-client';
import { type NumericalCardDimensions } from '@atlaskit/media-common';
import { CustomMediaPlayer, InactivityDetector } from '@atlaskit/media-ui';
import { type CardDimensions } from '../types';
import { defaultImageCardDimensions } from '../utils';
import { CardLoading } from '../utils/lightCards/cardLoading';

import { type WithAnalyticsEventsProps, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ProgressBar } from './ui/progressBar/progressBar';
import type { CardPreview } from '../types';
import { InlinePlayerWrapper } from './inlinePlayerWrapper';
import { useBreakpoint } from './useBreakpoint';
import { useFileState, useMediaClient } from '@atlaskit/media-client-react';

export interface InlinePlayerOwnProps {
	identifier: FileIdentifier;
	dimensions?: CardDimensions;
	originalDimensions?: NumericalCardDimensions;
	autoplay: boolean;
	selected?: boolean;
	onFullscreenChange?: (fullscreen: boolean) => void;
	onError?: (error: Error) => void;
	readonly onClick?: (
		event: React.MouseEvent<HTMLDivElement>,
		analyticsEvent?: UIAnalyticsEvent,
	) => void;
	testId?: string;
	readonly cardPreview?: CardPreview;
	//To Forward Ref
	readonly forwardRef?: React.Ref<HTMLDivElement>;
	readonly videoControlsWrapperRef?: React.Ref<HTMLDivElement>;
}

export type InlinePlayerProps = InlinePlayerOwnProps & WithAnalyticsEventsProps;

export const getPreferredVideoArtifact = (
	fileState: FileState,
): keyof MediaFileArtifacts | undefined => {
	if (fileState.status === 'processed' || fileState.status === 'processing') {
		const { artifacts } = fileState;
		if (!artifacts) {
			return undefined;
		}

		return artifacts['video_1280.mp4']
			? 'video_1280.mp4'
			: artifacts['video_640.mp4']
				? 'video_640.mp4'
				: undefined;
	}

	return undefined;
};

export const InlinePlayerBase = ({
	identifier,
	onError,
	onClick,
	dimensions = defaultImageCardDimensions,
	originalDimensions,
	selected,
	testId,
	forwardRef,
	autoplay,
	cardPreview,
	onFullscreenChange,
	videoControlsWrapperRef,
}: InlinePlayerProps) => {
	// === States ===
	const [fileSrc, setFileSrc] = useState<string>();
	const [isUploading, setIsUploading] = useState<boolean>();
	const [progress, setProgress] = useState<number>();

	// === Refs and Local Variables ===
	const divRef = useRef<HTMLDivElement>(null);
	const onErrorRef = useRef(onError);
	onErrorRef.current = onError;

	const { id, collectionName, occurrenceKey } = identifier;
	const breakpoint = useBreakpoint(dimensions?.width, divRef);
	const mediaClient = useMediaClient();
	const { fileState } = useFileState(id, { collectionName, occurrenceKey });

	useEffect(() => {
		const subscribeFileState = async (fileState: FileState) => {
			if (fileState.status === 'uploading') {
				setIsUploading(true);
				setProgress(fileState.progress);
			} else {
				setIsUploading(false);
			}

			// We reuse the existing fileSrc to prevent re renders, therefore we only perform fileSrc updates when there isn't any
			if (fileSrc) {
				return;
			}

			if (fileState.status !== 'error' && fileState.preview) {
				const { value } = await fileState.preview;

				if (value instanceof Blob && value.type.indexOf('video/') === 0) {
					const newFileSrc = URL.createObjectURL(value);
					setFileSrc(newFileSrc);
					return;
				}
			}
			if (fileState.status === 'processed' || fileState.status === 'processing') {
				const artifactName = getPreferredVideoArtifact(fileState);
				const { artifacts } = fileState;
				if (!artifactName || !artifacts) {
					// Tries to use the binary artifact to provide something to play while the video is still processing
					try {
						const newFileSrc = await mediaClient.file.getFileBinaryURL(id, collectionName);

						setFileSrc(newFileSrc);
					} catch (error) {
						if (onErrorRef.current && error instanceof Error) {
							onErrorRef.current(error);
						}
					}
					return;
				}

				try {
					const newFileSrc = await mediaClient.file.getArtifactURL(
						artifacts,
						artifactName,
						collectionName,
					);
					setFileSrc(newFileSrc);
				} catch (error) {
					if (onErrorRef.current && error instanceof Error) {
						onErrorRef.current(error);
					}
				}
			}
		};

		if (fileState) {
			subscribeFileState(fileState);
		}
	}, [fileState, collectionName, fileSrc, id, mediaClient]);

	useEffect(() => {
		return () => {
			fileSrc && URL.revokeObjectURL(fileSrc);
		};
	}, [fileSrc]);

	// === Render ===
	return fileSrc ? (
		<InlinePlayerWrapper
			testId={testId || 'media-card-inline-player'}
			selected={{ selected }}
			onClick={onClick}
			innerRef={forwardRef || undefined}
			dimensions={dimensions}
		>
			<InactivityDetector>
				{(checkMouseMovement) => (
					<CustomMediaPlayer
						type="video"
						src={fileSrc}
						onFullscreenChange={onFullscreenChange}
						fileId={id}
						isAutoPlay={autoplay}
						isHDAvailable={false}
						onDownloadClick={() => {
							mediaClient.file.downloadBinary(id, undefined, collectionName);
						}}
						onFirstPlay={() => {
							globalMediaEventEmitter.emit('media-viewed', {
								fileId: id,
								viewingLevel: 'full',
							});
						}}
						lastWatchTimeConfig={{
							contentId: id,
						}}
						originalDimensions={originalDimensions}
						showControls={checkMouseMovement}
						poster={cardPreview?.dataURI}
						videoControlsWrapperRef={videoControlsWrapperRef}
					/>
				)}
			</InactivityDetector>
			{isUploading && (
				<ProgressBar progress={progress} breakpoint={breakpoint} positionBottom showOnTop />
			)}
		</InlinePlayerWrapper>
	) : (
		<CardLoading testId={testId} dimensions={dimensions} interactionName="inline-player-loading" />
	);
};

const InlinePlayerForwardRef = React.forwardRef<HTMLDivElement, InlinePlayerProps>((props, ref) => {
	return <InlinePlayerBase {...props} forwardRef={ref} />;
});

export const InlinePlayer = InlinePlayerForwardRef;
