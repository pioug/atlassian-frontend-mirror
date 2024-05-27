import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import {
  FileFetcherError,
  type FileIdentifier,
  type FileState,
  type Identifier,
  type MediaClient,
} from '@atlaskit/media-client';
import {
  MediaInlineCardErroredView,
  MediaInlineCardLoadedView,
  MediaInlineCardLoadingView,
  messages,
} from '@atlaskit/media-ui';
import { formatDate } from '@atlaskit/media-ui/formatDate';
import { MimeTypeIcon } from '@atlaskit/media-ui/mime-type-icon';
import { MediaViewer } from '@atlaskit/media-viewer';
import Tooltip from '@atlaskit/tooltip';
import React, { type FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  createIntl,
  injectIntl,
  IntlProvider,
  type WrappedComponentProps,
} from 'react-intl-next';
import { MediaCardError } from '../errors';
import { type InlineCardEvent, type InlineCardOnClickCallback } from '../types';
import { fireMediaCardEvent } from '../utils/analytics';
import {
  getErrorStatusPayload,
  getFailedProcessingStatusPayload,
  getSucceededStatusPayload,
} from './mediaInlineCardAnalytics';

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
  const [subscribeError, setSubscribeError] = useState<Error>();
  const [isSucceededEventSent, setIsSucceededEventSent] = useState(false);
  const [isFailedEventSent, setIsFailedEventSent] = useState(false);
  const [isMediaViewerVisible, setMediaViewerVisible] = useState(false);
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const fireFailedOperationalEvent = (
    error: MediaCardError = new MediaCardError('missing-error-data'),
    failReason?: 'failed-processing',
  ) => {
    const payload = failReason
      ? getFailedProcessingStatusPayload(fileState)
      : getErrorStatusPayload(error, fileState);
    setIsFailedEventSent(true);
    fireMediaCardEvent(payload, createAnalyticsEvent);
  };
  const fireSucceededOperationalEvent = () => {
    const payload = getSucceededStatusPayload(fileState);
    setIsSucceededEventSent(true);
    fireMediaCardEvent(payload, createAnalyticsEvent);
  };

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
          setSubscribeError(undefined);
        },
        error: (e) => {
          setSubscribeError(e);
        },
      });
    return () => {
      subscription?.unsubscribe();
    };
  }, [identifier.collectionName, identifier.id, mediaClient.file]);

  if (subscribeError) {
    const errorMessage =
      fileState?.status === 'uploading'
        ? messages.failed_to_upload
        : messages.couldnt_load_file;
    const errorReason =
      fileState?.status === 'uploading' ? 'upload' : 'metadata-fetch';
    !isFailedEventSent &&
      fireFailedOperationalEvent(
        new MediaCardError(errorReason, subscribeError),
      );

    return (
      <MediaInlineCardErroredView
        message={(intl || defaultIntl).formatMessage(errorMessage)}
        isSelected={isSelected}
      />
    );
  }

  if (fileState?.status === 'error') {
    const error = new MediaCardError(
      'error-file-state',
      new Error(fileState.message),
    );
    !isFailedEventSent && fireFailedOperationalEvent(error);
    return (
      <MediaInlineCardErroredView
        message={(intl || defaultIntl).formatMessage(
          messages.couldnt_load_file,
        )}
        isSelected={isSelected}
      />
    );
  }

  // Empty file handling
  if (fileState && !fileState.name) {
    const error = new MediaCardError(
      'metadata-fetch',
      new FileFetcherError('emptyFileName', fileState.id),
    );
    !isFailedEventSent && fireFailedOperationalEvent(error);
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

  // Failed to process should still display the loaded view and enable Media Client to download
  if (fileState?.status === 'failed-processing') {
    !isFailedEventSent &&
      fireFailedOperationalEvent(undefined, 'failed-processing');
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

  if (fileState.status === 'processed' && !isSucceededEventSent) {
    fireSucceededOperationalEvent();
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
