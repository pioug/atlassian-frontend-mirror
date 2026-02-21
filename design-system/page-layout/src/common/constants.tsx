// dimension vars
export const VAR_LEFT_PANEL_WIDTH = 'leftPanelWidth';
export const VAR_LEFT_SIDEBAR_WIDTH = 'leftSidebarWidth';
export const VAR_RIGHT_SIDEBAR_WIDTH = 'rightSidebarWidth';
export const VAR_RIGHT_PANEL_WIDTH = 'rightPanelWidth';
export const VAR_TOP_NAVIGATION_HEIGHT = 'topNavigationHeight';
export const VAR_BANNER_HEIGHT = 'bannerHeight';
export const VAR_LEFT_SIDEBAR_FLYOUT = 'leftSidebarFlyoutWidth';

// Grid area names
export const LEFT_PANEL = 'left-panel';
export const RIGHT_PANEL = 'right-panel';
export const BANNER = 'banner';
export const TOP_NAVIGATION = 'top-navigation';
export const CONTENT = 'content';

// Default slot dimension values
export const DEFAULT_BANNER_HEIGHT = 56;
export const DEFAULT_TOP_NAVIGATION_HEIGHT = 56;
export const DEFAULT_LEFT_SIDEBAR_WIDTH = 240;
export const DEFAULT_RIGHT_SIDEBAR_WIDTH = 280;
export const DEFAULT_RIGHT_PANEL_WIDTH = 368;
export const DEFAULT_LEFT_PANEL_WIDTH = 368;

// Other constants
export const COLLAPSED_LEFT_SIDEBAR_WIDTH = 20;
export const MOBILE_COLLAPSED_LEFT_SIDEBAR_WIDTH = 16;
export const DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH = 240;
export const MIN_LEFT_SIDEBAR_DRAG_THRESHOLD = 200;
export const MAX_MOBILE_SIDEBAR_FLYOUT_WIDTH = 350;
export const TRANSITION_DURATION = 300;
export const FLYOUT_DELAY = 200;
export const PAGE_LAYOUT_LS_KEY = 'DS_PAGE_LAYOUT_UI_STATE';

// Data attributes
export const IS_SIDEBAR_DRAGGING = 'data-is-sidebar-dragging';
export const IS_SIDEBAR_COLLAPSING = 'data-is-sidebar-collapsing';
export const GRAB_AREA_LINE_SELECTOR = 'data-grab-area-line';
export const GRAB_AREA_SELECTOR = 'data-grab-area';
export const RESIZE_BUTTON_SELECTOR = 'data-resize-button';
export const RESIZE_CONTROL_SELECTOR = 'data-resize-control';
export const PAGE_LAYOUT_SLOT_SELECTOR = 'data-ds--page-layout--slot';

export const DEFAULT_I18N_PROPS_SKIP_LINKS = 'Skip to:';

export const PAGE_LAYOUT_CONTAINER_SELECTOR = 'data-layout-container';

export const LEFT_PANEL_WIDTH: 'var(--leftPanelWidth, 0px)' = `var(--${VAR_LEFT_PANEL_WIDTH}, 0px)`;
export const RIGHT_PANEL_WIDTH: 'var(--rightPanelWidth, 0px)' = `var(--${VAR_RIGHT_PANEL_WIDTH}, 0px)`;
export const LEFT_SIDEBAR_WIDTH: 'var(--leftSidebarWidth, 0px)' = `var(--${VAR_LEFT_SIDEBAR_WIDTH}, 0px)`;
export const RIGHT_SIDEBAR_WIDTH: 'var(--rightSidebarWidth, 0px)' = `var(--${VAR_RIGHT_SIDEBAR_WIDTH}, 0px)`;
export const TOP_NAVIGATION_HEIGHT: 'var(--topNavigationHeight, 0px)' = `var(--${VAR_TOP_NAVIGATION_HEIGHT}, 0px)`;
export const BANNER_HEIGHT: 'var(--bannerHeight, 0px)' = `var(--${VAR_BANNER_HEIGHT}, 0px)`;
export const LEFT_SIDEBAR_FLYOUT_WIDTH: 'var(--leftSidebarFlyoutWidth, 240px)' = `var(--${VAR_LEFT_SIDEBAR_FLYOUT}, ${DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}px)`;
