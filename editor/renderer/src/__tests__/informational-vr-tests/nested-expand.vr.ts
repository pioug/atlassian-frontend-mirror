// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from '@playwright/test';

import { NestedExpandRenderer } from './nested-expand.fixture';

import { snapshotInformational } from '@af/visual-regression';

snapshotInformational(NestedExpandRenderer, {
	description: 'should render nested expand in expand in default mode - collapsed',
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshotInformational(NestedExpandRenderer, {
	description: 'should render nested expand in expand in default mode - expanded',
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	prepare: async (page: Page) => {
		const expandToggle = page.getByLabel('Expand content').nth(0);
		await expandToggle.click();

		const nestedExpandToggle = page.getByLabel('Expand content').nth(0);
		await nestedExpandToggle.click();

		// Move mouse hover to remove tooltip causing flakey tests
		const nestedExpandNode = page.locator('[data-node-type="nestedExpand"]');
		await nestedExpandNode.hover();
	},
});
