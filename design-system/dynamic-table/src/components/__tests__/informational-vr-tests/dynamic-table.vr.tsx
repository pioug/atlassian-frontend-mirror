import { snapshotInformational } from '@af/visual-regression';

import Basic from '../../../../examples/99-testing';

snapshotInformational(Basic, {
	description: 'after sorting',
	variants: [
		{
			name: 'Light',
			environment: { colorScheme: 'light' },
		},
	],
	prepare: async (page) => {
		// Go to page 3
		await page.getByRole('button', { name: 'Page 3' }).click();
		// Sort by party
		await page.getByRole('button', { name: 'Party' }).click();

		// Wait until the table has updated
		// Otherwise it seems like the test can be flakey
		await page.locator('[aria-sort="ascending"]', { hasText: 'Party' }).waitFor();
	},
});
