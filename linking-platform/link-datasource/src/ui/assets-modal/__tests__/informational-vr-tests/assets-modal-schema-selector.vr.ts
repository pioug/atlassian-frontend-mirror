import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import WithAssetsModalVR from '../../../../../examples/vr/with-assets-modal-vr';

snapshotInformational(WithAssetsModalVR, {
	description: 'display assets modal schema selector dropdown',
	drawsOutsideBounds: true,
	prepare: async (page: Page) => {
		await page
			.locator('[data-testid="assets-datasource-modal--object-schema-select"]')
			.first()
			.click({ position: { x: 10, y: 10 } });
		await page.getByRole('listbox').getByText('objSchema1').waitFor({ state: 'visible' });
	},
	featureFlags: {},
});

snapshotInformational(WithAssetsModalVR, {
	description: 'display assets modal schema selector dropdown - filtered',
	drawsOutsideBounds: true,
	prepare: async (page: Page) => {
		await page
			.locator('[data-testid="assets-datasource-modal--object-schema-select"]')
			.first()
			.click({ position: { x: 10, y: 10 } });
		await page.getByRole('textbox').fill('objSchema');
		await page.getByRole('listbox').getByText('objSchema1').waitFor({ state: 'visible' });
	},
	featureFlags: {},
});

snapshotInformational(WithAssetsModalVR, {
	description: 'display assets modal schema selector dropdown - no options',
	drawsOutsideBounds: true,
	prepare: async (page: Page) => {
		await page
			.locator('[data-testid="assets-datasource-modal--object-schema-select"]')
			.first()
			.click({ position: { x: 10, y: 10 } });
		await page.getByRole('textbox').fill('nonExistentSchema');
		await page.getByRole('listbox').getByText('No options').waitFor({ state: 'visible' });
	},
	featureFlags: {},
});
