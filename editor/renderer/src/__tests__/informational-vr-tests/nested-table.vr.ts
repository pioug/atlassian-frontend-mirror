import { NestedTableRenderer } from './nested-table.fixture';
import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

snapshotInformational(NestedTableRenderer, {
	description: 'should render nested table in background color cell correctly',
	featureFlags: {
		platform_editor_nested_tables_renderer_styles: true,
		platform_editor_use_nested_table_pm_nodes: true,
	},
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

snapshotInformational(NestedTableRenderer, {
	description: 'should only render parent table sort buttons on hover of parent table header cell',
	featureFlags: {
		platform_editor_nested_tables_renderer_styles: true,
		platform_editor_use_nested_table_pm_nodes: true,
	},
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
		const headerCell = page.locator('th').first();
		const sortButton = page.locator('th .ak-renderer-tableHeader-sorting-icon').first();

		await headerCell.hover();
		await sortButton.waitFor({ state: 'visible' });
	},
});

snapshotInformational(NestedTableRenderer, {
	description: 'should only render nested table sort buttons on hover of nested table header cell',
	featureFlags: {
		platform_editor_nested_tables_renderer_styles: true,
		platform_editor_use_nested_table_pm_nodes: true,
	},
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
		const headerCell = page.locator('th th').first();
		const sortButton = page.locator('th th .ak-renderer-tableHeader-sorting-icon').first();

		await headerCell.hover();
		await sortButton.waitFor({ state: 'visible' });
	},
});
