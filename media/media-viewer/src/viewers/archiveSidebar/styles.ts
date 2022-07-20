import { css, keyframes } from '@emotion/react';
import { gridSize } from '@atlaskit/theme/constants';
import { DN10, DN500 } from '@atlaskit/theme/colors';

export const ArchiveSideBarWidth = 300;

export const archiveItemViewerWrapperStyles = css`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const archiveSideBarStyles = css`
  padding: 22px 20px 20px 20px;
  /** TODO [BMPT-370] Use new bg color after ThemeProvider is removed */
  background-color: rgba(14, 22, 36);
  position: absolute;
  left: 0;
  top: 0;
  width: ${ArchiveSideBarWidth}px;
  bottom: 0;
  box-sizing: border-box;
  overflow-y: scroll;
`;

const slideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const archiveSidebarFolderWrapperStyles = css`
  transform: translateY(-100%);
  transition: all 1s;
  opacity: 0;
  animation: ${slideDown} 0.3s forwards;
`;

export const archiveDownloadButtonWrapperStyles = css`
  padding: 8px 7px 5px 8px;
  border: none;
  border-radius: 3px;
  background-color: transparent;

  &:hover {
    cursor: pointer;
    background-color: #253a5f;
    /** TODO [BMPT-370] Use new color after ThemeProvider is removed */
  }
`;

export const sidebarItemWrapperStyles = css`
  width: 85%;
`;

export const archiveSidebarFileEntryWrapperStyles = css`
  padding-bottom: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
`;

export const archiveLayoutStyles = css`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const archiveViewerWrapperStyles = css`
  position: absolute;
  top: 0;
  left: ${ArchiveSideBarWidth}px;
  right: 0;
  bottom: 0;
  align-items: center;
  display: flex;
`;
export const separatorStyles = css`
  border-radius: 1px;
  height: 2px;
  margin: ${(gridSize() * 5 - 2) / 2}px 0;
  background-color: rgb(36, 50, 76);
  flex-shrink: 0;
`;

export const sidebarHeaderWrapperStyles = css`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const sidebarHeaderIconStyles = css`
  display: flex;
  align-items: center;
  margin-right: 10px;
  flex-shrink: 0;
`;

export const sidebarHeaderEntryStyles = css`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.14286;
  color: ${DN500};
`;

/** TODO Replace background colors of item with theme from @atlaskit/tokens once ready*/
export const itemStyle = {
  backgroundColor: `${DN10}`,
  fill: `${DN10}`,
  color: `${DN500}`,
  ':hover': {
    backgroundColor: '#253a5f',
    color: `${DN500}`,
  },
};
