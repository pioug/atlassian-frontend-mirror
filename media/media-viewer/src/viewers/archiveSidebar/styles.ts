import { css, keyframes } from '@emotion/react';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import { DN500 } from '@atlaskit/theme/colors';

export const ArchiveSideBarWidth = 300;

export const archiveItemViewerWrapperStyles = css`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const archiveSideBarStyles = css`
  padding: 22px 20px 20px 20px;
  background-color: ${token('elevation.surface', '#101214')};
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
  color: ${token('color.icon', '#9FADBC')};

  &:hover {
    cursor: pointer;
    background-color: ${token(
      'color.background.neutral.subtle.hovered',
      '#A1BDD914',
    )};
  }

  &:active {
    cursor: pointer;
    background-color: ${token(
      'color.background.neutral.subtle.pressed',
      '#A6C5E229',
    )};
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
  background-color: ${token('color.border', '#A6C5E229')};
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
  color: ${token('color.text', DN500)};
`;

export const itemStyle = {
  backgroundColor: `${token('color.background.neutral.subtle', '#101214')}`,
  fill: `${token('color.icon.success', '#101214')}`,
  color: `${token('color.text', DN500)}`,
  ':hover': {
    backgroundColor: `${token(
      'color.background.neutral.subtle.hovered',
      '#A1BDD914',
    )}`,
    color: `${token('color.text', DN500)}`,
  },
  ':active': {
    backgroundColor: `${token(
      'color.background.neutral.subtle.pressed',
      '#A6C5E229',
    )}`,
    color: `${token('color.text', DN500)}`,
  },
};
