export interface UsePageLayoutResize {
  isLeftSidebarCollapsed: boolean;
  expandLeftSidebar: () => void;
  collapseLeftSidebar: () => void;
  setLeftSidebarWidth: (width: number) => void;
  getLeftSidebarWidth: () => number;
  getLeftPanelWidth: () => number;
}

export type SkipLinkContextProps = {
  skipLinksData: SkipLinkData[];
  registerSkipLink: (skipLinkDate: SkipLinkData) => void;
  unregisterSkipLink: (id: string | undefined) => void;
};

export type SkipLinkData = {
  id: string;
  skipLinkTitle: string;
};

export type SkipLinkI18n = {
  title: string;
};
