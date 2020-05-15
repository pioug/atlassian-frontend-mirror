import { createContext, useContext } from 'react';

const noop = () => {};

export type SidebarResizeContextValue = {
  isLeftSidebarCollapsed: boolean;
  expandLeftSidebar: () => void;
  collapseLeftSidebar: () => void;
  setLeftSidebarWidth: (w: number) => void;
  getLeftSidebarWidth: () => number;
  getLeftPanelWidth: () => number;
};

export const SidebarResizeContext = createContext<SidebarResizeContextValue>({
  isLeftSidebarCollapsed: false,
  expandLeftSidebar: noop,
  collapseLeftSidebar: noop,
  setLeftSidebarWidth: noop,
  getLeftSidebarWidth: () => 0,
  getLeftPanelWidth: () => 0,
});

export const usePageLayoutResize = () => {
  return useContext(SidebarResizeContext);
};
