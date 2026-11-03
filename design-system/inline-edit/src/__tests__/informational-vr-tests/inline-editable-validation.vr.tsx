import { snapshotInformational } from '@af/visual-regression';

import { LongError, ShortError } from '../../../examples/inline-editable-validation.vr.ap';

const topLayerFlag = {
	'platform-dst-top-layer': [true, false],
} as const;

snapshotInformational(ShortError, {
	description: 'short validation error',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('textbox', { name: 'Name' }).fill('');
		await page.getByRole('button', { name: 'Confirm', exact: true }).click();
		await page.getByText('Enter a name', { exact: true }).waitFor({ state: 'visible' });
	},
});

snapshotInformational(LongError, {
	description: 'long validation error wraps at the content width limit',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('textbox', { name: 'Name' }).fill('');
		await page.getByRole('button', { name: 'Confirm', exact: true }).click();
		await page
			.getByText(/^Enter a name longer than six characters\./)
			.waitFor({ state: 'visible' });
	},
});
