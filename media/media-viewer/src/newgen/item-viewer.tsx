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
  ExternalImageIdentifier,
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
import { MediaViewerError } from './errors';
import { ErrorViewDownloadButton } from './download';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { createCommencedEvent } from './analytics/events/operational/commenced';
import { createLoadSucceededEvent } from './analytics/events/operational/loadSucceeded';
import { fireAnalytics, getFileAttributes } from './analytics';
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

export type FileItem = FileState | 'external-image';

export const isExternalImageItem = (
  fileItem: FileItem,
): fileItem is 'external-image' => fileItem === 'external-image';

export const isFileStateItem = (fileItem: FileItem): fileItem is FileState =>
  !isExternalImageItem(fileItem);

export type State = {
  item: Outcome<FileItem, MediaViewerError>;
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
    item.whenSuccessful((fileItem) => {
      if (isFileStateItem(fileItem)) {
        const fileAttributes = getFileAttributes(fileItem);
        fireAnalytics(createLoadSucceededEvent(fileAttributes), this.props);
      }
    });
  };

  private onLoadFail = (mediaViewerError: MediaViewerError) => {
    this.setState({
      item: Outcome.failed(mediaViewerError),
    });
  };

  private onExternalImgSuccess = () => {
    fireAnalytics(
      createLoadSucceededEvent({
        fileId: 'external-image',
      }),
      this.props,
    );
  };

  private onExternalImgError = () => {
    this.setState({
      item: Outcome.failed(
        new MediaViewerError('imageviewer-external-onerror'),
      ),
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
          onError={this.onLoadFail}
          {...viewerProps}
        />
      );
    }

    switch (fileState.mediaType) {
      case 'image':
        return (
          <ImageViewer
            onLoad={this.onSuccess}
            onError={this.onLoadFail}
            contextId={contextId}
            {...viewerProps}
          />
        );
      case 'audio':
        return (
          <AudioViewer
            showControls={showControls}
            onCanPlay={this.onSuccess}
            onError={this.onLoadFail}
            {...viewerProps}
          />
        );
      case 'video':
        return (
          <VideoViewer
            showControls={showControls}
            onCanPlay={this.onSuccess}
            onError={this.onLoadFail}
            {...viewerProps}
          />
        );
      case 'doc':
        return (
          <DocViewer
            onSuccess={this.onSuccess}
            onError={this.onLoadFail}
            {...viewerProps}
          />
        );
      case 'archive':
        if (getMediaFeatureFlag('zipPreviews', featureFlags)) {
          return (
            <ArchiveViewerLoader
              onSuccess={this.onSuccess}
              onError={this.onLoadFail}
              {...viewerProps}
            />
          );
        }
    }

    return this.renderError(new MediaViewerError('unsupported'), fileState);
  }

  private renderError(error: MediaViewerError, fileItem?: FileItem) {
    const { identifier } = this.props;
    if (fileItem) {
      let fileState: FileState;
      if (fileItem === 'external-image') {
        // external image error outcome
        fileState = { id: 'external-image', status: 'error' };
      } else {
        // FileState error outcome
        fileState = fileItem;
      }
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
    const { item } = this.state;
    const { identifier } = this.props;

    return item.match({
      successful: (fileItem) => {
        if (fileItem === 'external-image') {
          // render an external image
          const { dataURI } = identifier as ExternalImageIdentifier;
          return (
            <InteractiveImg
              src={dataURI}
              onLoad={this.onExternalImgSuccess}
              onError={this.onExternalImgError}
            />
          );
        } else {
          // render a FileState fetched through media-client
          const fileState = fileItem;
          switch (fileState.status) {
            case 'processed':
            case 'uploading':
            case 'processing':
              return this.renderItem(fileState);
            case 'failed-processing':
              return this.renderError(
                new MediaViewerError(
                  'itemviewer-file-failed-processing-status',
                ),
                fileState,
              );
            case 'error':
              return this.renderError(
                new MediaViewerError('itemviewer-file-error-status'),
                fileState,
              );
          }
        }
      },
      pending: () => <Spinner />,
      failed: (error) => this.renderError(error, item.data),
    });
  }

  private renderDownloadButton(fileState: FileState, error: MediaViewerError) {
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
      // external images do not need to talk to our backend,
      // so therefore no need for media-client subscriptions.
      // just set a successful outcome of type "external-image".
      this.setState({
        item: Outcome.successful('external-image'),
      });
      return;
    }

    const { id } = identifier;
    fireAnalytics(createCommencedEvent(id), this.props);
    this.subscription = mediaClient.file
      .getFileState(id, {
        collectionName: identifier.collectionName,
      })
      .subscribe({
        next: (file) => {
          this.setState({
            item: Outcome.successful(file),
          });
        },
        error: (error: Error) => {
          this.setState({
            item: Outcome.failed(
              new MediaViewerError('itemviewer-fetch-metadata', error),
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
