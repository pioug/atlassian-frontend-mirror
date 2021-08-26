import React from 'react';
import {
  getArtifactUrl,
  MediaClient,
  FileState,
  globalMediaEventEmitter,
} from '@atlaskit/media-client';
import {
  CustomMediaPlayer,
  WithShowControlMethodProp,
} from '@atlaskit/media-ui';
import { Outcome } from '../domain';
import { MediaViewerError } from '../errors';
import { Video, CustomVideoPlayerWrapper } from '../styled';
import { isIE } from '../utils/isIE';
import { BaseState, BaseViewer } from './base-viewer';
import { getObjectUrlFromFileState } from '../utils/getObjectUrlFromFileState';

export type Props = Readonly<
  {
    item: FileState;
    mediaClient: MediaClient;
    collectionName?: string;
    previewCount: number;
    onCanPlay: () => void;
    onError: (error: MediaViewerError) => void;
  } & WithShowControlMethodProp
>;

export type State = BaseState<string> & {
  isHDActive: boolean;
  coverUrl?: string;
};

const sdArtifact = 'video_640.mp4';
const hdArtifact = 'video_1280.mp4';
const localStorageKeyName = 'mv_video_player_quality';

export class VideoViewer extends BaseViewer<string, Props, State> {
  protected get initialState() {
    const { item } = this.props;
    const preferredQuality = localStorage.getItem(localStorageKeyName);

    return {
      content: Outcome.pending<string, MediaViewerError>(),
      isHDActive: isHDAvailable(item) && preferredQuality !== 'sd',
    };
  }

  private onHDChange = () => {
    const isHDActive = !this.state.isHDActive;
    const preferredQuality = isHDActive ? 'hd' : 'sd';

    localStorage.setItem(localStorageKeyName, preferredQuality);
    this.setState({ isHDActive });
    this.init(isHDActive);
  };

  private onFirstPlay = () => {
    const { item, onCanPlay } = this.props;
    globalMediaEventEmitter.emit('media-viewed', {
      fileId: item.id,
      viewingLevel: 'full',
    });
    onCanPlay && onCanPlay();
  };

  private onError = () => {
    const { onError } = this.props;
    onError && onError(new MediaViewerError('videoviewer-playback'));
  };

  protected renderSuccessful(content: string) {
    const { isHDActive } = this.state;
    const { item, showControls, previewCount } = this.props;
    const useCustomVideoPlayer = !isIE();
    const isAutoPlay = previewCount === 0;
    return useCustomVideoPlayer ? (
      <CustomVideoPlayerWrapper data-testid="media-viewer-video-content">
        <CustomMediaPlayer
          type="video"
          isAutoPlay={isAutoPlay}
          onHDToggleClick={this.onHDChange}
          showControls={showControls}
          src={content}
          fileId={item.id}
          isHDActive={isHDActive}
          isHDAvailable={isHDAvailable(item)}
          isShortcutEnabled={true}
          onFirstPlay={this.onFirstPlay}
          onError={this.onError}
          lastWatchTimeConfig={{
            contentId: item.id,
          }}
        />
      </CustomVideoPlayerWrapper>
    ) : (
      <Video autoPlay={isAutoPlay} controls src={content} />
    );
  }

  protected async init(isHDActive: boolean = this.state.isHDActive) {
    const { mediaClient, item, collectionName } = this.props;

    try {
      let contentUrl: string | undefined;
      if (item.status === 'processed') {
        const preferHd = isHDActive && isHDAvailable(item);

        contentUrl = await mediaClient.file.getArtifactURL(
          item.artifacts,
          preferHd ? hdArtifact : sdArtifact,
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
          new MediaViewerError('videoviewer-fetch-url', error),
        ),
      });
    }
  }

  protected release() {}
}

function isHDAvailable(file: FileState): boolean {
  if (file.status !== 'processed') {
    return false;
  }
  return !!getArtifactUrl(file.artifacts, hdArtifact);
}
