import React from 'react';
import { JsonLd } from 'json-ld-types';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';

import filesize from 'filesize';
import {
  FolderViewerRow,
  FileMetadataGroup,
  FileIcon,
  FileName,
  FileCreateDate,
  FileSize,
  SelectedFileIconWrapper,
} from './styled';
import { getResourceUrl, getDateString } from '../../../extractors';

export interface FileProps {
  isSelected: boolean;
  file: JsonLd.Data.Document;
  icon: JSX.Element;
  onClick: (id: string) => void;
}

export const fileSelected = (
  <SelectedFileIconWrapper>
    <CheckCircleIcon label="check" />
  </SelectedFileIconWrapper>
);

export const File = ({ isSelected, file, icon, onClick }: FileProps) => {
  const url = getResourceUrl(file.url);
  const dateCreated = file['schema:dateCreated'];
  const fileSize =
    file['atlassian:fileSize'] && filesize(file['atlassian:fileSize']);
  return (
    <FolderViewerRow
      isSelected={isSelected}
      onClick={() => {
        url && onClick(url);
      }}
      key={url}
    >
      <FileMetadataGroup>
        <FileIcon>{icon}</FileIcon>
        <FileName isSelected={isSelected}>{file.name}</FileName>
      </FileMetadataGroup>
      {isSelected ? (
        fileSelected
      ) : (
        <FileMetadataGroup>
          <FileCreateDate>{getDateString(dateCreated)}</FileCreateDate>
          <FileSize>{fileSize}</FileSize>
        </FileMetadataGroup>
      )}
    </FolderViewerRow>
  );
};
