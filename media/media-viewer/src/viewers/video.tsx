import React from 'react';

import {
	getArtifactUrl,
	type MediaClient,
	type FileState,
	globalMediaEventEmitter,
	type Identifier,
	isFileIdentifier,
} from '@atlaskit/media-client';
import { type MediaTraceContext } from '@atlaskit/media-common';
import { Camera } from '@atlaskit/media-ui/camera/camera';
import { CustomMediaPlayer } from '@atlaskit/media-ui/customMediaPlayer';
import { InsetViewerProvider } from '@atlaskit/media-ui/insetViewerProvider';
import { MediaPlayer } from '@atlaskit/media-ui/mediaPlayer';
import { Rectangle } from '@atlaskit/media-ui/rectangle';
import type { WithShowControlMethodProp } from '@atlaskit/media-ui/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { buildVideoErrorDiagnostics } from '../buildVideoErrorDiagnostics';
import { Outcome } from '../domain/outcome';
import { type WithInsetViewerFooterProps, withInsetViewerFooter } from '../insetViewerContext';
import { MediaViewerError } from '../MediaViewerError';
import { Video, CustomVideoPlayerWrapper, FittedVideoFrame } from '../styleWrappers';
import { insetFittedViewport } from '../utils/fit-viewport';
import { getObjectUrlFromFileState } from '../utils/getObjectUrlFromFileState';
import { isIE } from '../utils/isIE';
import { type BaseState, BaseViewer } from './base-viewer';

export type Props = Readonly<
	{
		identifier: Identifier;
		item: FileState;
		mediaClient: MediaClient;
		collectionName?: string;
		previewCount: number;
		onCanPlay: () => void;
		onError: (error: MediaViewerError) => void;
		traceContext: MediaTraceContext;
	} & WithShowControlMethodProp
>;

export type State = BaseState<string> & {
	coverUrl?: string;
};

const hdArtifact = 'video_1280.mp4';
const sdArtifact = 'video_640.mp4';

class _VideoViewer extends BaseViewer<string, Props & WithInsetViewerFooterProps, State> {
	private insetVideoFrame: HTMLDivElement | null = null;
	private insetVideo: HTMLVideoElement | null = null;
	private insetVideoResizeObserver: ResizeObserver | null = null;

	componentDidMount(): void {
		super.componentDidMount();
		if (this.props.isInsetViewer) {
			this.props.setHasVideoControls?.(true);
		}
	}

	componentWillUnmount(): void {
		if (this.props.isInsetViewer) {
			this.props.setHasVideoControls?.(false);
		}
		super.componentWillUnmount();
	}

	protected get initialState(): {
		content: Outcome<string, MediaViewerError>;
	} {
		return {
			content: Outcome.pending<string, MediaViewerError>(),
		};
	}

	private onFirstPlay = () => {
		const { item, onCanPlay } = this.props;
		globalMediaEventEmitter.emit('media-viewed', {
			fileId: item.id,
			viewingLevel: 'full',
		});
		onCanPlay && onCanPlay();
	};

	private onPlay = () => {
		if (fg('platform_media_resume_video_on_token_expiry')) {
			this.init();
		}
	};

	private onTimeChanged = () => {
		if (fg('platform_media_resume_video_on_token_expiry')) {
			this.init();
		}
	};

	private onError = (mediaError?: MediaError | null) => {
		const { onError, item } = this.props;
		let secondaryError: Error | undefined;
		try {
			secondaryError = buildVideoErrorDiagnostics(item, mediaError);
		} catch {
			// Diagnostics are best-effort: never let them mask the underlying playback failure.
			secondaryError = undefined;
		}
		onError && onError(new MediaViewerError('videoviewer-playback', secondaryError));
	};

	private updateInsetVideoSize = () => {
		const frame = this.insetVideoFrame;
		const wrapper = frame?.parentElement;
		const video = this.insetVideo;
		if (!wrapper || !frame || !video || video.videoWidth <= 0 || video.videoHeight <= 0) {
			return;
		}

		const viewport = insetFittedViewport(wrapper);
		if (viewport.width <= 0 || viewport.height <= 0) {
			return;
		}

		const camera = new Camera(viewport, new Rectangle(video.videoWidth, video.videoHeight));
		const nextSize = camera.scaledImg(camera.scaleToFit);
		frame.style.width = `${nextSize.width}px`;
		frame.style.height = `${nextSize.height}px`;
	};

	private unbindInsetVideoSize = () => {
		this.insetVideo?.removeEventListener('loadedmetadata', this.updateInsetVideoSize);
		this.insetVideoResizeObserver?.disconnect();
		this.insetVideoResizeObserver = null;
	};

	private bindInsetVideoSize = () => {
		const frame = this.insetVideoFrame;
		const wrapper = frame?.parentElement;
		const video = this.insetVideo;
		if (!wrapper || !frame || !video) {
			return;
		}

		video.addEventListener('loadedmetadata', this.updateInsetVideoSize);
		if (typeof ResizeObserver !== 'undefined') {
			this.insetVideoResizeObserver = new ResizeObserver(this.updateInsetVideoSize);
			this.insetVideoResizeObserver.observe(wrapper);
		}
		this.updateInsetVideoSize();
	};

