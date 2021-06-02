import React from 'react';
import { JsonLd } from 'json-ld-types';

import { FolderViewerContent } from './styled';

import {
  mapMimeTypeToIcon,
  folderIcon,
} from '../../../../popup/tools/mimeTypeToIcon';
import { SelectedItem } from '../../../../popup/domain';
import { getResourceUrl } from '../../../extractors';
import { File } from './file';
import { Folder } from './folder';

export interface FolderViewerProps {
  items: JsonLd.Collection;
  selectedItems: SelectedItem[];
  onFolderClick: (id: string) => void;
  onFileClick: (id: string) => void;
}

export const FolderViewer = ({
  items: { data },
  selectedItems,
  onFolderClick,
  onFileClick,
}: FolderViewerProps) => {
  if (!data || data.items.length === 0) {
    return null;
  }
  const items = [...data.items] as JsonLd.Data.Document[];

  return (
    <FolderViewerContent>
      {items.map((item, index) => {
        const icon = mapMimeTypeToIcon(item['schema:fileFormat'] || '');
        const url = getResourceUrl(item.url);
        const selectedIds = selectedItems.map((item) => item.id);
        const isSelected = url ? selectedIds.indexOf(url) > -1 : false;
        const key = item['@id'] || index;

        if (item['@type'] === 'Collection') {
          return (
            <Folder
              key={key}
              folder={item}
              icon={folderIcon}
              onClick={onFolderClick}
            />
          );
        } else {
          return (
            <File
              key={key}
              isSelected={isSelected}
              file={item}
              icon={icon}
              onClick={onFileClick}
            />
          );
        }
      })}
    </FolderViewerContent>
  );
};
