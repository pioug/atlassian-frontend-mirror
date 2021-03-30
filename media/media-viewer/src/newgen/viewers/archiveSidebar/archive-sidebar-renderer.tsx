import React from 'react';
import { Component } from 'react';
import { MediaClient, FileState } from '@atlaskit/media-client';
import { SpinnerWrapper } from '../../styled';
import { ArchiveSidebar } from './archive-sidebar';
import { getArchiveEntriesFromFileState } from './archive';
import { Spinner } from '../../loading';
import { ArchiveViewerError } from '../../errors';
import { ArchiveSideBar } from './styled';
import { ZipEntry } from 'unzipit';
import { ThemeProvider, dark } from '@atlaskit/navigation-next';

export interface ArchiveSidebarRendererProps {
  selectedFileState: FileState;
  mediaClient: MediaClient;
  onSelectedArchiveEntryChange: (archiveEntry: ZipEntry) => void;
  onHeaderClicked: () => void;
  isArchiveEntryLoading: boolean;
  collectionName?: string;
  onError: (error: ArchiveViewerError, entry?: ZipEntry) => void;
  onSuccess: () => void;
}

interface ArchiveSidebarRendererState {
  entries: { [key: string]: ZipEntry };
  status: 'loading' | 'loaded';
}

export default class ArchiveSidebarRenderer extends Component<
  ArchiveSidebarRendererProps,
  ArchiveSidebarRendererState
> {
  state: ArchiveSidebarRendererState = {
    entries: {},
    status: 'loading',
  };

  async componentDidMount() {
    const {
      selectedFileState,
      mediaClient,
      collectionName,
      onError,
      onSuccess,
    } = this.props;

    try {
      const archive = await getArchiveEntriesFromFileState(
        selectedFileState,
        mediaClient,
        collectionName,
      );
      const entries = archive.entries;
      this.setState({ entries, status: 'loaded' });
      onSuccess();
    } catch (error) {
      this.setState({ status: 'loaded' });
      onError(new ArchiveViewerError('archiveviewer-read-binary', error));
    }
  }

  render() {
    const { entries, status } = this.state;
    const {
      mediaClient,
      onHeaderClicked,
      isArchiveEntryLoading,
      onSelectedArchiveEntryChange,
      onError,
    } = this.props;
    return (
      <ThemeProvider
        theme={{
          context: 'product',
          mode: dark,
        }}
      >
        {(status === 'loading' && (
          <ArchiveSideBar>
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
          </ArchiveSideBar>
        )) || (
          <ArchiveSidebar
            entries={entries}
            onEntrySelected={onSelectedArchiveEntryChange}
            onHeaderClicked={onHeaderClicked}
            mediaClient={mediaClient}
            isArchiveEntryLoading={isArchiveEntryLoading}
            onError={onError}
          />
        )}
      </ThemeProvider>
    );
  }
}
