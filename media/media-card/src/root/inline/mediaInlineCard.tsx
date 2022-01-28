import React, { FC, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FileIdentifier, FileState, MediaClient } from '@atlaskit/media-client';
import {
  WrappedComponentProps,
  injectIntl,
  IntlProvider,
  createIntl,
} from 'react-intl-next';
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
  MediaInlineCardProps & WrappedComponentProps
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

  const renderContent = (children: React.ReactElement) => {
    return intl ? (
      children
    ) : (
      <IntlProvider locale="en">{children}</IntlProvider>
    );
  };
  const defaultIntl = createIntl({ locale: 'en' });

  useEffect(() => {
    const subscription = mediaClient.file
      .getFileState(identifier.id, {
        collectionName: identifier.collectionName,
      })
      .subscribe({
        next: (fileState) => {
          setFileState(fileState);
          setIsErrored(false);
        },
        error: () => {
          setIsErrored(true);
        },
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [identifier.collectionName, identifier.id, mediaClient.file]);

  if (!fileState) {
    return (
      <MediaInlineCardLoadingView
        message={(intl || defaultIntl).formatMessage(messages.loading_file)}
        isSelected={isSelected}
      />
    );
  }
  if (isErrored) {
    return (
      <MediaInlineCardErroredView
        message={(intl || defaultIntl).formatMessage(
          messages.couldnt_load_file,
        )}
        isSelected={isSelected}
      />
    );
  }
  if (fileState.status === 'error') {
    return (
      <MediaInlineCardErroredView
        message={fileState.message || ''}
        isSelected={isSelected}
      />
    );
  }

  if (fileState.status === 'failed-processing') {
    return (
      <MediaInlineCardErroredView
        message={(intl || defaultIntl).formatMessage(
          messages.couldnt_load_file,
        )}
        isSelected={isSelected}
      />
    );
  }

  if (fileState.status === 'uploading') {
    return (
      <MediaInlineCardLoadingView
        message={fileState.name}
        isSelected={isSelected}
      />
    );
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

  return renderContent(
    <>
      <Tooltip position="bottom" content={formattedDate} tag="span">
        <MediaInlineCardLoadedView
          icon={linkIcon}
          title={name}
          onClick={onMediaInlineCardClick}
          isSelected={isSelected}
        />
      </Tooltip>
      {mediaViewer}
    </>,
  );
};

export const MediaInlineCard: React.FC<MediaInlineCardProps> = injectIntl(
  MediaInlineCardInternal,
  {
    enforceContext: false,
  },
);
