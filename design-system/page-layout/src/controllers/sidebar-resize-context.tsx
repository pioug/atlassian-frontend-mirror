import { createContext, useContext } from 'react';

const noop = () => {};

export type LeftSidebarState = {
  isFlyoutOpen: boolean;
  isLeftSidebarCollapsed: boolean;
  leftSidebarWidth: number;
  lastLeftSidebarWidth: number;
};
export type SidebarResizeContextValue = {
  isLeftSidebarCollapsed: boolean;
  expandLeftSidebar: () => void;
  collapseLeftSidebar: () => void;
  leftSidebarState: LeftSidebarState;
  setLeftSidebarState: (leftSidebarState: LeftSidebarState) => void;
};

const leftSidebarState = {
  isFlyoutOpen: false,
  isLeftSidebarCollapsed: false,
  leftSidebarWidth: 0,
  lastLeftSidebarWidth: 0,
};
export const SidebarResizeContext = createContext<SidebarResizeContextValue>({
  isLeftSidebarCollapsed: false,
  expandLeftSidebar: noop,
  collapseLeftSidebar: noop,
  leftSidebarState,
  setLeftSidebarState: noop,
});

export const usePageLayoutResize = () => {
  return useContext(SidebarResizeContext);
};
