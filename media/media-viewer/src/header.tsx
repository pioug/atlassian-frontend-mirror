import React from 'react';
import { ReactNode, ReactChild } from 'react';
import {
  MediaClient,
  FileState,
  MediaType,
  ProcessingFileState,
  Identifier,
  isExternalImageIdentifier,
  isErrorFileState,
  ErrorFileState,
} from '@atlaskit/media-client';
import { Subscription } from 'rxjs/Subscription';
import deepEqual from 'deep-equal';
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
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Outcome } from './domain';
import {
  Header as HeaderWrapper,
  LeftHeader,
  RightHeader,
  MetadataWrapper,
  MetadataSubText,
  MedatadataTextWrapper,
  MetadataIconWrapper,
  MetadataFileName,
} from './styled';
import {
  ToolbarDownloadButton,
  DisabledToolbarDownloadButton,
} from './download';
import { MediaViewerExtensions } from './components/types';
import { MediaFeatureFlags, getMediaFeatureFlag } from '@atlaskit/media-common';
import { MimeTypeIcon } from '@atlaskit/media-ui/mime-type-icon';
import { getFormat } from './viewers/codeViewer/util';
import { MediaViewerError } from './errors';

export type Props = {
  readonly identifier: Identifier;
  readonly mediaClient: MediaClient;
  readonly onClose?: () => void;
  readonly extensions?: MediaViewerExtensions;
  readonly onSidebarButtonClick?: () => void;
  readonly isSidebarVisible?: boolean;
  readonly featureFlags?: MediaFeatureFlags;
};

export type State = {
  item: Outcome<FileState, MediaViewerError>;
};

const initialState: State = {
  item: Outcome.pending(),
};

export class Header extends React.Component<Props & InjectedIntlProps, State> {
  state: State = initialState;

  private subscription?: Subscription;

  UNSAFE_componentWillUpdate(nextProps: Props) {
    if (this.needsReset(this.props, nextProps)) {
      this.release();
      this.init(nextProps);
    }
  }

  componentDidMount() {
    this.init(this.props);
  }

  componentWillUnmount() {
    this.release();
  }

  private init(props: Props) {
    this.setState(initialState, () => {
      const { mediaClient, identifier } = props;

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

        this.setState({
          item: Outcome.successful(fileState),
        });
        return;
      }
      const { id } = identifier;

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
                new MediaViewerError('header-fetch-metadata', error),
              ),
            });
          },
        });
    });
  }

  private renderDownload = () => {
    const { item } = this.state;
    const { identifier, mediaClient } = this.props;
    return item.match({
      pending: () => DisabledToolbarDownloadButton,
      failed: () => DisabledToolbarDownloadButton,
      successful: (item) => (
        <ToolbarDownloadButton
          state={item}
          identifier={identifier}
          mediaClient={mediaClient}
        />
      ),
    });
  };

  private renderSidebarButton = () => {
    const { extensions, isSidebarVisible, onSidebarButtonClick } = this.props;
    if (extensions && extensions.sidebar) {
      return (
        <MediaButton
          isSelected={isSidebarVisible}
          testId="media-viewer-sidebar-button"
          onClick={onSidebarButtonClick}
          iconBefore={extensions.sidebar.icon as ReactChild}
        />
      );
    }
  };

  render() {
    const { item } = this.state;
    const { featureFlags } = this.props;
    let isArchiveSideBarVisible = false;
    if (
      getMediaFeatureFlag('zipPreviews', featureFlags) &&
      item.data &&
      !isErrorFileState(item.data)
    ) {
      const { mediaType } = item.data;
      isArchiveSideBarVisible = mediaType === 'archive';
    }
    return (
      <HeaderWrapper
        isArchiveSideBarVisible={isArchiveSideBarVisible}
        className={hideControlsClassName}
      >
        <LeftHeader>{this.renderMetadata()}</LeftHeader>
        <RightHeader>
          {this.renderSidebarButton()}
          {this.renderDownload()}
        </RightHeader>
      </HeaderWrapper>
    );
  }

  private renderMetadata() {
    const { item } = this.state;
    return item.match({
      successful: (item) => this.renderMetadataLayout(item),
      pending: () => null,
      failed: () => null,
    });
  }

  private renderMetadataLayout(item: FileState) {
    if (!isErrorFileState(item)) {
      return (
        <MetadataWrapper>
          <MetadataIconWrapper>
            {this.getMediaIcon(item.mediaType, item.mimeType, item.name)}
          </MetadataIconWrapper>
          <MedatadataTextWrapper>
            <MetadataFileName data-testid="media-viewer-file-name">
              {item.name || <FormattedMessage {...messages.unknown} />}
            </MetadataFileName>
            <MetadataSubText data-testid="media-viewer-file-metadata-text">
              {this.renderFileTypeText(item)}
              {this.renderSize(item)}
            </MetadataSubText>
          </MedatadataTextWrapper>
        </MetadataWrapper>
      );
    } else {
      return null;
    }
  }

  private renderSize = (item: Exclude<FileState, ErrorFileState>) => {
    if (item.size) {
      return this.renderSeparator() + toHumanReadableMediaSize(item.size);
    } else {
      return '';
    }
  };

  private renderSeparator = () => {
    return ' · ';
  };

  private renderFileTypeText = (
    item: Exclude<FileState, ErrorFileState>,
  ): ReactNode => {
    const { featureFlags } = this.props;
    // render appropriate header if its a code/email item and the feature flag is enabled
    if (
      getMediaFeatureFlag('codeViewer', featureFlags) &&
      isCodeViewerItem(item.name)
    ) {
      // gather language and extension
      // i.e test.py would have a language of 'python' and an extension of 'py'
      const language = getLanguageType(item.name);
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

  private getMediaIcon = (
    mediaType?: MediaType,
    mimeType?: string,
    fileName?: string,
  ) => {
    return (
      <MimeTypeIcon
        testId={'media-viewer-file-type-icon'}
        mediaType={mediaType}
        mimeType={mimeType}
        name={fileName}
      />
    );
  };

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

export default injectIntl(Header);
