import React from 'react';

import { isFileIdentifier } from '@atlaskit/media-client';
import { getArtifactUrl } from '@atlaskit/media-client/artifacts';
import { globalMediaEventEmitter } from '@atlaskit/media-client/global-media-event-emitter';
import type { Identifier } from '@atlaskit/media-client/identifier';
import type { MediaClient } from '@atlaskit/media-client/media-client';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';
import type { FileState } from '@atlaskit/media-state/file-state';
import { CustomMediaPlayer } from '@atlaskit/media-ui/customMediaPlayer';
import { InsetViewerProvider } from '@atlaskit/media-ui/insetViewerProvider';
import { MediaPlayer } from '@atlaskit/media-ui/mediaPlayer';
import type { WithShowControlMethodProp } from '@atlaskit/media-ui/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { buildVideoErrorDiagnostics } from '../buildVideoErrorDiagnostics';
import { Outcome } from '../domain/outcome';
import { type WithInsetViewerFooterProps, withInsetViewerFooter } from '../insetViewerContext';
import { MediaViewerError } from '../MediaViewerError';
import { Video, CustomMediaPlayerWrapper } from '../styleWrappers';
import { getObjectUrlFromFileState } from '../utils/getObjectUrlFromFileState';
import { isIE } from '../utils/isIE';
import { type BaseState, BaseViewer } from './base-viewer';
import { InsetVideoFrame } from './inset-video-frame';

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

	private renderPlayer = (
		content: string,
		controlsPortalElement: HTMLElement | null | undefined,
		onVideoElementChange: ((video: HTMLVideoElement | null) => void) | undefined,
	) => {
		const { item, showControls, previewCount, identifier } = this.props;
		const isAutoPlay = previewCount === 0;
		const hdAvailable = isHDAvailable(item);

		return isFileIdentifier(identifier) && fg('platform_media_video_captions') ? (
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
				controlsPortalElement={controlsPortalElement}
				onVideoElementChange={onVideoElementChange}
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
				controlsPortalElement={controlsPortalElement}
				onVideoElementChange={onVideoElementChange}
				lastWatchTimeConfig={{
					contentId: item.id,
				}}
			/>
		);
	};

	protected renderSuccessful(content: string): React.JSX.Element {
		const { previewCount, isInsetViewer, mediaFooterControls } = this.props;
		const useCustomVideoPlayer = !isIE();
		const isAutoPlay = previewCount === 0;

		if (!useCustomVideoPlayer) {
			if (!isInsetViewer) {
				return <Video autoPlay={isAutoPlay} controls src={content} />;
			}
			return (
				<InsetVideoFrame
					renderPlayer={({ onVideoElementChange }) => (
						<Video
							autoPlay={isAutoPlay}
							controls
							src={content}
							onVideoElementChange={onVideoElementChange}
						/>
					)}
				/>
			);
		}

		if (isInsetViewer) {
			return (
				<InsetVideoFrame
					data-testid="media-viewer-video-content"
					renderPlayer={({ controlsPortalElement, onVideoElementChange }) =>
						this.renderPlayer(content, controlsPortalElement, onVideoElementChange)
					}
				/>
			);
		}

		return (
			<CustomMediaPlayerWrapper data-testid="media-viewer-video-content">
				<InsetViewerProvider isInsetViewer={isInsetViewer}>
					{this.renderPlayer(content, mediaFooterControls, undefined)}
				</InsetViewerProvider>
			</CustomMediaPlayerWrapper>
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

	protected release(): void {}
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
