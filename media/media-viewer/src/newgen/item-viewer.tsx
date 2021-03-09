import React from 'react';
import {
  MediaClient,
  FileState,
  ProcessedFileState,
  UploadingFileState,
  ProcessingFileState,
  Identifier,
  isExternalImageIdentifier,
  isFileIdentifier,
} from '@atlaskit/media-client';
import { FormattedMessage } from 'react-intl';
import { messages, WithShowControlMethodProp } from '@atlaskit/media-ui';
import { isCodeViewerItem } from '@atlaskit/media-ui/codeViewer';
import { Outcome } from './domain';
import { ImageViewer } from './viewers/image';
import { VideoViewer } from './viewers/video';
import { DocViewer } from './viewers/doc';
import { CodeViewer } from './viewers/codeViewer';
import { Spinner } from './loading';
import { Subscription } from 'rxjs/Subscription';
import deepEqual from 'deep-equal';
import ErrorMessage from './errorMessage';
import { MediaViewerError, MediaViewerErrorReason } from './errors';
import { ErrorViewDownloadButton } from './download';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { createCommencedEvent } from './analytics/events/operational/commenced';
import { createLoadSucceededEvent } from './analytics/events/operational/loadSucceeded';
import { fireAnalytics } from './analytics';
import { AudioViewer } from './viewers/audio';
import { InteractiveImg } from './viewers/image/interactive-img';
import ArchiveViewerLoader from './viewers/archiveSidebar/archiveViewerLoader';
import { MediaFeatureFlags, getMediaFeatureFlag } from '@atlaskit/media-common';

export type Props = Readonly<{
  identifier: Identifier;
  mediaClient: MediaClient;
  onClose?: () => void;
  previewCount: number;
  contextId?: string;
  featureFlags?: MediaFeatureFlags;
}> &
  WithAnalyticsEventsProps &
  WithShowControlMethodProp;

export type State = {
  item: Outcome<FileState, Error>;
};

const initialState: State = {
  item: Outcome.pending(),
};
export class ItemViewerBase extends React.Component<Props, State> {
  state: State = initialState;

