/** @jsx jsx */
import { ReactNode, MouseEvent, Key } from 'react';
import { jsx } from '@emotion/react';
import {
  archiveDownloadButtonWrapperStyles,
  archiveItemViewerWrapperStyles,
  archiveLayoutStyles,
  archiveSidebarFileEntryWrapperStyles,
  archiveSidebarFolderWrapperStyles,
  archiveSideBarStyles,
  archiveViewerWrapperStyles,
  separatorStyles,
  sidebarHeaderEntryStyles,
  sidebarHeaderIconStyles,
  sidebarHeaderWrapperStyles,
  sidebarItemWrapperStyles,
} from './styles';
import { TouchScrollable } from 'react-scrolllock';

type Children = {
  children?: ReactNode;
};
type OnClick = {
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
};

export const ArchiveItemViewerWrapper = ({ children }: Children) => {
  return <div css={archiveItemViewerWrapperStyles}>{children}</div>;
};

export const ArchiveSideBar = ({ children }: Children) => {
  return (
    <TouchScrollable>
      <div css={archiveSideBarStyles}>{children}</div>
    </TouchScrollable>
  );
};

export const ArchiveSidebarFolderWrapper = ({ children }: Children) => {
  return (
    <div
      css={archiveSidebarFolderWrapperStyles}
      data-testid="archive-sidebar-folder-wrapper"
    >
      {children}
    </div>
  );
};

export const ArchiveDownloadButtonWrapper = ({
  children,
  onClick,
}: Children & OnClick) => {
  return (
    <div css={archiveDownloadButtonWrapperStyles} onClick={onClick}>
      {children}
    </div>
  );
};

export const SidebarItemWrapper = ({ children }: Children) => {
  return <div css={sidebarItemWrapperStyles}>{children}</div>;
};

export const ArchiveSidebarFileEntryWrapper = ({
  children,
  index,
}: { index: Key } & Children) => {
  return (
    <div css={archiveSidebarFileEntryWrapperStyles} key={index}>
      {children}
    </div>
  );
};

export const ArchiveLayout = ({ children }: Children) => {
  return <div css={archiveLayoutStyles}>{children}</div>;
};

export const ArchiveViewerWrapper = ({ children }: Children) => {
  return <div css={archiveViewerWrapperStyles}>{children}</div>;
};

export const Separator = () => {
  return <div css={separatorStyles} />;
};

export const SidebarHeaderWrapper = ({ children }: Children) => {
  return <span css={sidebarHeaderWrapperStyles}>{children}</span>;
};

export const SidebarHeaderIcon = ({ children }: Children) => {
  return <div css={sidebarHeaderIconStyles}>{children}</div>;
};

export const SidebarHeaderEntry = ({ children }: Children) => {
  return <div css={sidebarHeaderEntryStyles}>{children}</div>;
};
