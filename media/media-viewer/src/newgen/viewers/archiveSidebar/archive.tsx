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
import { Spinner } from '../../loading';
import {
  ENCRYPTED_ENTRY_ERROR_MESSAGE,
  NO_NAME_OR_SRC_ERROR_MESSAGE,
} from './consts';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  GasPayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { channel } from '../../analytics/index';
import { zipEntryLoadSucceededEvent } from '../../analytics/archive-viewer';

export type Props = {
  mediaClient: MediaClient;
  item: FileState;
  collectionName?: string;
  onZipFileLoadError: (error: Error) => void;
  onSuccess: () => void;
} & WithAnalyticsEventsProps;

export type Content = {
  src?: string;
  name?: string;
  isDirectory?: boolean;
  selectedArchiveEntry?: ZipEntry;
  isArchiveEntryLoading?: boolean;
  isErrored?: boolean;
  error?: Error;
  item?: FileState;
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

export class ArchiveViewerBase extends BaseViewer<Content, Props> {
  protected async init() {
    const content = Outcome.successful<Content, MediaViewerError>({
      src: '',
      name: '',
      isDirectory: true,
      isErrored: false,
      item: this.props.item,
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
        item: this.props.item,
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

  private onError = (error: Error, entry?: ZipEntry) => {
    !entry && this.props.onZipFileLoadError(error);

    this.setState({
      content: Outcome.successful<Content, MediaViewerError>({
        ...this.state.content.data,
        isArchiveEntryLoading: false,
        isErrored: true,
        selectedArchiveEntry: entry,
        error,
      }),
    });
  };

  private renderArchiveSideBar() {
    const { item, mediaClient, collectionName, onSuccess } = this.props;
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
        onSuccess={onSuccess}
      />
    );
  }

  private fireAnalytics = (payload: GasPayload | GasScreenEventPayload) => {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      const ev = createAnalyticsEvent(payload);
      ev.fire(channel);
    }
  };

  private onSelectedArchiveEntryChange = async (
    selectedArchiveEntry: ZipEntry,
  ) => {
    this.setState({
      content: Outcome.successful<Content, MediaViewerError>({
        ...this.state.content.data,
        isArchiveEntryLoading: true,
      }),
    });
    const fileState = this.state.content.data
      ? this.state.content.data.item
      : undefined;
    let src = '';
    if (!selectedArchiveEntry.isDirectory) {
      try {
        src = URL.createObjectURL(
          await rejectAfter(() => selectedArchiveEntry.blob()),
        );
        this.fireAnalytics(
          zipEntryLoadSucceededEvent(selectedArchiveEntry, fileState),
        );
      } catch (error) {
        return this.onError(error, selectedArchiveEntry);
      }
    }

    this.setState({
      content: Outcome.successful<Content, MediaViewerError>({
        ...this.state.content.data,
        selectedArchiveEntry,
        isArchiveEntryLoading: false,
        src,
        name: selectedArchiveEntry.name,
        isDirectory: selectedArchiveEntry.isDirectory,
        isErrored: false,
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
    const {
      src,
      name,
      isDirectory,
      isErrored,
      error,
      isArchiveEntryLoading,
      selectedArchiveEntry,
      item,
    } = content;
    let archiveItemViewer;

    if (isArchiveEntryLoading) {
      return (
        <ArchiveItemViewerWrapper>
          <Spinner />
        </ArchiveItemViewerWrapper>
      );
    }

    if (isErrored) {
      return (
        <ArchiveItemViewerWrapper>
          {this.renderPreviewError(error, selectedArchiveEntry, item)}
        </ArchiveItemViewerWrapper>
      );
    }

    if (!isDirectory) {
      if (!name || !src) {
        return (
          <ArchiveItemViewerWrapper>
            {this.renderPreviewError(
              new Error(NO_NAME_OR_SRC_ERROR_MESSAGE),
              selectedArchiveEntry,
              item,
            )}
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

  private renderPreviewError(
    thrownError?: Error,
    entry?: ZipEntry,
    item?: FileState,
  ) {
    const errorName =
      thrownError && thrownError.message === ENCRYPTED_ENTRY_ERROR_MESSAGE
        ? 'encryptedEntryPreviewFailed'
        : 'previewFailed';
    const error = createError(errorName, thrownError, item, entry);
    return (
      <ErrorMessage error={error}>
        <p>
          <FormattedMessage {...messages.try_downloading_file} />
        </p>
      </ErrorMessage>
    );
  }
}

export const ArchiveViewer = withAnalyticsEvents()(ArchiveViewerBase);
