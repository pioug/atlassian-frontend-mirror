import React from 'react';
import { ZipEntry } from 'unzipit';
import {
  ArchiveSidebarFolderWrapper,
  ArchiveSidebarFileEntryWrapper,
  ArchiveDownloadButtonWrapper,
  SidebarItemWrapper,
} from './styled';
import { Item } from '@atlaskit/navigation-next';
import Folder24Icon from '@atlaskit/icon-file-type/glyph/folder/24';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import { downloadUrl } from '@atlaskit/media-common';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import { MediaClient } from '@atlaskit/media-client';
import {
  getMediaTypeFromFilename,
  isMacPrivateFile,
  rejectAfter,
} from '../../utils';
import { ArchiveViewerError } from '../../errors';
export interface ArchiveSidebarFolderProps {
  root: string;
  entries: { [key: string]: ZipEntry };
  onEntrySelected: (selectedEntry: ZipEntry) => void;
  hideHeader?: boolean;
  name?: string;
  mediaClient: MediaClient;
  isArchiveEntryLoading: boolean;
  onError: (error: ArchiveViewerError, entry?: ZipEntry) => void;
}

export class ArchiveSidebarFolderEntry extends React.Component<
  ArchiveSidebarFolderProps
> {
  renderEntry = (entry: ZipEntry) => {
    const { root, onEntrySelected } = this.props;
    const onClick = () => onEntrySelected(entry);

    return (
      <ArchiveSidebarFileEntryWrapper key={entry.name}>
        <SidebarItemWrapper>
          <Item
            before={() => this.renderEntryIcon(entry)}
            text={this.formatName(root, entry.name)}
            spacing="compact"
            onClick={onClick}
          />
        </SidebarItemWrapper>
        {entry.isDirectory ? null : this.renderDownloadButton(entry, root)}
      </ArchiveSidebarFileEntryWrapper>
    );
  };

  private renderEntryIcon = (entry: ZipEntry) => {
    if (entry.isDirectory) {
      return <Folder24Icon label="Folder" />;
    }
    const mediaType = getMediaTypeFromFilename(entry.name);
    return <MediaTypeIcon type={mediaType} />;
  };

  private renderDownloadButton = (entry: ZipEntry, root: string) => {
    return (
      <ArchiveDownloadButtonWrapper
        onClick={() => this.downloadZipEntry(entry, root)}
      >
        <DownloadIcon label="Download" />
      </ArchiveDownloadButtonWrapper>
    );
  };

  private downloadZipEntry = async (entry: ZipEntry, root: string) => {
    try {
      const blob = await rejectAfter(() => entry.blob());
      const name = this.formatName(root, entry.name);
      downloadUrl(URL.createObjectURL(blob), { name });
    } catch (error) {
      this.props.onError(error, entry);
    }
  };

  private isDirectChild(root: string, entry: ZipEntry) {
    return (
      entry.name.startsWith(root) &&
      entry.name.replace(root, '').match(/^[^/]+\/?$/g)
    );
  }

  private formatName(root: string, name: string) {
    return name.replace(root, '');
  }

  render() {
    const { root, entries } = this.props;
    const entriesContent = Object.values(entries)
      .filter((entry) => this.isDirectChild(root, entry))
      .filter((entry) => !isMacPrivateFile(entry.name))
      .map(this.renderEntry);

    const archiveSidebarFolder = (
      <ArchiveSidebarFolderWrapper>
        {entriesContent}
      </ArchiveSidebarFolderWrapper>
    );
    return archiveSidebarFolder;
  }
}
