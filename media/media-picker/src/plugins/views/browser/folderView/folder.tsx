import React from 'react';
import { JsonLd } from 'json-ld-types';
import {
  FolderViewerRow,
  FileMetadataGroup,
  FileIcon,
  FileName,
} from './styled';
import { getResourceUrl } from '../../../extractors';

export interface FolderProps {
  folder: JsonLd.Data.Document;
  icon: JSX.Element;
  onClick: (id: string) => void;
}

export const Folder = ({ folder, icon, onClick }: FolderProps) => {
  const url = getResourceUrl(folder.url);
  return (
    <FolderViewerRow onClick={() => url && onClick(url)} key={url}>
      <FileMetadataGroup>
        <FileIcon>{icon}</FileIcon>
        <FileName>{folder.name}</FileName>
      </FileMetadataGroup>
    </FolderViewerRow>
  );
};
