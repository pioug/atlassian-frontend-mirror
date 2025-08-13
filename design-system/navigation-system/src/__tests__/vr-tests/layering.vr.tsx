import { Device, type Hooks, snapshot } from '@af/visual-regression';
import type { SnapshotTestOptions } from '@atlassian/gemini';

import {
	ScrollableNoPanelVR,
	ScrollableScrolledVR,
	ScrollableVR,
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
snapshot(ScrollableVR, {
	...panelSplitterHovered,
});
snapshot(ScrollableVR, {
	...defaultOptions,
});
snapshot(UnscrollableVR, {
	...defaultOptions,
});
snapshot(ScrollableNoPanelVR, {
	...defaultOptions,
});
snapshot(ScrollableScrolledVR, {
	...defaultOptions,
});
snapshot(UnscrollableNoPanelVR, {
	...defaultOptions,
});
