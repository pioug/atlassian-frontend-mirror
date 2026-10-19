import React from 'react';

import AudioIcon from '@atlaskit/icon/core/audio';
import IconTile from '@atlaskit/icon/icon-tile';
import { globalMediaEventEmitter } from '@atlaskit/media-client/global-media-event-emitter';
import type { MediaClient } from '@atlaskit/media-client/media-client';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';
import type { ProcessedFileState, FileState } from '@atlaskit/media-state/file-state';
import { CustomMediaPlayer } from '@atlaskit/media-ui/customMediaPlayer';
import { InsetViewerProvider } from '@atlaskit/media-ui/insetViewerProvider';
import type { WithShowControlMethodProp } from '@atlaskit/media-ui/types';

import { Outcome } from '../domain/outcome';
import { type WithInsetViewerFooterProps, withInsetViewerFooter } from '../insetViewerContext';
import { MediaViewerError } from '../MediaViewerError';
import {
	AudioPlayer,
	AudioCover,
	Audio,
	DefaultCoverWrapper,
	CustomAudioPlayerWrapper,
	CustomMediaPlayerWrapper,
} from '../styleWrappers';
import { getObjectUrlFromFileState } from '../utils/getObjectUrlFromFileState';
import { isIE } from '../utils/isIE';
import { type BaseState, BaseViewer } from './base-viewer';

export type Props = Readonly<
	{
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

const defaultCover = (
	<DefaultCoverWrapper>
		<AudioIcon label="cover" color="currentColor" />
	</DefaultCoverWrapper>
);

const getCoverUrl = (
	item: ProcessedFileState,
	mediaClient: MediaClient,
	collectionName?: string,
): Promise<string> =>
	mediaClient.getImageUrl(item.id, {
		collection: collectionName,
	});

class _AudioViewer extends BaseViewer<string, Props & WithInsetViewerFooterProps, State> {
	componentDidMount(): void {
		super.componentDidMount();
		if (this.props.isInsetViewer) {
			this.props.setHasPlayerControls?.(true);
		}
	}

	componentWillUnmount(): void {
		if (this.props.isInsetViewer) {
			this.props.setHasPlayerControls?.(false);
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

	private renderCover = () => {
		const { item } = this.props;
		const { coverUrl } = this.state;

		if (coverUrl && item.status !== 'error') {
			return <AudioCover src={coverUrl} alt={item.name} />;
		} else if (this.props.isInsetViewer) {
			return (
				<DefaultCoverWrapper>
					<IconTile icon={AudioIcon} label="cover" appearance="gray" size="xlarge" />
				</DefaultCoverWrapper>
			);
		} else {
			return defaultCover;
		}
	};

	private saveAudioElement = (audioElement?: HTMLElement | null) => {
		if (!audioElement) {
			return;
		}

		audioElement.setAttribute('controlsList', 'nodownload');
	};

	private onFirstPlay = () => {
		const { item } = this.props;
		globalMediaEventEmitter.emit('media-viewed', {
			fileId: item.id,
			viewingLevel: 'full',
		});
	};

	private onError = () => {
		const { onError } = this.props;
		onError && onError(new MediaViewerError('audioviewer-playback'));
	};

	protected renderSuccessful(src: string): React.JSX.Element {
		const { item, showControls, previewCount, onCanPlay, isInsetViewer, mediaFooterControls } =
			this.props;

		const useCustomAudioPlayer = !isIE();
		const isAutoPlay = previewCount === 0;
		if (useCustomAudioPlayer) {
			const player = (
				<AudioPlayer data-testid="media-viewer-audio-content">
					{this.renderCover()}
					<CustomAudioPlayerWrapper>
						<InsetViewerProvider isInsetViewer={isInsetViewer}>
							<CustomMediaPlayer
								type="audio"
								isAutoPlay={isAutoPlay}
								src={src}
								fileId={item.id}
								isShortcutEnabled={true}
								showControls={showControls}
								onCanPlay={onCanPlay}
								onFirstPlay={this.onFirstPlay}
								onError={this.onError}
								controlsPortalElement={mediaFooterControls}
							/>
						</InsetViewerProvider>
					</CustomAudioPlayerWrapper>
				</AudioPlayer>
			);
			// Same stage wrapper as the video, so audio fills the stage the same way.
			return isInsetViewer ? <CustomMediaPlayerWrapper>{player}</CustomMediaPlayerWrapper> : player;
		}
		return (
			<AudioPlayer>
				{this.renderCover()}
				<CustomAudioPlayerWrapper>
					<Audio
						autoPlay={isAutoPlay}
						controls
						ref={this.saveAudioElement}
						src={src}
						preload="metadata"
					/>
				</CustomAudioPlayerWrapper>
			</AudioPlayer>
		);
	}

	private loadCover = (coverUrl: string) => {
		return new Promise(async (resolve, reject) => {
			const img = new Image();

			img.src = coverUrl;
			img.onload = resolve;
			img.onerror = reject;
		});
	};

	private setCoverUrl = async () => {
		const { mediaClient, item, collectionName } = this.props;

		if (item.status !== 'processed') {
			return;
		}
		const coverUrl = await getCoverUrl(item, mediaClient, collectionName);

		try {
			await this.loadCover(coverUrl);
			this.safeSetState({ coverUrl });
		} catch (e) {}
	};

	protected async init(): Promise<void> {
		const { mediaClient, item, collectionName } = this.props;

		try {
			let audioUrl: string | undefined;

			if (item.status === 'processed') {
				audioUrl = await mediaClient.file.getArtifactURL(
					item.artifacts,
					'audio.mp3',
					collectionName,
				);

				if (!audioUrl) {
					throw new MediaViewerError('audioviewer-missing-artefact');
				}
			} else {
				audioUrl = await getObjectUrlFromFileState(item);
				if (!audioUrl) {
					this.safeSetState({
						content: Outcome.pending(),
					});
					return;
				}
			}
			this.setCoverUrl();
			this.safeSetState({
				content: Outcome.successful(audioUrl),
			});
		} catch (error) {
			this.safeSetState({
				content: Outcome.failed(
					new MediaViewerError('audioviewer-fetch-url', error instanceof Error ? error : undefined),
				),
			});
		}
	}
	protected release(): void {
		const { content } = this.state;
		if (!content.data) {
			return;
		}

		URL.revokeObjectURL(content.data);
	}
}

export const AudioViewer: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<Props> & React.RefAttributes<any>
> = withInsetViewerFooter(_AudioViewer);