	private setInsetVideo = (video: HTMLVideoElement | null) => {
		this.unbindInsetVideoSize();
		this.insetVideo = video;
		this.bindInsetVideoSize();
	};

	private setInsetVideoFrame = (frame: HTMLDivElement | null) => {
		this.unbindInsetVideoSize();
		this.insetVideoFrame = frame;
		this.bindInsetVideoSize();
	};

	protected renderSuccessful(content: string): React.JSX.Element {
		const { item, showControls, previewCount, identifier, isInsetViewer, mediaFooterControls } =
			this.props;
		const useCustomVideoPlayer = !isIE();
		const isAutoPlay = previewCount === 0;

		const hdAvailable = isHDAvailable(item);
		if (!useCustomVideoPlayer) {
			if (!isInsetViewer) {
				return <Video autoPlay={isAutoPlay} controls src={content} />;
			}
			return (
				<CustomVideoPlayerWrapper>
					<FittedVideoFrame ref={this.setInsetVideoFrame}>
						<Video
							autoPlay={isAutoPlay}
							controls
							src={content}
							onVideoElementChange={this.setInsetVideo}
						/>
					</FittedVideoFrame>
				</CustomVideoPlayerWrapper>
			);
		}

		const playerElement =
			isFileIdentifier(identifier) && fg('platform_media_video_captions') ? (
				<MediaPlayer
					identifier={identifier}
					type="video"
					isAutoPlay={isAutoPlay}
					showControls={showControls}
					src={content}
					isHDActive={hdAvailable}
					isHDAvailable={hdAvailable}
					isShortcutEnabled={true}
					onFirstPlay={this.onFirstPlay}
					onError={this.onError}
					onPlay={this.onPlay}
					onTimeChanged={this.onTimeChanged}
					controlsPortalElement={mediaFooterControls}
					onVideoElementChange={isInsetViewer ? this.setInsetVideo : undefined}
					lastWatchTimeConfig={{
						contentId: item.id,
					}}
				/>
			) : (
				<CustomMediaPlayer
					type="video"
					isAutoPlay={isAutoPlay}
					showControls={showControls}
					src={content}
					fileId={item.id}
					isHDActive={hdAvailable}
					isHDAvailable={hdAvailable}
					isShortcutEnabled={true}
					onFirstPlay={this.onFirstPlay}
					onError={this.onError}
					onPlay={this.onPlay}
					onTimeChanged={this.onTimeChanged}
					controlsPortalElement={mediaFooterControls}
					onVideoElementChange={isInsetViewer ? this.setInsetVideo : undefined}
					lastWatchTimeConfig={{
						contentId: item.id,
					}}
				/>
			);

		const player = (
			<InsetViewerProvider isInsetViewer={isInsetViewer}>{playerElement}</InsetViewerProvider>
		);

		return (
			<CustomVideoPlayerWrapper data-testid="media-viewer-video-content">
				{isInsetViewer ? (
					<FittedVideoFrame ref={this.setInsetVideoFrame}>{player}</FittedVideoFrame>
				) : (
					player
				)}
			</CustomVideoPlayerWrapper>
		);
	}

	protected async init(): Promise<void> {
		const { mediaClient, item, collectionName } = this.props;

		try {
			let contentUrl: string | undefined;
			if (item.status === 'processed') {
				if (fg('platform_media_video_sd_fallback')) {
					// Prefer the HD artifact, but fall back to the SD artifact when the media
					// processing pipeline did not produce an HD (video_1280.mp4) rendition — this
					// commonly happens for small / low-resolution sources that only get an SD
					// (video_640.mp4) rendition. Previously the viewer required the HD artifact and
					// threw `videoviewer-missing-artefact` synchronously, surfacing a generic
					// "Something went wrong" screen with no playback attempt for SD-only videos.
					const preferredArtifact = getArtifactUrl(item.artifacts, hdArtifact)
						? hdArtifact
						: sdArtifact;

					contentUrl = await mediaClient.file.getArtifactURL(
						item.artifacts,
						preferredArtifact,
						collectionName,
					);
				} else {
					contentUrl = await mediaClient.file.getArtifactURL(
						item.artifacts,
						hdArtifact,
						collectionName,
					);
				}

				if (!contentUrl) {
					throw new MediaViewerError(`videoviewer-missing-artefact`);
				}
			} else {
				contentUrl = await getObjectUrlFromFileState(item);

				if (!contentUrl) {
					this.setState({
						content: Outcome.pending(),
					});
					return;
				}
			}

			this.setState({
				content: Outcome.successful(contentUrl),
			});
		} catch (error) {
			this.setState({
				content: Outcome.failed(
					new MediaViewerError('videoviewer-fetch-url', error instanceof Error ? error : undefined),
				),
			});
		}
	}

	protected release(): void {
		this.unbindInsetVideoSize();
		this.insetVideo = null;
		this.insetVideoFrame = null;
	}
}

function isHDAvailable(file: FileState): boolean {
	if (file.status !== 'processed') {
		return false;
	}
	return !!getArtifactUrl(file.artifacts, hdArtifact);
}

export const VideoViewer: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<Props> & React.RefAttributes<any>
> = withInsetViewerFooter(_VideoViewer);
