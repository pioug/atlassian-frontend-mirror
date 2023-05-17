import React, { FC, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  FileIdentifier,
  FileState,
  Identifier,
  MediaClient,
} from '@atlaskit/media-client';
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
import { MimeTypeIcon } from '@atlaskit/media-ui/mime-type-icon';
import { MediaViewer } from '@atlaskit/media-viewer';
import Tooltip from '@atlaskit/tooltip';
import { formatDate } from '@atlaskit/media-ui/formatDate';
import { InlineCardEvent, InlineCardOnClickCallback } from '../types';

export interface MediaInlineCardProps {
  identifier: FileIdentifier;
  mediaClient: MediaClient;
  shouldOpenMediaViewer?: boolean;
  shouldDisplayToolTip?: boolean; // undefined is default to true
  isSelected?: boolean;
  onClick?: InlineCardOnClickCallback;
  mediaViewerItems?: Identifier[];
}

// UI component which renders an inline link in the appropiate state based on a media file
export const MediaInlineCardInternal: FC<
  MediaInlineCardProps & WrappedComponentProps
> = ({
  mediaClient,
  identifier,
  shouldOpenMediaViewer,
  shouldDisplayToolTip,
  isSelected,
  onClick,
  mediaViewerItems,
  intl,
}) => {
  const [fileState, setFileState] = useState<FileState | undefined>();
  const [isErrored, setIsErrored] = useState(false);
  const [isMediaViewerVisible, setMediaViewerVisible] = useState(false);
  const onMediaInlineCardClick = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent,
  ) => {
    if (onClick) {
      const inlineCardEvent: InlineCardEvent = {
        event,
        mediaItemDetails: identifier,
      };
      onClick(inlineCardEvent);
    }

    if (shouldOpenMediaViewer) {
      setMediaViewerVisible(true);
    }
  };

  const onMediaViewerClose = () => setMediaViewerVisible(false);
  const renderMediaViewer = () => {
    if (isMediaViewerVisible) {
      return ReactDOM.createPortal(
        <MediaViewer
          collectionName={identifier.collectionName || ''}
          items={mediaViewerItems || []}
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

  if (isErrored && fileState?.status === 'uploading') {
    return (
      <MediaInlineCardErroredView
        message={(intl || defaultIntl).formatMessage(messages.failed_to_upload)}
        isSelected={isSelected}
      />
    );
  }

  if (
    isErrored ||
    fileState?.status === 'error' ||
    fileState?.status === 'failed-processing' ||
    // Empty file handling
    (fileState && !fileState.name)
  ) {
    return (
      <MediaInlineCardErroredView
        message={(intl || defaultIntl).formatMessage(
          messages.couldnt_load_file,
        )}
        isSelected={isSelected}
      />
    );
  }

  if (fileState?.status === 'uploading') {
    return (
      <MediaInlineCardLoadingView
        message={fileState.name}
        isSelected={isSelected}
      />
    );
  }

  if (!fileState) {
    return (
      <MediaInlineCardLoadingView
        message={(intl || defaultIntl).formatMessage(messages.loading_file)}
        isSelected={isSelected}
      />
    );
  }

  const { mediaType, name, mimeType } = fileState;
  const linkIcon = (
    <MimeTypeIcon
      testId={'media-inline-card-file-type-icon'}
      size="small"
      mediaType={mediaType}
      mimeType={mimeType}
      name={name}
    />
  );
  const mediaViewer = renderMediaViewer();

  let formattedDate;
  if (fileState.createdAt) {
    const { locale = 'en' } = intl || { locale: 'en' };
    formattedDate = formatDate(fileState.createdAt, locale);
  }

  if (shouldDisplayToolTip === undefined || shouldDisplayToolTip === true) {
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
  } else {
    return renderContent(
      <>
        <MediaInlineCardLoadedView
          icon={linkIcon}
          title={name}
          onClick={onMediaInlineCardClick}
          isSelected={isSelected}
        />
        {mediaViewer}
      </>,
    );
  }
};

export const MediaInlineCard: React.FC<MediaInlineCardProps> = injectIntl(
  MediaInlineCardInternal,
  {
    enforceContext: false,
  },
);
