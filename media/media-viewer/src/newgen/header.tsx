import React from 'react';
import { ReactNode, ReactChild } from 'react';
import {
  MediaClient,
  FileState,
  MediaType,
  ProcessedFileState,
  ProcessingFileState,
  Identifier,
  isExternalImageIdentifier,
} from '@atlaskit/media-client';
import { Subscription } from 'rxjs/Subscription';
import deepEqual from 'deep-equal';
import {
  hideControlsClassName,
  messages,
  toHumanReadableMediaSize,
  MediaButton,
} from '@atlaskit/media-ui';
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
import { MediaTypeIcon } from './media-type-icon';
import { MediaViewerError, createError } from './error';
import {
  ToolbarDownloadButton,
  DisabledToolbarDownloadButton,
} from './download';
import { MediaViewerExtensions } from '../components/types';

export type Props = {
  readonly identifier: Identifier;
  readonly mediaClient: MediaClient;
  readonly onClose?: () => void;
  readonly extensions?: MediaViewerExtensions;
  readonly onSidebarButtonClick?: () => void;
  readonly isSidebarVisible?: boolean;
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
    this.setState(initialState, async () => {
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
      const id =
        typeof identifier.id === 'string' ? identifier.id : await identifier.id;
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
          error: err => {
            this.setState({
              item: Outcome.failed(createError('metadataFailed', err)),
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
      successful: item => (
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
          appearance={'toolbar' as any}
          onClick={onSidebarButtonClick}
          iconBefore={extensions.sidebar.icon as ReactChild}
        />
      );
    }
  };

  render() {
    return (
      <HeaderWrapper className={hideControlsClassName}>
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
      successful: item => this.renderMetadataLayout(item),
      pending: () => null,
      failed: () => null,
    });
  }

  private renderMetadataLayout(item: FileState) {
    if (item.status === 'processed' || item.status === 'processing') {
      return (
        <MetadataWrapper>
          <MetadataIconWrapper>
            {this.getMediaIcon(item.mediaType)}
          </MetadataIconWrapper>
          <MedatadataTextWrapper>
            <MetadataFileName data-testid="media-viewer-file-name">
              {item.name || <FormattedMessage {...messages.unknown} />}
            </MetadataFileName>
            <MetadataSubText data-testid="media-viewer-file-metadata-text">
              {this.renderFileTypeText(item.mediaType)}
              {this.renderSize(item)}
            </MetadataSubText>
          </MedatadataTextWrapper>
        </MetadataWrapper>
      );
    } else {
      return null;
    }
  }

  private renderSize = (item: ProcessedFileState | ProcessingFileState) => {
    if (item.size) {
      return this.renderSeparator() + toHumanReadableMediaSize(item.size);
    } else {
      return '';
    }
  };

  private renderSeparator = () => {
    return ' · ';
  };

  private renderFileTypeText = (mediaType?: MediaType): ReactNode => {
    const mediaTypeTranslationMap = {
      doc: messages.document,
      audio: messages.audio,
      video: messages.video,
      image: messages.image,
      unknown: messages.unknown,
    };
    const message = mediaTypeTranslationMap[mediaType || 'unknown'];

    // Defaulting to unknown again since backend has more mediaTypes than the current supported ones
    return <FormattedMessage {...(message || messages.unknown)} />;
  };

  private getMediaIcon = (mediaType?: MediaType) => {
    return <MediaTypeIcon type={mediaType} />;
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
