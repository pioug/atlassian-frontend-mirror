import React from 'react';
import { type ZipEntry } from 'unzipit';

import { ButtonItem } from '@atlaskit/side-navigation';
import Folder24Icon from '@atlaskit/icon-file-type/glyph/folder/24';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import { downloadUrl } from '@atlaskit/media-common';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import { type MediaClient } from '@atlaskit/media-client';

import {
  ArchiveSidebarFolderWrapper,
  ArchiveSidebarFileEntryWrapper,
  ArchiveDownloadButtonWrapper,
  SidebarItemWrapper,
} from './styleWrappers';
import {
  getMediaTypeFromFilename,
  isMacPrivateFile,
  rejectAfter,
} from '../../utils';
import { type ArchiveViewerError } from '../../errors';
import { itemStyle } from './styles';

type Entries = { [key: string]: ZipEntry };

export interface ArchiveSidebarFolderProps {
  root: string;
  entries: Entries;
  onEntrySelected: (selectedEntry: ZipEntry) => void;
  hideHeader?: boolean;
  name?: string;
  mediaClient: MediaClient;
  isArchiveEntryLoading: boolean;
  onError: (error: ArchiveViewerError, entry?: ZipEntry) => void;
}

export class ArchiveSidebarFolderEntry extends React.Component<ArchiveSidebarFolderProps> {
  renderEntry = (entry: ZipEntry) => {
    const { root, onEntrySelected } = this.props;
    const onClick = () => onEntrySelected(entry);

    return (
      <ArchiveSidebarFileEntryWrapper key={entry.name} index={entry.name}>
        <SidebarItemWrapper>
          <ButtonItem
            iconBefore={this.renderEntryIcon(entry)}
            onClick={onClick}
            // eslint-disable-next-line @atlaskit/design-system/no-deprecated-apis
            cssFn={() => itemStyle}
          >
            {this.formatName(root, entry.name)}
          </ButtonItem>
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
      this.props.onError(error as ArchiveViewerError, entry);
    }
  };

  private formatName(root: string, name: string) {
    return name.replace(root, '');
  }

  private renderSidebarContent(root: string, entries: Entries) {
    const navItems = new Map<string, ZipEntry>();

    for (const value of Object.values(entries)) {
      const { name } = value;
      if (!name.startsWith(root) || isMacPrivateFile(name)) {
        continue;
      }

      const paths = name.replace(root, '').split('/').filter(Boolean);

      if (paths.length > 1) {
        if (!navItems.has(paths[0])) {
          navItems.set(paths[0], {
            name: `${root}${paths[0]}/`,
            isDirectory: true,
          } as ZipEntry);
        }
      } else if (paths.length === 1) {
        navItems.set(paths[0], value);
      }
    }

    return Array.from(navItems.values()).map(this.renderEntry);
  }

  render() {
    const { root, entries } = this.props;

    return (
      <ArchiveSidebarFolderWrapper>
        {this.renderSidebarContent(root, entries)}
      </ArchiveSidebarFolderWrapper>
    );
  }
}
