import React from 'react';
import { Component } from 'react';
import {
  MediaClient,
  FileIdentifier,
  FileState,
  MediaFileArtifacts,
  globalMediaEventEmitter,
} from '@atlaskit/media-client';
import { Subscription } from 'rxjs/Subscription';
import { CustomMediaPlayer, InactivityDetector } from '@atlaskit/media-ui';
import { InlinePlayerWrapper } from './styled';
import {
  CardDimensions,
  defaultImageCardDimensions,
  NumericalCardDimensions,
} from '..';
import { CardLoading } from '../utils/lightCards/cardLoading';

import {
  WithAnalyticsEventsProps,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

export const inlinePlayerClassName = 'media-card-inline-player';
export interface InlinePlayerOwnProps {
  identifier: FileIdentifier;
  mediaClient: MediaClient;
  dimensions?: CardDimensions;
  originalDimensions?: NumericalCardDimensions;
  selected?: boolean;
  onError?: (error: Error) => void;
  readonly onClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  testId?: string;
  //To Forward Ref
  readonly forwardRef?: React.Ref<HTMLDivElement>;
}

export type InlinePlayerProps = InlinePlayerOwnProps & WithAnalyticsEventsProps;

export interface InlinePlayerState {
  fileSrc?: string;
}

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

export class InlinePlayerBase extends Component<
  InlinePlayerProps,
  InlinePlayerState
> {
  subscription?: Subscription;
  state: InlinePlayerState = {};

  static defaultProps = {
    dimensions: defaultImageCardDimensions,
  };

  componentDidMount() {
    const { mediaClient, identifier } = this.props;
    const { id, collectionName } = identifier;

    this.revoke();
    this.unsubscribe();
    this.subscription = mediaClient.file
      .getFileState(id, { collectionName })
      .subscribe({
        next: async (fileState) => {
          const { fileSrc: existingFileSrc } = this.state;
          // we want to reuse the existing fileSrc to prevent re renders
          if (existingFileSrc) {
            return;
          }
          if (fileState.status !== 'error' && fileState.preview) {
            const { value } = await fileState.preview;

            if (value instanceof Blob && value.type.indexOf('video/') === 0) {
              const fileSrc = URL.createObjectURL(value);
              this.setFileSrc(fileSrc);
              return;
            }
          }

          if (
            fileState.status === 'processed' ||
            fileState.status === 'processing'
          ) {
            const artifactName = getPreferredVideoArtifact(fileState);
            const { artifacts } = fileState;
            if (!artifactName || !artifacts) {
              this.setBinaryURL();
              return;
            }

            try {
              const fileSrc = await mediaClient.file.getArtifactURL(
                artifacts,
                artifactName,
                collectionName,
              );

              this.setFileSrc(fileSrc);
            } catch (error) {
              const { onError } = this.props;

              if (onError) {
                onError(error);
              }
            }
          }
        },
      });
  }

  setFileSrc = (fileSrc: string) => {
    this.setState({ fileSrc });
  };

  // Tries to use the binary artifact to provide something to play while the video is still processing
  setBinaryURL = async () => {
    const { mediaClient, identifier, onError } = this.props;
    const { id, collectionName } = identifier;

    try {
      const fileSrc = await mediaClient.file.getFileBinaryURL(
        id,
        collectionName,
      );

      this.setFileSrc(fileSrc);
    } catch (error) {
      if (onError) {
        onError(error);
      }
    }
  };

  unsubscribe = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };

  revoke = () => {
    const { fileSrc } = this.state;
    if (fileSrc) {
      URL.revokeObjectURL(fileSrc);
    }
  };

  componentWillUnmount() {
    this.unsubscribe();
    this.revoke();
  }

  onDownloadClick = () => {
    const { mediaClient, identifier } = this.props;
    const { id, collectionName } = identifier;

    mediaClient.file.downloadBinary(id, undefined, collectionName);
  };

  onFirstPlay = () => {
    const { identifier } = this.props;
    globalMediaEventEmitter.emit('media-viewed', {
      fileId: identifier.id,
      viewingLevel: 'full',
    });
  };

  render() {
    const {
      onClick,
      dimensions,
      originalDimensions,
      selected,
      testId,
      identifier,
      forwardRef,
    } = this.props;
    const { fileSrc } = this.state;

    if (!fileSrc) {
      return <CardLoading testId={testId} dimensions={dimensions} />;
    }

    return (
      <InlinePlayerWrapper
        className={inlinePlayerClassName}
        data-testid={testId || 'media-card-inline-player'}
        selected={selected}
        onClick={onClick}
        innerRef={forwardRef || undefined}
        dimensions={dimensions}
      >
        <InactivityDetector>
          {(checkMouseMovement) => (
            <CustomMediaPlayer
              type="video"
              src={fileSrc}
              fileId={identifier.id}
              isAutoPlay
              isHDAvailable={false}
              onDownloadClick={this.onDownloadClick}
              onFirstPlay={this.onFirstPlay}
              lastWatchTimeConfig={{
                contentId: identifier.id,
              }}
              originalDimensions={originalDimensions}
              showControls={checkMouseMovement}
            />
          )}
        </InactivityDetector>
      </InlinePlayerWrapper>
    );
  }
}

const InlinePlayerForwardRef = React.forwardRef<
  HTMLDivElement,
  InlinePlayerProps
>((props, ref) => {
  return <InlinePlayerBase {...props} forwardRef={ref} />;
});

export const InlinePlayer = InlinePlayerForwardRef;
