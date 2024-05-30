import React, { useCallback, useEffect, useState, useRef } from 'react';
import Loadable from 'react-loadable';
import {
  type FileState,
  type Identifier,
  isExternalImageIdentifier,
  isFileIdentifier,
  type ExternalImageIdentifier,
  type NonErrorFileState,
} from '@atlaskit/media-client';
import { FormattedMessage } from 'react-intl-next';
import { messages, type WithShowControlMethodProp } from '@atlaskit/media-ui';
import { isCodeViewerItem } from '@atlaskit/media-ui/codeViewer';
import {
  useFileState,
  useMediaClient,
  MediaFileStateError,
} from '@atlaskit/media-client-react';
import { Outcome } from '../domain';
import { Spinner } from '../loading';
import ErrorMessage from '../errorMessage';
import { MediaViewerError } from '../errors';
import { ErrorViewDownloadButton } from '../download';
import {
  withAnalyticsEvents,
  type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { createCommencedEvent } from '../analytics/events/operational/commenced';
import { createLoadSucceededEvent } from '../analytics/events/operational/loadSucceeded';
import { fireAnalytics, getFileAttributes } from '../analytics';
import { InteractiveImg } from '../viewers/image/interactive-img';
import ArchiveViewerLoader from '../viewers/archiveSidebar/archiveViewerLoader';
import {
  getRandomHex,
  type MediaFeatureFlags,
  type MediaTraceContext,
} from '@atlaskit/media-common';
import type { ImageViewerProps } from '../viewers/image';
import type { Props as VideoViewerProps } from '../viewers/video';
import type { Props as AudioViewerProps } from '../viewers/audio';
import type { Props as DocViewerProps } from '../viewers/doc';
import type { Props as CodeViewerProps } from '../viewers/codeViewer';
import {
  startMediaFileUfoExperience,
  succeedMediaFileUfoExperience,
} from '../analytics/ufoExperiences';
import { type FileStateFlags } from '../components/types';
import type { SvgViewerProps } from '../viewers/svg';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

const ImageViewerV2 = Loadable({
  loader: (): Promise<React.ComponentType<ImageViewerProps>> =>
    import(
      /* webpackChunkName: "@atlaskit-internal_imageViewer" */ '../viewers/image'
    ).then((mod) => mod.ImageViewer),
  loading: () => <Spinner />,
});
const VideoViewerV2 = Loadable({
  loader: (): Promise<React.ComponentType<VideoViewerProps>> =>
    import(
      /* webpackChunkName: "@atlaskit-internal_videoViewer" */ '../viewers/video'
    ).then((mod) => mod.VideoViewer),
  loading: () => <Spinner />,
});
const AudioViewerV2 = Loadable({
  loader: (): Promise<React.ComponentType<AudioViewerProps>> =>
    import(
      /* webpackChunkName: "@atlaskit-internal_audioViewer" */ '../viewers/audio'
    ).then((mod) => mod.AudioViewer),
  loading: () => <Spinner />,
});
const DocViewerV2 = Loadable({
  loader: (): Promise<React.ComponentType<DocViewerProps>> =>
    import(
      /* webpackChunkName: "@atlaskit-internal_docViewer" */ '../viewers/doc'
    ).then((mod) => mod.DocViewer),
  loading: () => <Spinner />,
});
const CodeViewerV2 = Loadable({
  loader: (): Promise<React.ComponentType<CodeViewerProps>> =>
    import(
      /* webpackChunkName: "@atlaskit-internal_codeViewer" */ '../viewers/codeViewer'
    ).then((mod) => mod.CodeViewer),
  loading: () => <Spinner />,
});

const SvgViewer = Loadable({
  loader: (): Promise<React.ComponentType<SvgViewerProps>> =>
    import(
      /* webpackChunkName: "@atlaskit-internal_svgViewer" */ '../viewers/svg'
    ).then((mod) => mod.SvgViewer),
  loading: () => <Spinner />,
});

export type Props = Readonly<{
  identifier: Identifier;
  onClose?: () => void;
  previewCount: number;
  contextId?: string;
  featureFlags?: MediaFeatureFlags;
}> &
  WithAnalyticsEventsProps &
  WithShowControlMethodProp;

export type FileItem = FileState | 'external-image';

export type State = Outcome<FileItem, MediaViewerError>;

// Consts
export const isExternalImageItem = (
  fileItem: FileItem,
): fileItem is 'external-image' => fileItem === 'external-image';

export const isFileStateItem = (fileItem: FileItem): fileItem is FileState =>
  !isExternalImageItem(fileItem);

export const MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER = 10 * 1024 * 1024;

export const ItemViewerV2Base = ({
  identifier,
  showControls,
  onClose,
  previewCount,
  contextId,
  createAnalyticsEvent,
}: Props): React.ReactElement | null => {
  // States and Refs
  const [item, setItem] = useState<State>(Outcome.pending());
  const traceContext = useRef<MediaTraceContext>({
    traceId: getRandomHex(8),
  });
  const fileStateFlagsRef = useRef<FileStateFlags>({
    wasStatusUploading: false,
    wasStatusProcessing: false,
  });

  const createAnalyticsEventRef = useRef(createAnalyticsEvent);
  createAnalyticsEventRef.current = createAnalyticsEvent;

  // Hooks
  const mediaClient = useMediaClient();
  const { fileState } = useFileState(
    isExternalImageIdentifier(identifier) ? '' : identifier.id,
    {
      collectionName: isExternalImageIdentifier(identifier)
        ? ''
        : identifier.collectionName,
      skipRemote: isExternalImageIdentifier(identifier),
    },
  );

  const renderDownloadButton = useCallback(
    (fileState: FileState, error: MediaViewerError) => {
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
    },
    [mediaClient, identifier],
  );

  // Did mount

  useEffect(() => {
    if (isExternalImageIdentifier(identifier)) {
      // external images do not need to talk to our backend,
      // so therefore no need for media-client subscriptions.
      // just set a successful outcome of type "external-image".
      setItem(Outcome.successful('external-image'));
      return;
    }

    fireAnalytics(
      createCommencedEvent(identifier?.id, traceContext.current),
      createAnalyticsEventRef.current,
    );
    startMediaFileUfoExperience();

    // File Subscription

    if (fileState) {
      const { status } = fileState;

      if (fileState.status !== 'error') {
        // updateFileStateFlag

        if (status === 'processing') {
          fileStateFlagsRef.current.wasStatusProcessing = true;
        } else if (status === 'uploading') {
          fileStateFlagsRef.current.wasStatusUploading = true;
        }

        setItem(Outcome.successful(fileState));
      } else {
        const e = new MediaFileStateError(
          fileState.id,
          fileState.reason,
          fileState.message,
          fileState.details,
        );
        setItem(
          Outcome.failed(new MediaViewerError('itemviewer-fetch-metadata', e)),
        );
      }
    }
  }, [fileState, identifier]);

  const onSuccess = useCallback(() => {
    item.whenSuccessful((fileItem) => {
      if (isFileStateItem(fileItem)) {
        const fileAttributes = getFileAttributes(fileItem);
        fireAnalytics(
          createLoadSucceededEvent(fileAttributes, traceContext.current),
          createAnalyticsEventRef.current,
        );
        succeedMediaFileUfoExperience({
          fileAttributes,
          fileStateFlags: fileStateFlagsRef.current,
        });
      }
    });
  }, [item]);

  const onLoadFail = useCallback(
    (mediaViewerError: MediaViewerError, data?: FileItem) => {
      setItem(Outcome.failed(mediaViewerError, data));
    },
    [],
  );

  const renderItem = (fileItem: NonErrorFileState) => {
    const collectionName = isFileIdentifier(identifier)
      ? identifier.collectionName
      : undefined;
    const viewerProps = {
      mediaClient,
      item: fileItem,
      collectionName,
      onClose,
      previewCount,
    };

    // TODO: fix all of the item errors

    if (isCodeViewerItem(fileItem.name, fileItem.mimeType)) {
      //Render error message if code file has size over 10MB.
      //Required by https://product-fabric.atlassian.net/browse/MEX-1788
      if (fileItem.size > MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER) {
        return renderError(
          new MediaViewerError('codeviewer-file-size-exceeds'),
          fileItem,
        );
      }

      return (
        <CodeViewerV2
          onSuccess={onSuccess}
          onError={onLoadFail}
          {...viewerProps}
        />
      );
    }

    if (
      getBooleanFF('platform.media-svg-rendering') &&
      isFileIdentifier(identifier) &&
      fileItem.mimeType === 'image/svg+xml'
    ) {
      return (
        <SvgViewer
          identifier={identifier}
          onLoad={onSuccess}
          onError={onLoadFail}
          onClose={onClose}
          traceContext={traceContext.current}
        />
      );
    }

    const { mediaType } = fileItem;

    switch (mediaType) {
      case 'image':
        return (
          <ImageViewerV2
            onLoad={onSuccess}
            onError={onLoadFail}
            contextId={contextId}
            traceContext={traceContext.current}
            {...viewerProps}
          />
        );
      case 'audio':
        return (
          <AudioViewerV2
            showControls={showControls}
            onCanPlay={onSuccess}
            onError={onLoadFail}
            {...viewerProps}
          />
        );
      case 'video':
        return (
          <VideoViewerV2
            showControls={showControls}
            onCanPlay={onSuccess}
            onError={onLoadFail}
            {...viewerProps}
          />
        );
      case 'doc':
        return (
          <DocViewerV2
            onSuccess={onSuccess}
            onError={(err) => {
              onLoadFail(err, fileState);
            }}
            {...viewerProps}
          />
        );
      case 'archive':
        return (
          <ArchiveViewerLoader
            onSuccess={onSuccess}
            onError={onLoadFail}
            {...viewerProps}
          />
        );
    }
    return renderError(new MediaViewerError('unsupported'), fileItem);
  };

  const renderError = useCallback(
    (error: MediaViewerError, fileItem?: FileItem) => {
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
            fileStateFlags={fileStateFlagsRef.current}
            traceContext={traceContext.current}
          >
            <p>
              <FormattedMessage {...messages.try_downloading_file} />
            </p>
            {renderDownloadButton(fileState, error)}
          </ErrorMessage>
        );
      } else {
        return (
          <ErrorMessage
            fileId={isFileIdentifier(identifier) ? identifier.id : 'undefined'}
            error={error}
            fileStateFlags={fileStateFlagsRef.current}
          />
        );
      }
    },
    [identifier, renderDownloadButton, traceContext],
  );

  return item.match({
    successful: (fileItem) => {
      if (fileItem === 'external-image') {
        // render an external image
        const { dataURI } = identifier as ExternalImageIdentifier;
        return (
          <InteractiveImg
            src={dataURI}
            onLoad={() => {
              fireAnalytics(
                createLoadSucceededEvent({
                  fileId: 'external-image',
                }),
                createAnalyticsEventRef.current,
              );
              succeedMediaFileUfoExperience({
                fileAttributes: {
                  fileId: 'external-image',
                },
                fileStateFlags: fileStateFlagsRef.current,
              });
            }}
            onError={() => {
              setItem(
                Outcome.failed(
                  new MediaViewerError('imageviewer-external-onerror'),
                ),
              );
            }}
          />
        );
      } else {
        // render a FileState fetched through media-client
        switch (fileItem.status) {
          case 'processed':
          case 'uploading':
          case 'processing':
            return renderItem(fileItem);
          case 'failed-processing':
            if (
              fileItem.mediaType === 'doc' &&
              fileItem.mimeType === 'application/pdf'
            ) {
              return renderItem(fileItem);
            }
            return renderError(
              new MediaViewerError('itemviewer-file-failed-processing-status'),
              fileItem,
            );
          case 'error':
            return renderError(
              new MediaViewerError('itemviewer-file-error-status'),
              fileItem,
            );
        }
      }
    },
    pending: () => <Spinner />,
    failed: (error) => renderError(error, item.data),
  });
};

const ViewerWithKey = (props: Props) => {
  const { identifier } = props;
  const key = isFileIdentifier(identifier) ? identifier.id : identifier.dataURI;
  return <ItemViewerV2Base {...props} key={key} />;
};

export const ItemViewerV2 = withAnalyticsEvents()(ViewerWithKey);
