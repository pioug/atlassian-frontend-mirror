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
import ErrorMessage from '../../errorMessage';
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
import { getMediaTypeFromFilename, rejectAfter } from '../../utils';
import { Spinner } from '../../loading';
import { ENCRYPTED_ENTRY_ERROR_MESSAGE } from './consts';
import { ArchiveViewerProps } from './types';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { fireAnalytics } from '../../analytics';
import {
  ArchiveViewerErrorReason,
  ArchiveViewerError,
  isMediaViewerError,
} from '../../errors';
import { createZipEntryLoadSucceededEvent } from '../../analytics/events/operational/zipEntryLoadSucceeded';
import { createZipEntryLoadFailedEvent } from '../../analytics/events/operational/zipEntryLoadFailed';

export type Props = ArchiveViewerProps & WithAnalyticsEventsProps;

export type Content = {
  src?: string;
  name?: string;
  isDirectory?: boolean;
  selectedArchiveEntry?: ZipEntry;
  hasLoadedEntries?: boolean;
  error?: ArchiveViewerError;
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
    this.setState(this.initialState);
  }

  protected get initialState() {
    return {
      content: Outcome.successful<Content, ArchiveViewerError>({
        src: '',
        name: '',
        isDirectory: true,
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

  private onError = (error: ArchiveViewerError, entry?: ZipEntry) => {
    this.props.onError(error);

    this.setState({
      content: Outcome.successful<Content, ArchiveViewerError>({
        ...this.state.content.data,
        selectedArchiveEntry: entry,
        error,
      }),
    });
  };

  private onSelectedArchiveEntryChange = async (
    selectedArchiveEntry: ZipEntry,
  ) => {
    this.setState({
      content: Outcome.successful<Content, ArchiveViewerError>({
        ...this.state.content.data,
        selectedArchiveEntry: undefined,
      }),
    });
    let src = '';
    if (!selectedArchiveEntry.isDirectory) {
      try {
        src = URL.createObjectURL(
          await rejectAfter(() => selectedArchiveEntry.blob()),
        );
      } catch (error) {
        return this.onError(
          new ArchiveViewerError(
            error.message === ENCRYPTED_ENTRY_ERROR_MESSAGE
              ? 'archiveviewer-encrypted-entry'
              : 'archiveviewer-create-url',
            error,
          ),
          selectedArchiveEntry,
        );
      }
    }

    this.setState({
      content: Outcome.successful<Content, ArchiveViewerError>({
        ...this.state.content.data,
        selectedArchiveEntry,
        src,
        name: selectedArchiveEntry.name,
        isDirectory: selectedArchiveEntry.isDirectory,
        error: undefined,
      }),
    });
  };

  private onHeaderClicked = () => {
    // This will set the preview to show the Folder icon
    this.setState({
      content: Outcome.successful<Content, ArchiveViewerError>({
        ...this.state.content.data,
      }),
    });
  };

  private onViewerLoad = (selectedArchiveEntry: ZipEntry) => () => {
    fireAnalytics(
      createZipEntryLoadSucceededEvent(this.props.item, selectedArchiveEntry),
      this.props,
    );
  };

  private onViewerError = (
    primaryErrorReason: ArchiveViewerErrorReason,
    selectedArchiveEntry: ZipEntry,
  ) => (error?: Error) =>
    error && isMediaViewerError(error)
      ? this.onError(
          new ArchiveViewerError(
            primaryErrorReason,
            error.secondaryError,
            selectedArchiveEntry,
          ),
        )
      : this.onError(
          new ArchiveViewerError(
            primaryErrorReason,
            error,
            selectedArchiveEntry,
          ),
        );

  private onSidebarLoaded = () => {
    this.setState({
      content: Outcome.successful<Content, ArchiveViewerError>({
        ...this.state.content.data,
        hasLoadedEntries: true,
      }),
    });
    this.props.onSuccess();
  };

  protected renderSuccessful(content: Content) {
    const { item, mediaClient, collectionName } = this.props;
    const { selectedArchiveEntry, hasLoadedEntries } = content;
    const hasSelectedArchiveEntry = selectedArchiveEntry !== undefined;

    return (
      <ArchiveLayout>
        <ArchiveSidebarRenderer
          selectedFileState={item}
          mediaClient={mediaClient}
          onSelectedArchiveEntryChange={this.onSelectedArchiveEntryChange}
          onHeaderClicked={this.onHeaderClicked}
          isArchiveEntryLoading={!hasSelectedArchiveEntry}
          collectionName={collectionName}
          onError={this.onError}
          onSuccess={this.onSidebarLoaded}
        />
        <ArchiveViewerWrapper>
          {!hasSelectedArchiveEntry && !hasLoadedEntries ? (
            <ArchiveViewerWrapper>
              <Spinner />
            </ArchiveViewerWrapper>
          ) : (
            this.renderArchiveItemViewer(content)
          )}
        </ArchiveViewerWrapper>
      </ArchiveLayout>
    );
  }

  private renderArchiveItemViewer(content: Content) {
    const { item } = this.props;
    const { src, name, isDirectory, error, selectedArchiveEntry } = content;

    if (error) {
      return this.renderPreviewError(error, selectedArchiveEntry);
    }

    if (!isDirectory && selectedArchiveEntry) {
      if (!name || !src) {
        return this.renderPreviewError(
          new ArchiveViewerError('archiveviewer-missing-name-src'),
          selectedArchiveEntry,
        );
      }

      const mediaType = getMediaTypeFromFilename(name);
      switch (mediaType) {
        case 'image':
          return (
            <ArchiveItemViewerWrapper>
              <InteractiveImg
                src={src}
                onLoad={this.onViewerLoad(selectedArchiveEntry)}
                onError={this.onViewerError(
                  'archiveviewer-imageviewer-onerror',
                  selectedArchiveEntry,
                )}
              />
            </ArchiveItemViewerWrapper>
          );
        case 'video':
          return (
            <ArchiveItemViewerWrapper>
              <CustomVideoPlayerWrapper data-testid="media-viewer-video-content">
                <CustomMediaPlayer
                  type="video"
                  isAutoPlay={false}
                  src={src}
                  onCanPlay={this.onViewerLoad(selectedArchiveEntry)}
                  onError={this.onViewerError(
                    'archiveviewer-videoviewer-onerror',
                    selectedArchiveEntry,
                  )}
                />
              </CustomVideoPlayerWrapper>
            </ArchiveItemViewerWrapper>
          );
        case 'audio':
          return (
            <ArchiveItemViewerWrapper>
              <AudioPlayer data-testid="media-viewer-audio-content">
                <DefaultCoverWrapper>
                  <AudioIcon
                    label="cover"
                    size="xlarge"
                    primaryColor={blanketColor}
                  />
                </DefaultCoverWrapper>
                <CustomAudioPlayerWrapper>
                  <CustomMediaPlayer
                    type="audio"
                    isAutoPlay={false}
                    src={src}
                    onCanPlay={this.onViewerLoad(selectedArchiveEntry)}
                    onError={this.onViewerError(
                      'archiveviewer-audioviewer-onerror',
                      selectedArchiveEntry,
                    )}
                  />
                </CustomAudioPlayerWrapper>
              </AudioPlayer>
            </ArchiveItemViewerWrapper>
          );
        case 'doc':
          return (
            <ArchiveItemViewerWrapper>
              <PDFRenderer
                item={item}
                src={src}
                onSuccess={this.onViewerLoad(selectedArchiveEntry)}
                onError={this.onViewerError(
                  'archiveviewer-docviewer-onerror',
                  selectedArchiveEntry,
                )}
              />
            </ArchiveItemViewerWrapper>
          );
        case 'archive':
          //BMPT-388 - Add illustration here, currently empty viewer
          return <ArchiveItemViewerWrapper></ArchiveItemViewerWrapper>;
        default:
          return this.renderPreviewError(
            new ArchiveViewerError('archiveviewer-unsupported'),
            selectedArchiveEntry,
          );
      }
    }
  }

  private renderPreviewError(error: ArchiveViewerError, entry?: ZipEntry) {
    const { item } = this.props;

    fireAnalytics(
      createZipEntryLoadFailedEvent(this.props.item, error, entry),
      this.props,
    );

    return (
      <ErrorMessage
        fileId={item.id}
        fileState={item}
        error={error}
        supressAnalytics={true}
      >
        <p>
          <FormattedMessage {...messages.try_downloading_file} />
        </p>
      </ErrorMessage>
    );
  }
}

export const ArchiveViewer = withAnalyticsEvents()(ArchiveViewerBase);