  private subscription?: Subscription;

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.needsReset(this.props, nextProps)) {
      this.release();
      this.setState(initialState);
    }
  }

  componentDidUpdate(oldProps: Props) {
    if (this.needsReset(oldProps, this.props)) {
      this.init(this.props);
    }
  }

  componentWillUnmount() {
    this.release();
  }

  componentDidMount() {
    this.init(this.props);
  }

  private onSuccess = () => {
    const { item } = this.state;
    item.whenSuccessful(fileState => {
      fireAnalytics(createLoadSucceededEvent(fileState), this.props);
    });
  };

  private onLoadFail = (errorReason: MediaViewerErrorReason) => (
    error: Error,
  ) => {
    this.setState({
      item: Outcome.failed(new MediaViewerError(errorReason, error)),
    });
  };

  private renderItem(
    fileState: ProcessedFileState | UploadingFileState | ProcessingFileState,
  ) {
    const {
      mediaClient,
      identifier,
      showControls,
      onClose,
      previewCount,
      contextId,
      featureFlags,
    } = this.props;
    const collectionName = isFileIdentifier(identifier)
      ? identifier.collectionName
      : undefined;
    const viewerProps = {
      mediaClient,
      item: fileState,
      collectionName,
      onClose,
      previewCount,
    };

    if (
      getMediaFeatureFlag('codeViewer', featureFlags) &&
      isCodeViewerItem(fileState.name)
    ) {
      return (
        <CodeViewer
          onSuccess={this.onSuccess}
          onError={this.onLoadFail('codeviewer-onerror')}
          {...viewerProps}
        />
      );
    }

    switch (fileState.mediaType) {
      case 'image':
        return (
          <ImageViewer
            onLoad={this.onSuccess}
            onError={this.onLoadFail('imageviewer-onerror')}
            contextId={contextId}
            {...viewerProps}
          />
        );
      case 'audio':
        return (
          <AudioViewer
            showControls={showControls}
            onCanPlay={this.onSuccess}
            onError={this.onLoadFail('audioviewer-onerror')}
            {...viewerProps}
          />
        );
      case 'video':
        return (
          <VideoViewer
            showControls={showControls}
            onCanPlay={this.onSuccess}
            onError={this.onLoadFail('videoviewer-onerror')}
            {...viewerProps}
          />
        );
      case 'doc':
        return (
          <DocViewer
            onSuccess={this.onSuccess}
            onError={this.onLoadFail('docviewer-onerror')}
            {...viewerProps}
          />
        );
      case 'archive':
        if (getMediaFeatureFlag('zipPreviews', featureFlags)) {
          return (
            <ArchiveViewerLoader
              onSuccess={this.onSuccess}
              onError={this.onLoadFail('archiveviewer-onerror')}
              {...viewerProps}
            />
          );
        }
    }

    return this.renderError(new MediaViewerError('unsupported'), fileState);
  }

  private renderError(error: Error, fileState?: FileState) {
    const { identifier } = this.props;
    if (fileState) {
      return (
        <ErrorMessage
          fileId={isFileIdentifier(identifier) ? identifier.id : 'undefined'}
          error={error}
          fileState={fileState}
        >
          <p>
            <FormattedMessage {...messages.try_downloading_file} />
          </p>
          {this.renderDownloadButton(fileState, error)}
        </ErrorMessage>
      );
    } else {
      return (
        <ErrorMessage
          fileId={isFileIdentifier(identifier) ? identifier.id : 'undefined'}
          error={error}
        />
      );
    }
  }

  render() {
    const { identifier } = this.props;
    const { item } = this.state;
    if (isExternalImageIdentifier(identifier)) {
      const { dataURI } = identifier;
      return <InteractiveImg src={dataURI} />;
    }

    return item.match({
      successful: fileState => {
        switch (fileState.status) {
          case 'processed':
          case 'uploading':
          case 'processing':
            return this.renderItem(fileState);
          case 'failed-processing':
            return this.renderError(
              new MediaViewerError('itemviewer-file-failed-processing-status'),
              fileState,
            );
          case 'error':
            return this.renderError(
              new MediaViewerError('itemviewer-file-error-status'),
              fileState,
            );
          default:
            return <Spinner />;
        }
      },
      pending: () => <Spinner />,
      failed: error => this.renderError(error, item.data),
    });
  }

  private renderDownloadButton(fileState: FileState, error: Error) {
    const { mediaClient, identifier } = this.props;
    const collectionName = isFileIdentifier(identifier)
      ? identifier.collectionName
      : undefined;
    return (
      <ErrorViewDownloadButton
        fileState={fileState}
        mediaClient={mediaClient}
        error={error}
        collectionName={collectionName}
      />
    );
  }

  private init(props: Props) {
    const { mediaClient, identifier } = props;

    if (isExternalImageIdentifier(identifier)) {
      return;
    }

    const { id } = identifier;
    fireAnalytics(createCommencedEvent(id), this.props);
    this.subscription = mediaClient.file
      .getFileState(id, {
        collectionName: identifier.collectionName,
      })
      .subscribe({
        next: file => {
          this.setState({
            item: Outcome.successful(file),
          });
        },
        error: (error: Error) => {
          this.setState({
            item: Outcome.failed(
              new MediaViewerError('imageviewer-onerror', error),
            ),
          });
        },
      });
  }

  // It's possible that a different identifier or mediaClient was passed.
  // We therefore need to reset Media Viewer.
  private needsReset(propsA: Props, propsB: Props) {
    return (
      !deepEqual(propsA.identifier, propsB.identifier) ||
      propsA.mediaClient !== propsB.mediaClient
    );
  }

  private release() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

export const ItemViewer = withAnalyticsEvents()(ItemViewerBase);
