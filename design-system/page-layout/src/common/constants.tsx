// dimension vars
export const VAR_LEFT_PANEL_WIDTH = 'leftPanelWidth';
export const VAR_LEFT_SIDEBAR_WIDTH = 'leftSidebarWidth';
export const VAR_RIGHT_SIDEBAR_WIDTH = 'rightSidebarWidth';
export const VAR_RIGHT_PANEL_WIDTH = 'rightPanelWidth';
export const VAR_TOP_NAVIGATION_HEIGHT = 'topNavigationHeight';
export const VAR_BANNER_HEIGHT = 'bannerHeight';
export const VAR_LEFT_SIDEBAR_FLYOUT = 'leftSidebarFlyoutWidth';

export const DIMENSIONS = [
  VAR_LEFT_PANEL_WIDTH,
  VAR_RIGHT_PANEL_WIDTH,
  VAR_BANNER_HEIGHT,
  VAR_TOP_NAVIGATION_HEIGHT,
  VAR_LEFT_SIDEBAR_WIDTH,
  VAR_RIGHT_SIDEBAR_WIDTH,
];

// Grid area names
export const LEFT_PANEL = 'left-panel';
export const RIGHT_PANEL = 'right-panel';
export const BANNER = 'banner';
export const TOP_NAVIGATION = 'top-navigation';
export const CONTENT = 'content';
export const MAIN = 'main';
export const LEFT_SIDEBAR = 'left-sidebar';
export const RIGHT_SIDEBAR = 'right-sidebar';

// Default slot dimension values
export const DEFAULT_BANNER_HEIGHT = 56;
export const DEFAULT_TOP_NAVIGATION_HEIGHT = 56;
export const DEFAULT_LEFT_SIDEBAR_WIDTH = 240;
export const DEFAULT_RIGHT_SIDEBAR_WIDTH = 280;
export const DEFAULT_RIGHT_PANEL_WIDTH = 368;
export const DEFAULT_LEFT_PANEL_WIDTH = 368;

// Other constants
export const COLLAPSED_LEFT_SIDEBAR_WIDTH = 20;
export const MIN_LEFT_SIDEBAR_WIDTH = 80;
export const DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH = 240;
export const MIN_LEFT_SIDEBAR_DRAG_THRESHOLD = 200;
export const TRANSITION_DURATION = 300;
export const FLYOUT_DELAY = 200;
export const LEFT_SIDEBAR_EXPANDED_WIDTH = 'expandedLeftSidebarWidth';
export const PAGE_LAYOUT_LS_KEY = 'DS_PAGE_LAYOUT_UI_STATE';

// Data attributes
export const IS_SIDEBAR_DRAGGING = 'data-is-sidebar-dragging';
export const IS_SIDEBAR_COLLAPSING = 'data-is-sidebar-collapsing';
export const IS_FLYOUT_OPEN = 'data-is-flyout-open';
export const GRAB_AREA_LINE_SELECTOR = 'data-grab-area-line';
export const GRAB_AREA_SELECTOR = 'data-grab-area';
export const RESIZE_BUTTON_SELECTOR = 'data-resize-button';
export const RESIZE_CONTROL_SELECTOR = 'data-resize-control';
export const PAGE_LAYOUT_SLOT_SELECTOR = 'data-ds--page-layout--slot';

export const DEFAULT_I18N_PROPS_SKIP_LINKS = 'Skip to:';

export const PAGE_LAYOUT_CONTAINER_SELECTOR = 'data-layout-container';

export const LEFT_PANEL_WIDTH = `var(--${VAR_LEFT_PANEL_WIDTH}, 0px)`;
export const RIGHT_PANEL_WIDTH = `var(--${VAR_RIGHT_PANEL_WIDTH}, 0px)`;
export const LEFT_SIDEBAR_WIDTH = `var(--${VAR_LEFT_SIDEBAR_WIDTH}, 0px)`;
export const RIGHT_SIDEBAR_WIDTH = `var(--${VAR_RIGHT_SIDEBAR_WIDTH}, 0px)`;
export const TOP_NAVIGATION_HEIGHT = `var(--${VAR_TOP_NAVIGATION_HEIGHT}, 0px)`;
export const BANNER_HEIGHT = `var(--${VAR_BANNER_HEIGHT}, 0px)`;
export const LEFT_SIDEBAR_FLYOUT_WIDTH = `var(--${VAR_LEFT_SIDEBAR_FLYOUT}, ${DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}px)`;
