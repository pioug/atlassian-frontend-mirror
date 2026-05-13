import { type Hooks, snapshotInformational, type SnapshotTestOptions } from '@af/visual-regression';

import Popup from '../../../examples/10-popup';
import PopupWithSelect from '../../../examples/15-popup-with-select';
import PopupRoleDialog from '../../../examples/19-popup-role-dialog';

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
