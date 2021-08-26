import React from 'react';
import { ZipEntry, ZipInfo, unzip } from 'unzipit';
import { ArchiveSideBar } from './styled';
import {
  ArchiveSidebarFolderEntry,
  ArchiveSidebarFolderProps,
} from './archive-sidebar-folder-entry';
import { Separator } from '@atlaskit/navigation-next';
// TODO [BMPT-370] remove usage of navigation-next
import { MediaClient } from '@atlaskit/media-client';
import { ArchiveSidebarHeader } from './archive-sidebar-header';
import {
  getMediaTypeFromFilename,
  getFolderParent,
  extractArchiveFolderName,
  rejectAfter,
} from '../../utils';
import { ArchiveViewerError } from '../../errors';

export interface ArchiveSidebarProps {
  entries: { [key: string]: ZipEntry };
  onEntrySelected: (selectedEntry: ZipEntry) => void;
  mediaClient: MediaClient;
  onHeaderClicked: () => void;
  isArchiveEntryLoading: boolean;
  onError: (error: ArchiveViewerError, entry?: ZipEntry) => void;
}

export type ArchiveSidebarState = {
  currentArchiveSidebarFolder: ArchiveSidebarFolderProps;
};

export class ArchiveSidebar extends React.Component<
  ArchiveSidebarProps,
  ArchiveSidebarState
> {
  constructor(props: ArchiveSidebarProps) {
    super(props);
    const { isArchiveEntryLoading, entries, mediaClient, onError } = props;
    this.state = {
      currentArchiveSidebarFolder: {
        isArchiveEntryLoading,
        root: '',
        name: '/',
        entries,
        onEntrySelected: this.onEntrySelected,
        hideHeader: true,
        mediaClient,
        onError,
      },
    };
  }

  private getArchiveFromEntry = async (entry: ZipEntry): Promise<ZipInfo> => {
    const blob = await rejectAfter(() => entry.blob());
    const archive = await rejectAfter(() => unzip(blob));

    Object.values(archive.entries).forEach((zipEntry) => {
      zipEntry.name =
        this.state.currentArchiveSidebarFolder.name + zipEntry.name;
    });
    return archive;
  };

  private onEntrySelected = async (entry: ZipEntry) => {
    const { onEntrySelected } = this.props;
    if (!entry.isDirectory) {
      onEntrySelected(entry);
    }

    const isArchive =
      !entry.isDirectory && getMediaTypeFromFilename(entry.name) === 'archive';

    try {
      isArchive || entry.isDirectory
        ? await this.onFolderEntrySelected(entry, isArchive)
        : null;
    } catch (error) {
      return this.props.onError(error, entry);
    }
  };

  private onFolderEntrySelected = async (
    folder: ZipEntry,
    isArchive: boolean,
  ) => {
    let { entries, mediaClient } = this.props;
    let folderName: string | undefined;
    if (isArchive) {
      const archiveEntries = (await this.getArchiveFromEntry(folder)).entries;
      entries = { ...entries, ...archiveEntries };
      folderName = extractArchiveFolderName(folder.name);
    }
    const { isArchiveEntryLoading, onError } = this.props;
    const currentFolderName = folderName || folder.name;
    this.setState({
      currentArchiveSidebarFolder: {
        isArchiveEntryLoading,
        root: currentFolderName,
        name: currentFolderName,
        entries,
        onEntrySelected: this.onEntrySelected,
        mediaClient,
        onError,
      },
    });
  };

  private onHeaderClicked = () => {
    const {
      entries,
      mediaClient,
      onHeaderClicked,
      isArchiveEntryLoading,
      onError,
    } = this.props;

    const folderParent = getFolderParent(
      this.state.currentArchiveSidebarFolder.root,
    );

    this.setState({
      currentArchiveSidebarFolder: {
        isArchiveEntryLoading,
        root: folderParent,
        name: folderParent,
        entries,
        onEntrySelected: this.onEntrySelected,
        mediaClient,
        onError,
      },
    });

    // This sets the preview to the Folder icon
    onHeaderClicked();
  };

  render() {
    const { currentArchiveSidebarFolder } = this.state;
    const { onError } = this.props;

    return (
      <ArchiveSideBar>
        <ArchiveSidebarHeader
          folderName={currentArchiveSidebarFolder.root}
          onHeaderClick={this.onHeaderClicked}
        />
        <Separator />
        <ArchiveSidebarFolderEntry
          {...currentArchiveSidebarFolder}
          onError={onError}
        />
      </ArchiveSideBar>
    );
  }
}
