import React from 'react';
import { MediaClient, FileState } from '@atlaskit/media-client';
import { Outcome } from '../../domain';
import {
  CustomVideoPlayerWrapper,
  AudioPlayer,
  CustomAudioPlayerWrapper,
  DefaultCoverWrapper,
  blanketColor,
} from '../../styled';
import AudioIcon from '@atlaskit/icon/glyph/media-services/audio';
import ErrorMessage, { MediaViewerError, createError } from '../../error';
import { BaseViewer } from '../base-viewer';
import { InteractiveImg } from '../image/interactive-img';
import { CustomMediaPlayer, messages } from '@atlaskit/media-ui';
import { PDFRenderer } from '../doc/pdfRenderer';
import { unzip, ZipInfo, ZipEntry, HTTPRangeReader, Reader } from 'unzipit';
import { FormattedMessage } from 'react-intl';
import {
  ArchiveItemViewerWrapper,
  ArchiveLayout,
  ArchiveViewerWrapper,
} from './styled';
import ArchiveSidebarRenderer from './archive-sidebar-renderer';
import { getMediaTypeFromFilename, rejectAfter } from '../../../newgen/utils';
import { ENCRYPTED_ENTRY_ERROR_MESSAGE } from './consts';

export type Props = {
  mediaClient: MediaClient;
  item: FileState;
  collectionName?: string;
};

type Content = {
  src?: string;
  name?: string;
  isDirectory?: boolean;
  selectedArchiveEntry?: ZipEntry;
  isArchiveEntryLoading?: boolean;
  isErrored?: boolean;
  error?: Error;
};

export const getArchiveEntriesFromFileState = async (
  fileState: FileState,
  mediaClient: MediaClient,
  collectionName?: string,
): Promise<ZipInfo> => {
  const url = await mediaClient.file.getFileBinaryURL(
    fileState.id,
    collectionName,
  );
  const reader = new HTTPRangeReader(url);
  const archive = await rejectAfter(() => unzip(reader as Reader));

  return archive;
};

export class ArchiveViewer extends BaseViewer<Content, Props> {
  protected async init() {
    const content = Outcome.successful<Content, MediaViewerError>({
      src: '',
      name: '',
      isDirectory: true,
      isErrored: false,
    });

    this.setState({
      content,
    });
  }

  protected get initialState() {
    return {
      content: Outcome.successful<Content, MediaViewerError>({
        src: '',
        name: '',
        isDirectory: true,
        isErrored: false,
      }),
    };
  }

  protected release() {
    const { content } = this.state;
    if (!content.data || !content.data.src) {
      return;
    }

    URL.revokeObjectURL(content.data.src);
  }

  protected renderSuccessful(content: Content) {
    return (
      <ArchiveLayout>
        {this.renderArchiveSideBar()}
        <ArchiveViewerWrapper>
          {this.renderArchiveItemViewer(content)}
        </ArchiveViewerWrapper>
      </ArchiveLayout>
    );
  }

  private onError = (error: Error) => {
    this.setState({
      content: Outcome.successful<Content, MediaViewerError>({
        isErrored: true,
        error,
      }),
    });
  };

  private renderArchiveSideBar() {
    const { item, mediaClient, collectionName } = this.props;
    const isArchiveEntryLoading =
      !this.state.content.data ||
      this.state.content.data.isArchiveEntryLoading === undefined
        ? true
        : this.state.content.data.isArchiveEntryLoading;
    return (
      <ArchiveSidebarRenderer
        selectedFileState={item}
        mediaClient={mediaClient}
        onSelectedArchiveEntryChange={this.onSelectedArchiveEntryChange}
        onHeaderClicked={this.onHeaderClicked}
        isArchiveEntryLoading={isArchiveEntryLoading}
        collectionName={collectionName}
        onError={this.onError}
      />
    );
  }

  private onSelectedArchiveEntryChange = async (
    selectedArchiveEntry: ZipEntry,
  ) => {
    let src = '';
    if (!selectedArchiveEntry.isDirectory) {
      try {
        src = URL.createObjectURL(
          await rejectAfter(() => selectedArchiveEntry.blob()),
        );
      } catch (error) {
        return this.onError(error);
      }
    }
    this.setState({
      content: Outcome.successful<Content, MediaViewerError>({
        selectedArchiveEntry,
        isArchiveEntryLoading: !selectedArchiveEntry.isDirectory,
        src,
        name: selectedArchiveEntry.name,
        isDirectory: selectedArchiveEntry.isDirectory,
      }),
    });
  };

  private onHeaderClicked = () => {
    // This will set the preview to show the Folder icon
    this.setState({
      content: Outcome.successful<Content, MediaViewerError>({
        ...this.state.content.data,
        selectedArchiveEntry: undefined,
      }),
    });
  };

  private renderArchiveItemViewer(content: Content) {
    const { src, name, isDirectory, isErrored, error } = content;
    let archiveItemViewer;

    if (isErrored) {
      return (
        <ArchiveItemViewerWrapper>
          {this.renderPreviewError(error)}
        </ArchiveItemViewerWrapper>
      );
    }

    if (!isDirectory) {
      if (!name || !src) {
        return (
          <ArchiveItemViewerWrapper>
            {this.renderPreviewError()}
          </ArchiveItemViewerWrapper>
        );
      }
      const mediaType = getMediaTypeFromFilename(name);
      switch (mediaType) {
        case 'image':
          archiveItemViewer = this.renderImage(src);
          break;
        case 'video':
          archiveItemViewer = this.renderVideo(src);
          break;
        case 'audio':
          archiveItemViewer = this.renderAudio(src);
          break;
        case 'doc':
          archiveItemViewer = this.renderDocument(src);
          break;
        case 'archive':
          archiveItemViewer = ''; //BMPT-388 - Add illustration here, currently empty viewer
          break;
        default:
          archiveItemViewer = this.renderPreviewError();
      }
    }
    return (
      <ArchiveItemViewerWrapper>{archiveItemViewer}</ArchiveItemViewerWrapper>
    );
  }

  private renderImage(src: string) {
    return <InteractiveImg src={src} />;
  }

  private renderVideo(src: string) {
    return (
      <CustomVideoPlayerWrapper data-testid="media-viewer-video-content">
        <CustomMediaPlayer type="video" isAutoPlay={false} src={src} />
      </CustomVideoPlayerWrapper>
    );
  }

  private renderAudio(src: string) {
    return (
      <AudioPlayer data-testid="media-viewer-audio-content">
        {this.renderAudioCover()}
        <CustomAudioPlayerWrapper>
          <CustomMediaPlayer type="audio" isAutoPlay={false} src={src} />
        </CustomAudioPlayerWrapper>
      </AudioPlayer>
    );
  }

  private renderAudioCover() {
    return (
      <DefaultCoverWrapper>
        <AudioIcon label="cover" size="xlarge" primaryColor={blanketColor} />
      </DefaultCoverWrapper>
    );
  }

  private renderDocument(src: string) {
    return <PDFRenderer src={src} />;
  }

  private renderPreviewError(thrownError: Error | null = null) {
    const errorName =
      thrownError && thrownError.message === ENCRYPTED_ENTRY_ERROR_MESSAGE
        ? 'encryptedEntryPreviewFailed'
        : 'previewFailed';
    const error = createError(errorName);

    return (
      <ErrorMessage error={error}>
        <p>
          <FormattedMessage {...messages.try_downloading_file} />
        </p>
      </ErrorMessage>
    );
  }
}
