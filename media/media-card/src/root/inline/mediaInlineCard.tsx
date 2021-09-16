import React, { FC, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FileIdentifier, FileState, MediaClient } from '@atlaskit/media-client';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import {
  MediaInlineCardLoadedView,
  MediaInlineCardLoadingView,
  MediaInlineCardErroredView,
  messages,
} from '@atlaskit/media-ui';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import { MediaViewer, MediaViewerDataSource } from '@atlaskit/media-viewer';
import Tooltip from '@atlaskit/tooltip';
import { formatDate } from '@atlaskit/media-ui/formatDate';

export interface MediaInlineCardProps {
  identifier: FileIdentifier;
  mediaClient: MediaClient;
  shouldOpenMediaViewer?: boolean;
  isSelected?: boolean;
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  mediaViewerDataSource?: MediaViewerDataSource;
}

// UI component which renders an inline link in the appropiate state based on a media file
export const MediaInlineCardInternal: FC<
  MediaInlineCardProps & InjectedIntlProps
> = ({
  mediaClient,
  identifier,
  shouldOpenMediaViewer,
  isSelected,
  onClick,
  mediaViewerDataSource,
  intl,
}) => {
  const [fileState, setFileState] = useState<FileState | undefined>();
  const [isErrored, setIsErrored] = useState(false);
  const [isMediaViewerVisible, setMediaViewerVisible] = useState(false);
  const onMediaInlineCardClick = (
    event: React.MouseEvent | React.KeyboardEvent,
  ) => {
    if (shouldOpenMediaViewer) {
      setMediaViewerVisible(true);
    }

    if (onClick) {
      onClick(event);
    }
  };
  const onMediaViewerClose = () => setMediaViewerVisible(false);
  const renderMediaViewer = () => {
    if (isMediaViewerVisible) {
      const dataSource: MediaViewerDataSource = mediaViewerDataSource || {
        list: [],
      };
      return ReactDOM.createPortal(
        <MediaViewer
          collectionName={identifier.collectionName || ''}
          dataSource={dataSource}
          mediaClientConfig={mediaClient.mediaClientConfig}
          selectedItem={identifier}
          onClose={onMediaViewerClose}
        />,
        document.body,
      );
    }
    return null;
  };

  useEffect(() => {
    mediaClient.file
      .getFileState(identifier.id, {
        collectionName: identifier.collectionName,
      })
      .subscribe({
        next: (fileState) => {
          setFileState(fileState);
        },
        error: () => {
          setIsErrored(true);
        },
      });
  }, [identifier.collectionName, identifier.id, mediaClient.file]);

  if (!fileState) {
    return (
      <MediaInlineCardLoadingView
        message={intl.formatMessage(messages.loading_file)}
      />
    );
  }
  if (isErrored) {
    return (
      <MediaInlineCardErroredView
        message={intl.formatMessage(messages.couldnt_load_file)}
      />
    );
  }
  if (fileState.status === 'error') {
    return <MediaInlineCardErroredView message={fileState.message || ''} />;
  }

  if (fileState.status === 'failed-processing') {
    return (
      <MediaInlineCardErroredView
        message={intl.formatMessage(messages.couldnt_load_file)}
      />
    );
  }

  if (fileState.status === 'uploading') {
    return <MediaInlineCardLoadingView message={fileState.name} />;
  }

  const { mediaType, name } = fileState;
  const linkIcon = (
    <MediaTypeIcon
      testId={'media-inline-card-file-type-icon'}
      size="small"
      type={mediaType}
    />
  );
  const mediaViewer = renderMediaViewer();

  let formattedDate;
  if (fileState.createdAt) {
    const { locale = 'en' } = intl || { locale: 'en' };
    formattedDate = formatDate(fileState.createdAt, locale);
  }

  return (
    <Tooltip position="bottom" content={formattedDate}>
      <MediaInlineCardLoadedView
        icon={linkIcon}
        title={name}
        onClick={onMediaInlineCardClick}
        isSelected={isSelected}
      />
      {mediaViewer}
    </Tooltip>
  );
};

export const MediaInlineCard = injectIntl(MediaInlineCardInternal);
