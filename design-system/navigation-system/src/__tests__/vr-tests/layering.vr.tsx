import { Device, type Hooks, snapshot } from '@af/visual-regression';
import type { SnapshotTestOptions } from '@atlassian/gemini';

import {
	ScrollableFixedNoPanelVR,
	ScrollableFixedVR,
	ScrollableNoPanelVR,
	ScrollableScrolledFixedVR,
	ScrollableScrolledVR,
	ScrollableVR,
	UnscrollableFixedVR,
	UnscrollableNoPanelFixedVR,
	UnscrollableNoPanelVR,
	UnscrollableVR,
} from '../../../examples/composition';

const defaultOptions: SnapshotTestOptions<Hooks> = {
	drawsOutsideBounds: true,
	variants: [
		{
			device: Device.MOBILE_CHROME,
			environment: { colorScheme: 'light' },
			name: 'mobile',
		},
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
		{
			device: Device.DESKTOP_CHROME_1920_1080,
			environment: { colorScheme: 'light' },
			name: 'desktop-large',
		},
	],
};

const panelSplitterHovered: SnapshotTestOptions<Hooks> = {
	// Panel spitter should be above all side nav elements but below any popups.
	drawsOutsideBounds: true,
	variants: [
		{
			device: Device.DESKTOP_CHROME_1920_1080,
			environment: { colorScheme: 'light' },
			name: 'desktop-large-splitter',
		},
	],
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'side-nav-panel-splitter',
			},
		},
	],
};

/**
 * Note on layered components such as dialogs.
 *
 * Layered components that are rendered inline (such as popup with shouldRenderToParent)
 * can be cut off if they bleed out of the container into the side nav. From my exploration
 * this isn't possible to resolve outside of:
 *
 * 1. Use portalled components
 * 2. Move to top layer when it becomes available in all the browsers we support
 *
 * Good luck out there!
 */
snapshot(ScrollableFixedVR, {
	...panelSplitterHovered,
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
	},
});
snapshot(ScrollableFixedVR, {
	...defaultOptions,
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
	},
});
snapshot(UnscrollableFixedVR, {
	...defaultOptions,
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
	},
});
snapshot(ScrollableFixedNoPanelVR, {
	...defaultOptions,
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
	},
});
snapshot(ScrollableScrolledFixedVR, {
	...defaultOptions,
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
	},
});
snapshot(UnscrollableNoPanelFixedVR, {
	...defaultOptions,
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
	},
});
snapshot(ScrollableVR, {
	...panelSplitterHovered,
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
	},
});
snapshot(ScrollableVR, {
	...defaultOptions,
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
	},
});
snapshot(UnscrollableVR, {
	...defaultOptions,
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
	},
});
snapshot(ScrollableNoPanelVR, {
	...defaultOptions,
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
	},
});
snapshot(ScrollableScrolledVR, {
	...defaultOptions,
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
	},
});
snapshot(UnscrollableNoPanelVR, {
	...defaultOptions,
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
	},
});

/**
 * Intentionally redeclaring these snapshots for `platform_dst_nav4_disable_is_fixed_prop` enabled,
 * because otherwise we end up with 40+ snapshots due to permutations.
 *
 * These 5 cover the VR changes introduced by the flag.
 *
 * TODO: remove these when `platform_dst_nav4_disable_is_fixed_prop` is cleaned up.
 */

snapshot(ScrollableVR, {
	description: 'scrollable with forced isFixed (temp)',
	drawsOutsideBounds: true,
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
	],
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
		platform_dst_nav4_disable_is_fixed_prop: true,
	},
});
snapshot(UnscrollableVR, {
	description: 'unscrollable with forced isFixed (temp)',
	drawsOutsideBounds: true,
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
	],
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
		platform_dst_nav4_disable_is_fixed_prop: true,
	},
});
snapshot(ScrollableNoPanelVR, {
	description: 'scrollable no panel with forced isFixed (temp)',
	drawsOutsideBounds: true,
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
	],
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
		platform_dst_nav4_disable_is_fixed_prop: true,
	},
});
snapshot(ScrollableScrolledVR, {
	description: 'scrollable scrolled with forced isFixed (temp)',
	drawsOutsideBounds: true,
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
	],
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
		platform_dst_nav4_disable_is_fixed_prop: true,
	},
});
snapshot(UnscrollableNoPanelVR, {
	description: 'unscrollable no panel with forced isFixed (temp)',
	drawsOutsideBounds: true,
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
	],
	featureFlags: {
		platform_dst_nav4_banner_default_height: true,
		platform_dst_nav4_disable_is_fixed_prop: true,
	},
});
