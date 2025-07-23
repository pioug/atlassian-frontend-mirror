import { type Hooks, snapshotInformational, type SnapshotTestOptions } from '@af/visual-regression';

import Popup from '../../../examples/10-popup';

const variants: SnapshotTestOptions<Hooks>['variants'] = [
	{ name: 'Light', environment: { colorScheme: 'light' } },
];

snapshotInformational(Popup, {
	variants,
	drawsOutsideBounds: true,
	async prepare(page) {
		await page.getByRole('button', { name: 'Open Popup' }).click();
	},
});

snapshotInformational(Popup, {
	description: 'repositioning',
	variants,
	drawsOutsideBounds: true,
	async prepare(page) {
		await page.getByRole('button', { name: 'Open Popup' }).click();
		await page.getByRole('button', { name: 'Toggle Position' }).click();
	},
});
