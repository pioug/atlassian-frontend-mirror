import React, { FC, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FileIdentifier, FileState, MediaClient } from '@atlaskit/media-client';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import {
  InlineCardResolvedView,
  InlineCardResolvingView,
  InlineCardErroredView,
  messages,
} from '@atlaskit/media-ui';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import { MediaViewer, MediaViewerDataSource } from '@atlaskit/media-viewer';

export interface InlineMediaCardProps {
  identifier: FileIdentifier;
  mediaClient: MediaClient;
  shouldOpenMediaViewer?: boolean;
  isSelected?: boolean;
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  mediaViewerDataSource?: MediaViewerDataSource;
}

// UI component which renders an inline link in the appropiate state based on a media file
export const InlineMediaCardInternal: FC<
  InlineMediaCardProps & InjectedIntlProps
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
  const [isMediaViewerVisible, setMediaViewerVisible] = useState(false);
  const onInlineCardClick = (event: React.MouseEvent | React.KeyboardEvent) => {
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
    // [EDM-1948] TODO: use mediaClient.file.getFileState()
    // [EDM-1948] TODO: handle error here
    mediaClient.file
      .getCurrentState(identifier.id, {
        collectionName: identifier.collectionName,
      })
      .then((fileState) => {
        setFileState(fileState);
      });
  }, [identifier.collectionName, identifier.id, mediaClient.file]);

  if (!fileState) {
    return (
      <InlineCardResolvingView
        url={intl.formatMessage(messages.loading_file)}
        titleTextColor="black"
        withoutHover
      />
    );
  }

  if (fileState.status === 'error') {
    return <InlineCardErroredView url="" message={fileState.message || ''} />;
  }

  const { mediaType, name } = fileState;
  const linkIcon = <MediaTypeIcon size="small" type={mediaType} />;
  const mediaViewer = renderMediaViewer();

  // [EDM-1948] TODO: add Tooltip
  return (
    <>
      <InlineCardResolvedView
        icon={linkIcon}
        title={name}
        onClick={onInlineCardClick}
        isSelected={isSelected}
      />
      {mediaViewer}
    </>
  );
};

export const InlineMediaCard = injectIntl(InlineMediaCardInternal);
