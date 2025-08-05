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
snapshot(ScrollableFixedVR, panelSplitterHovered);
snapshot(ScrollableFixedVR, defaultOptions);
snapshot(UnscrollableFixedVR, defaultOptions);
snapshot(ScrollableFixedNoPanelVR, defaultOptions);
snapshot(ScrollableScrolledFixedVR, defaultOptions);
snapshot(UnscrollableNoPanelFixedVR, defaultOptions);
snapshot(ScrollableVR, panelSplitterHovered);
snapshot(ScrollableVR, defaultOptions);
snapshot(UnscrollableVR, defaultOptions);
snapshot(ScrollableNoPanelVR, defaultOptions);
snapshot(ScrollableScrolledVR, defaultOptions);
snapshot(UnscrollableNoPanelVR, defaultOptions);

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
		platform_dst_nav4_disable_is_fixed_prop: true,
	},
});
