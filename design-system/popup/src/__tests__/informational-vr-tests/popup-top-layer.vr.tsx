import { type Hooks, snapshotInformational, type SnapshotTestOptions } from '@af/visual-regression';

import Popup from '../../../examples/10-popup';
import PopupWithSelect from '../../../examples/15-popup-with-select';
import PopupRoleDialog from '../../../examples/19-popup-role-dialog';
import PopupCompositionTopLayer from '../../../examples/23-popup-composition-top-layer';

const topLayerFlag = {
	'platform-dst-top-layer': [true, false],
} as const;

const variants: SnapshotTestOptions<Hooks>['variants'] = [
	{ name: 'Light', environment: { colorScheme: 'light' } },
];

snapshotInformational(Popup, {
	description: 'default popup open',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	async prepare(page) {
		await page.getByRole('button', { name: 'Open Popup' }).click();
	},
});

snapshotInformational(Popup, {
	description: 'repositioned popup',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	async prepare(page) {
		await page.getByRole('button', { name: 'Open Popup' }).click();
		await page.getByRole('button', { name: 'Toggle Position' }).click();
	},
});

snapshotInformational(PopupWithSelect, {
	description: 'popup with select open',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	async prepare(page) {
		await page.getByRole('button', { name: 'Add' }).click();
	},
});

snapshotInformational(PopupRoleDialog, {
	description: 'popup with role dialog',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	async prepare(page) {
		await page.getByTestId('popup-trigger').click();
	},
});

/**
 * Regression test for:
 *  1. Anchor positioning: popup should appear next to the trigger.
 *  2. xcss styling: popup content should have correct custom padding and width.
 */
snapshotInformational(PopupCompositionTopLayer, {
	description: 'compositional popup anchored next to trigger with xcss styling',
	variants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	async prepare(page) {
		await page.getByTestId('popup-trigger').click();
	},
});
