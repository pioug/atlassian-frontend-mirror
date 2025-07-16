import { type Hooks, snapshotInformational, type SnapshotTestOptions } from '@af/visual-regression';

import ModalWideButtonText from '../../../../examples/101-modal-wide-button-text';
import ModalBasic from '../../../../examples/99-modal-basic';

const variants: SnapshotTestOptions<Hooks>['variants'] = [
	{
		name: 'light',
		environment: {
			colorScheme: 'light',
		},
	},
];

snapshotInformational(ModalBasic, {
	description: 'Modal Basic example',
	variants,
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Launch benefits modal' }).click();
	},
});

snapshotInformational(ModalBasic, {
	description: 'Modal Basic example with primary button on right',
	variants,
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('checkbox', { name: 'Toggle primary button position in dialog' }).click();
		await page.getByRole('button', { name: 'Launch benefits modal' }).click();
	},
});

snapshotInformational(ModalWideButtonText, {
	description: 'Modal Wide Button Text example',
	variants,
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Launch benefits modal with wide button text' }).click();
	},
});
