import React, { useEffect, useRef, useState } from 'react';
import { ReactNode, ReactChild } from 'react';
import {
  FileState,
  ProcessingFileState,
  Identifier,
  isExternalImageIdentifier,
  isErrorFileState,
  ErrorFileState,
  FileIdentifier,
} from '@atlaskit/media-client';
import {
  hideControlsClassName,
  messages,
  toHumanReadableMediaSize,
  MediaButton,
} from '@atlaskit/media-ui';
import {
  getLanguageType,
  getExtension,
  isCodeViewerItem,
} from '@atlaskit/media-ui/codeViewer';
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';
import { Outcome } from '../domain';
import {
  Header as HeaderWrapper,
  LeftHeader,
  RightHeader,
  MetadataWrapper,
  MetadataSubText,
  MedatadataTextWrapper,
  MetadataIconWrapper,
  MetadataFileName,
  FormattedMessageWrapper,
} from '../styleWrappers';
import {
  ToolbarDownloadButton,
  DisabledToolbarDownloadButton,
} from '../download';
import { MediaViewerExtensions } from '../components/types';
import {
  MediaFileStateError,
  useFileState,
  useMediaClient,
} from '@atlaskit/media-client-react';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { MimeTypeIcon } from '@atlaskit/media-ui/mime-type-icon';
import { getFormat } from '../viewers/codeViewer/util';
import { MediaViewerError } from '../errors';

export type Props = {
  readonly identifier: Identifier;
  readonly onClose?: () => void;
  readonly extensions?: MediaViewerExtensions;
  readonly onSidebarButtonClick?: () => void;
  readonly isSidebarVisible?: boolean;
  readonly featureFlags?: MediaFeatureFlags;
  readonly onSetArchiveSideBarVisible?: (isVisible: boolean) => void;
  readonly isArchiveSideBarVisible?: boolean;
};

export const HeaderV2 = ({
  isArchiveSideBarVisible = false,
  extensions,
  isSidebarVisible,
  onSidebarButtonClick,
  identifier,
  onSetArchiveSideBarVisible,
}: Props & WrappedComponentProps) => {
  // States
  const [item, setItem] = useState<Outcome<FileState, MediaViewerError>>(
    Outcome.pending(),
  );

  // Refs and Hooks
  const mediaClient = useMediaClient();
  const { id, collectionName, occurrenceKey } = identifier as FileIdentifier;
  const { fileState } = useFileState(id, {
    collectionName,
    occurrenceKey,
  });

  const onSetArchiveSideBarVisibleRef = useRef(onSetArchiveSideBarVisible);
  onSetArchiveSideBarVisibleRef.current = onSetArchiveSideBarVisible;

  // previous values
  useEffect(() => {
    if (isExternalImageIdentifier(identifier)) {
      const { name = identifier.dataURI } = identifier;

      // Simulate a processing file state to render right metadata
      const fileState: ProcessingFileState = {
        status: 'processing',
        id: name,
        mediaType: 'image',
        mimeType: 'image/',
        name,
        representations: {},
        size: 0,
      };
      setItem(Outcome.successful(fileState));
      return;
    }

    if (!fileState) {
      return;
    }

    if (fileState.status !== 'error') {
      onSetArchiveSideBarVisibleRef.current?.(
        !isErrorFileState(fileState) && fileState.mediaType === 'archive',
      );
      setItem(Outcome.successful(fileState));
    } else {
      const error = new MediaFileStateError(
        fileState.id,
        fileState.reason,
        fileState.message,
        fileState.details,
      );
      setItem(
        Outcome.failed(new MediaViewerError('header-fetch-metadata', error)),
      );
    }
  }, [fileState, identifier]);

  const renderFileTypeText = (
    item: Exclude<FileState, ErrorFileState>,
  ): ReactNode => {
    // render appropriate header if its a code/email item and the feature flag is enabled
    if (isCodeViewerItem(item.name, item.mimeType)) {
      // gather language and extension
      // i.e test.py would have a language of 'python' and an extension of 'py'
      const language = getLanguageType(item.name, item.mimeType);
      const ext = getExtension(item.name);

      // specific cases for if we want a certain word translated in other languages
      switch (ext) {
        case 'msg':
          return <FormattedMessage {...messages.email} />;
        case 'txt':
          return <FormattedMessage {...messages.text} />;
      }

      // no need for translations in other languages
      return <>{getFormat(language || 'unknown', ext)}</>;
    }

    const { mediaType } = item;
    const mediaTypeTranslationMap = {
      doc: messages.document,
      audio: messages.audio,
      video: messages.video,
      image: messages.image,
      archive: messages.archive,
      unknown: messages.unknown,
    };
    const message = mediaTypeTranslationMap[mediaType || 'unknown'];

    // Defaulting to unknown again since backend has more mediaTypes than the current supported ones
    return <FormattedMessage {...(message || messages.unknown)} />;
  };

  return (
    <HeaderWrapper
      isArchiveSideBarVisible={isArchiveSideBarVisible}
      className={hideControlsClassName}
    >
      <LeftHeader>
        {item.match({
          successful: (item) =>
            !isErrorFileState(item) && (
              <MetadataWrapper>
                <MetadataIconWrapper>
                  <MimeTypeIcon
                    testId={'media-viewer-file-type-icon'}
                    mediaType={item.mediaType}
                    mimeType={item.mimeType}
                    name={item.name}
                  />
                </MetadataIconWrapper>
                <MedatadataTextWrapper>
                  <MetadataFileName data-testid="media-viewer-file-name">
                    {item.name || <FormattedMessage {...messages.unknown} />}
                  </MetadataFileName>
                  <MetadataSubText data-testid="media-viewer-file-metadata-text">
                    <FormattedMessageWrapper>
                      {renderFileTypeText(item)}
                    </FormattedMessageWrapper>
                    {item.size
                      ? ' · ' + toHumanReadableMediaSize(item.size)
                      : ''}
                  </MetadataSubText>
                </MedatadataTextWrapper>
              </MetadataWrapper>
            ),
          pending: () => null,
          failed: () => null,
        })}
      </LeftHeader>
      <RightHeader>
        {extensions?.sidebar && (
          <MediaButton
            isSelected={isSidebarVisible}
            testId="media-viewer-sidebar-button"
            onClick={onSidebarButtonClick}
            iconBefore={extensions.sidebar.icon as ReactChild}
          />
        )}
        {item.match({
          pending: () => DisabledToolbarDownloadButton,
          failed: () => DisabledToolbarDownloadButton,
          successful: (item) => (
            <ToolbarDownloadButton
              state={item}
              identifier={identifier}
              mediaClient={mediaClient}
            />
          ),
        })}
      </RightHeader>
    </HeaderWrapper>
  );
};

export default injectIntl(HeaderV2) as React.FC<Props>;
