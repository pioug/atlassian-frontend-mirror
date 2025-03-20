import { snapshotInformational } from '@af/visual-regression';

import Width from '../../../examples/50-width';

snapshotInformational(Width, {
	description: 'Width - size small',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'small' }).click();
	},
});
snapshotInformational(Width, {
	description: 'Width - size medium',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'medium' }).click();
	},
});
snapshotInformational(Width, {
	description: 'Width - size large',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'large', exact: true }).click();
	},
});
snapshotInformational(Width, {
	description: 'Width - size x-large',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'x-large' }).click();
	},
});
snapshotInformational(Width, {
	description: 'Width - unit 420',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: '420' }).click();
	},
});
snapshotInformational(Width, {
	description: 'Width - unit 42%',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: '42%' }).click();
	},
});
snapshotInformational(Width, {
	description: 'Width - unit 42em',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: '42em' }).click();
	},
});
snapshotInformational(Width, {
	description: 'Width - unit 100%',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: '100%' }).click();
	},
});
