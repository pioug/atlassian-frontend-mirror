export interface UsePageLayoutResize {
  isLeftSidebarCollapsed: boolean;
  expandLeftSidebar: () => void;
  collapseLeftSidebar: () => void;
  setLeftSidebarWidth: (width: number) => void;
  getLeftSidebarWidth: () => number;
  getLeftPanelWidth: () => number;
}
