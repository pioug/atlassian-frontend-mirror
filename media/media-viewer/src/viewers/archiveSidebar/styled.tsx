import styled, { keyframes } from 'styled-components';

export const ArchiveSideBarWidth = 300;

export const ArchiveItemViewerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const ArchiveSideBar = styled.div`
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

export const ArchiveSidebarFolderWrapper = styled.div`
  transform: translateY(-100%);
  transition: all 1s;
  opacity: 0;
  animation: ${slideDown} 0.3s forwards;
`;

export const ArchiveDownloadButtonWrapper = styled.div`
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

export const SidebarItemWrapper = styled.div`
  width: 85%;
`;

export const ArchiveSidebarFileEntryWrapper = styled.div`
  padding-bottom: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
`;

export const ArchiveLayout = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const ArchiveViewerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: ${ArchiveSideBarWidth}px;
  right: 0;
  bottom: 0;
  align-items: center;
  display: flex;
`;
