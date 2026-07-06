import { Device, snapshotInformational } from '@af/visual-regression';

import BasicDrawer from '../../../examples/02-drawer-default';
import Widths from '../../../examples/05-drawer-widths';
import StackedDrawers from '../../../examples/40-stacked-drawers';

// Always force the top-layer (`<dialog>`) path on. These are the permanent
// visual baselines for the top-layer drawer and survive flag cleanup. The
// legacy (Portal + Blanket) path keeps its own existing VR fixtures.
const topLayerOn = {
	'platform-dst-top-layer': true,
} as const;

// Basic open drawer (narrow) on desktop and mobile, verifying the edge-pinned
// full-height panel and the `::backdrop` blanket, and the `min(width, 100vw)`
// mobile clamp.
snapshotInformational(BasicDrawer, {
	description: 'basic drawer open',
	drawsOutsideBounds: true,
	featureFlags: topLayerOn,
	variants: [
		{ name: 'desktop', device: Device.DESKTOP_CHROME },
		{ name: 'mobile', device: Device.MOBILE_CHROME },
	],
	prepare: async (page) => {
		await page.getByTestId('drawer-trigger').click();
	},
});

// Wide width preset.
snapshotInformational(Widths, {
	description: 'wide drawer open',
	drawsOutsideBounds: true,
	featureFlags: topLayerOn,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open wide Drawer' }).click();
	},
});

// Full width preset (edge case: panel fills the viewport).
snapshotInformational(Widths, {
	description: 'full drawer open',
	drawsOutsideBounds: true,
	featureFlags: topLayerOn,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open full Drawer' }).click();
	},
});

// Stacked (nested) drawers: only the foreground `::backdrop` should be
// visible; the background drawer's backdrop is hidden via `shouldHideBackdrop`.
snapshotInformational(StackedDrawers, {
	description: 'stacked drawers open',
	drawsOutsideBounds: true,
	featureFlags: topLayerOn,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open drawer' }).click();
		await page.getByRole('button', { name: 'Open Nested drawer' }).click();
	},
});
