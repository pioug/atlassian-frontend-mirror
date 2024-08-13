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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
	prepare: async (page: Page) => {
		const expand = page.getByLabel('Expand content').nth(0);
		expand.click();
		const nestedExpand = page.getByLabel('Expand content').nth(1);
		nestedExpand.click();
	},
});
