import { Device, type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import CompanyHubMockExample from '../../../../../examples/company-hub-mock';
import {
	AllSlots,
	AllSlotsBannerHeightZero,
	AllSlotsCustomSizes,
	AllSlotsRTL,
	AllSlotsScrollable,
	EdgeCaseSiblingAbsolutePositioned,
	EdgeCaseSiblingAbsolutePositionedCollapsed,
	EdgeCaseSiblingAbsolutePositionedCustomSizes,
	EdgeCaseSiblingAbsolutePositionedPanelVisible,
	EdgeCaseSiblingAbsolutePositionedResizable,
	EdgeCaseUsingLegacyVars,
	MainAside,
	MainAsideScrollable,
	Resizable,
	SideNavCustomWidthGreaterThanMaxWidth,
	SideNavCustomWidthSmallerThanMinWidth,
	SideNavMainAside,
	SideNavMainAsideScrollable,
	SideNavOverflowingChildren,
	SideNavWithMenuItems,
	TopBarSideNavMain,
	TopBarSideNavMainAside,
	TopBarSideNavMainAsideScrollable,
	TopBarSideNavMainScrollable,
} from '../../../../../examples/page-layout';
import AsideBorderExample from '../../../../../examples/page-layout-aside-border';
import PageLayoutImplicitRows from '../../../../../examples/page-layout-implicit-rows';
import {
	PanelAsideDefaultWidthsVR,
	PanelAsideZeroWidthsVR,
} from '../../../../../examples/page-layout-panel-aside-default-widths';
import { SideNavContentScrollWithStickyVR } from '../../../../../examples/page-layout-side-nav-content-scroll-with-sticky';
import SideNavSlotsExample from '../../../../../examples/page-layout-side-nav-slots';

const defaultOptions: SnapshotTestOptions<Hooks> = {
	drawsOutsideBounds: true,
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
		{
			device: Device.MOBILE_CHROME,
			environment: { colorScheme: 'light' },
			name: 'mobile',
		},
	],
};

// For scenarios that don't explicitly require mobile snapshots
const desktopOnly: SnapshotTestOptions<Hooks> = {
	drawsOutsideBounds: true,
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
	],
};

snapshot(AllSlots, {
	...defaultOptions,
	a11y: {
		/**
		 * This test applies opacity for debugging purposes, which fails color contrast checks.
		 * Because it's intentionally hacking things, and not representative of real usage, the a11y checking isn't valuable.
		 *
		 * I tried adding semi-transparent background colors instead of making the elements semi-transparent,
		 * but then we run into type errors with the colors not being tokens. We can ignore them but it adds noise for no real gain.
		 */
		skip: true,
	},
});

snapshot(AllSlotsRTL, defaultOptions);

snapshot(AllSlotsScrollable, defaultOptions);

snapshot(AllSlotsCustomSizes, defaultOptions);

snapshot(AllSlotsBannerHeightZero, defaultOptions);

snapshot(EdgeCaseSiblingAbsolutePositioned, {
	...defaultOptions,
	a11y: {
		/**
		 * This test applies opacity for debugging purposes, which fails color contrast checks.
		 * Because it's intentionally hacking things, and not representative of real usage, the a11y checking isn't valuable.
		 *
		 * I tried adding semi-transparent background colors instead of making the elements semi-transparent,
		 * but then we run into type errors with the colors not being tokens. We can ignore them but it adds noise for no real gain.
		 */
		skip: true,
	},
});

snapshot(EdgeCaseSiblingAbsolutePositionedCollapsed, {
	...defaultOptions,
	a11y: {
		/**
		 * This test applies opacity for debugging purposes, which fails color contrast checks.
		 * Because it's intentionally hacking things, and not representative of real usage, the a11y checking isn't valuable.
		 *
		 * I tried adding semi-transparent background colors instead of making the elements semi-transparent,
		 * but then we run into type errors with the colors not being tokens. We can ignore them but it adds noise for no real gain.
		 */
		skip: true,
	},
});

snapshot(EdgeCaseSiblingAbsolutePositionedPanelVisible, {
	...defaultOptions,
	a11y: {
		/**
		 * This test applies opacity for debugging purposes, which fails color contrast checks.
		 * Because it's intentionally hacking things, and not representative of real usage, the a11y checking isn't valuable.
		 *
		 * I tried adding semi-transparent background colors instead of making the elements semi-transparent,
		 * but then we run into type errors with the colors not being tokens. We can ignore them but it adds noise for no real gain.
		 */
		skip: true,
	},
});

