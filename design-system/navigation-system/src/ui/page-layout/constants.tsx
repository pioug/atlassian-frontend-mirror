/**
 * These variables are shared across the different page layout slots.
 * This violates the [UI styling standard](https://atlassian.design/components/eslint-plugin-ui-styling-standard/no-imported-style-values/usage).
 * We have chosen to ignore this rule to prevent duplicating them across the different slots, and to provide a high level view of them and how they relate.
 */

// These are "compressed" to discourage usage.
export const sideNavVar = '--n_sNvw';
export const asideVar = '--n_asDw';
export const panelVar = '--n_pnlW';
export const bannerMountedVar = '--n_bnrM';
export const topNavMountedVar = '--n_tNvM';

/**
 * Captures the current width of the side navigation, at all times, including during resizing.
 *
 * The standard `sideNavVar` only captures the 'committed' width, not the resizing width.
 */
export const sideNavLiveWidthVar = '--n_sNvlw';

export const sideNavPanelSplitterId: unique symbol = Symbol('SideNav PanelSplitter');
export const asidePanelSplitterId: unique symbol = Symbol('Aside PanelSplitter');
export const panelPanelSplitterId: unique symbol = Symbol('Panel PanelSplitter');

// We aren't using template literals here because Compiled can't compiled them in platform ATM.
export const contentHeightWhenFixed = `calc(100vh - var(--n_bnrM, 0px) - var(--n_tNvM, 0px))`;
export const contentInsetBlockStart = `calc(var(--n_bnrM, 0px) + var(--n_tNvM, 0px))`;

// We define variables as they can change their size depending on the viewport width. That isn't needed for
// general grid item slots because, well, they just take up the size of the grid item! In this instance since
// the UNSAFE absolutely positioned sibling isn't on the grid it needs extra layout information.
// Note: THESE ARE THE SAME VALUES AS THE LEGACY PAGE LAYOUT.
// WHEN WE ELIMINATE USAGE OF THOSE VARIABLES THESE CAN BE RENAMED TO BE HASHED.
export const UNSAFE_topNavVar = '--topNavigationHeight';
export const UNSAFE_bannerVar = '--bannerHeight';
export const UNSAFE_sideNavLayoutVar = '--leftSidebarWidth';
export const UNSAFE_asideLayoutVar = '--rightSidebarWidth';
export const UNSAFE_panelLayoutVar = '--rightPanelWidth';

// The following UNSAFE variables are used to absolutely position elements that aren't a child of page layout.
// Known use cases: Legacy pages rendered inside Confluence and Jira.
export const UNSAFE_MAIN_BLOCK_START_FOR_LEGACY_PAGES_ONLY = `calc(var(${UNSAFE_bannerVar}, 0px) + var(${UNSAFE_topNavVar}, 0px))`;
export const UNSAFE_MAIN_INLINE_START_FOR_LEGACY_PAGES_ONLY = `var(${UNSAFE_sideNavLayoutVar}, 0px)`;
export const UNSAFE_MAIN_INLINE_END_FOR_LEGACY_PAGES_ONLY = `calc(var(${UNSAFE_asideLayoutVar}, 0px) + var(${UNSAFE_panelLayoutVar}, 0px))`;

/**
 * We define the z-indexes here so each page slot can be locally layered against each other.
 * For globally defined values such as flag, modal, etc, we can continue to
 * rely on accessing them through global means.
 */
export const localSlotLayers: {
	sideNavPanelSplitterFHS: number;
    topBar: number;
    banner: number;
    bannerFHS: number;
    topNavFHS: number;
    sideNav: number;
    panelSmallViewports: number;
} = {
	// The side nav panel splitter is layered above the top nav when FHS and 'platform-dst-side-nav-layering-fixes' is enabled.
	// It has the same z-index value, but is rendered after the top nav in the DOM so is stacked above.
	sideNavPanelSplitterFHS: 4,
	topBar: 4,
	banner: 4,
	// When FHS and 'platform-dst-side-nav-layering-fixes' is enabled, the side nav is layered below the top nav,
	// but above the panel
	bannerFHS: 3,
	topNavFHS: 3,
	sideNav: 2,
	panelSmallViewports: 1,
};

export const openLayerObserverSideNavNamespace = 'side-nav';
// We have separate OpenLayerObserver namespaces for each top nav layout area, instead of a single namespace for the entire top nav,
// as we need to know if there are open layers in TopNavStart specifically to prevent the side nav from peeking.
// The OpenLayerObserver doesn't support nested namespaces. We could update it, but for now it's simple enough to just have separate
// namespaces.
export const openLayerObserverTopNavStartNamespace = 'top-nav-start';
export const openLayerObserverTopNavMiddleNamespace = 'top-nav-middle';
export const openLayerObserverTopNavEndNamespace = 'top-nav-end';

/**
 * CSS scroll timeline variable for the side nav content scroll indicator.
 * The scroll timeline is created in SideNavContent, and then used by TopNavStart to apply the scroll indicator line.
 */
export const sideNavContentScrollTimelineVar = '--sNcst';
