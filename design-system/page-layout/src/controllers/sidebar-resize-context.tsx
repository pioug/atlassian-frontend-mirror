import { createContext, KeyboardEvent, MouseEvent, useContext } from 'react';

const noop = () => {};

export type LeftSidebarState = {
  isFlyoutOpen: boolean;
  isResizing: boolean;
  isLeftSidebarCollapsed: boolean;
  leftSidebarWidth: number;
  lastLeftSidebarWidth: number;
};
export type SidebarResizeContextValue = {
  isLeftSidebarCollapsed: boolean;
  expandLeftSidebar: () => void;
  collapseLeftSidebar: (
    event?: MouseEvent | KeyboardEvent,
    collapseWithoutTransition?: boolean,
  ) => void;
  leftSidebarState: LeftSidebarState;
  setLeftSidebarState: (leftSidebarState: LeftSidebarState) => void;
};

const leftSidebarState = {
  isFlyoutOpen: false,
  isResizing: false,
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
