import React from 'react';
import {
	getArtifactUrl,
	type MediaClient,
	type FileState,
	globalMediaEventEmitter,
	type Identifier,
	isFileIdentifier,
} from '@atlaskit/media-client';
import { CustomMediaPlayer, MediaPlayer, type WithShowControlMethodProp } from '@atlaskit/media-ui';
import { Outcome } from '../domain';
import { MediaViewerError } from '../errors';
import { Video, CustomVideoPlayerWrapper } from '../styleWrappers';
import { isIE } from '../utils/isIE';
import { type BaseState, BaseViewer } from './base-viewer';
import { getObjectUrlFromFileState } from '../utils/getObjectUrlFromFileState';
import { fg } from '@atlaskit/platform-feature-flags';
import { type MediaTraceContext } from '@atlaskit/media-common';

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

export class VideoViewer extends BaseViewer<string, Props, State> {
	protected get initialState() {
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

	private onError = () => {
		const { onError } = this.props;
		onError && onError(new MediaViewerError('videoviewer-playback'));
	};

	protected renderSuccessful(content: string): React.JSX.Element {
		const { item, showControls, previewCount, identifier } = this.props;
		const useCustomVideoPlayer = !isIE();
		const isAutoPlay = previewCount === 0;

		const hdAvailable = isHDAvailable(item);
		return useCustomVideoPlayer ? (
			<CustomVideoPlayerWrapper data-testid="media-viewer-video-content">
				{isFileIdentifier(identifier) && fg('platform_media_video_captions') ? (
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
						lastWatchTimeConfig={{
							contentId: item.id,
						}}
					/>
				)}
			</CustomVideoPlayerWrapper>
		) : (
			<Video autoPlay={isAutoPlay} controls src={content} />
		);
	}

	protected async init(): Promise<void> {
		const { mediaClient, item, collectionName } = this.props;

		try {
			let contentUrl: string | undefined;
			if (item.status === 'processed') {
				contentUrl = await mediaClient.file.getArtifactURL(
					item.artifacts,
					hdArtifact,
					collectionName,
				);

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