snapshot(EdgeCaseSiblingAbsolutePositionedCustomSizes, {
	...defaultOptions,
	a11y: {
		/**
		 * This test applies opacity for debugging purposes, which fails color contrast checks.
		 * Because it's intentionally hacking things, and not representative of real usage, the a11y checking isn't valuable.
		 *
		 * I tried adding semi-transparent background colors instead of making the elements semi-transparent,
		 * but then we run into type errors with the colors not being tokens. We can ignore them but it adds noise for no real gain.
		 */
		skip: true,
	},
});

snapshot(EdgeCaseUsingLegacyVars, {
	...defaultOptions,
	a11y: {
		/**
		 * This test applies opacity for debugging purposes, which fails color contrast checks.
		 * Because it's intentionally hacking things, and not representative of real usage, the a11y checking isn't valuable.
		 *
		 * I tried adding semi-transparent background colors instead of making the elements semi-transparent,
		 * but then we run into type errors with the colors not being tokens. We can ignore them but it adds noise for no real gain.
		 */
		skip: true,
	},
});

snapshot(MainAside, defaultOptions);

snapshot(MainAsideScrollable, defaultOptions);

snapshot(SideNavMainAside, defaultOptions);

snapshot(SideNavMainAsideScrollable, defaultOptions);

snapshot(TopBarSideNavMain, defaultOptions);

snapshot(TopBarSideNavMainAside, defaultOptions);

snapshot(TopBarSideNavMainAsideScrollable, defaultOptions);

snapshot(TopBarSideNavMainScrollable, defaultOptions);

snapshot(Resizable, desktopOnly);

snapshot(SideNavCustomWidthGreaterThanMaxWidth, desktopOnly);

snapshot(SideNavCustomWidthSmallerThanMinWidth, desktopOnly);

snapshot(SideNavOverflowingChildren, desktopOnly);

snapshot(EdgeCaseSiblingAbsolutePositionedResizable, {
	...defaultOptions,
	a11y: {
		/**
		 * This test applies opacity for debugging purposes, which fails color contrast checks.
		 * Because it's intentionally hacking things, and not representative of real usage, the a11y checking isn't valuable.
		 *
		 * I tried adding semi-transparent background colors instead of making the elements semi-transparent,
		 * but then we run into type errors with the colors not being tokens. We can ignore them but it adds noise for no real gain.
		 */
		skip: true,
	},
});

snapshot(PageLayoutImplicitRows, {
	...defaultOptions,
	ignoredErrors: [
		{
			pattern: /Page Layout Error/,
			ignoredBecause: 'This is an expected dev time error',
			jiraIssueId: 'BLU-3024',
		},
	],
});

snapshot(SideNavWithMenuItems, defaultOptions);

snapshot(SideNavSlotsExample, {
	...desktopOnly,
	description: 'Side nav slots',
});

snapshot(SideNavContentScrollWithStickyVR, {
	...desktopOnly,
	description: 'Side nav content slot - scroll with sticky child',
});

snapshot(PanelAsideDefaultWidthsVR, {
	...defaultOptions,
	description: 'Panel and Aside - default widths',
});

snapshot(PanelAsideZeroWidthsVR, {
	...defaultOptions,
	description: 'Panel and Aside - zero widths',
});

snapshot(AsideBorderExample, {
	...defaultOptions,
	description: 'Aside composed with border',
});

snapshot(CompanyHubMockExample, {
	// On desktop the Panel max width is influenced by the SideNav width.
	// On mobile the Panel sizing is completely independent of the SideNav.
	...desktopOnly,
	description: 'Panel should have correct width when there is no SideNav mounted',
});

snapshot(CompanyHubMockExample, {
	variants: [
		/**
		 * Using dark mode because only dark mode has a difference between the elevation appearances.
		 *
		 * Not redundant because we're not taking any light mode snapshots.
		 */
		/* eslint-disable @atlaskit/design-system/no-dark-theme-vr-tests */
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'dark' },
			name: 'desktop',
		},
		{
			device: Device.MOBILE_CHROME,
			environment: { colorScheme: 'dark' },
			name: 'mobile',
		},
		/* eslint-enable @atlaskit/design-system/no-dark-theme-vr-tests */
	],
	featureFlags: {
		platform_design_system_nav4_panel_default_border: true,
	},
	description: 'Panel default background color',
});
