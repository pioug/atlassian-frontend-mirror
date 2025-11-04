import {
	NestedTableRenderer,
	NestedTableWithOverflowRenderer,
	StickyHeaderNestedTableRenderer,
	NestedTableNumberedColumnRenderer,
} from './nested-table.fixture';
import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

snapshotInformational(NestedTableRenderer, {
	description: 'should render nested table in background color cell correctly',
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

snapshotInformational(NestedTableNumberedColumnRenderer, {
	description:
		'should render nested table numbered column correctly if parent cell has a background color',
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

snapshotInformational(NestedTableWithOverflowRenderer, {
	description: 'should have overflow shadow only on nested table',
});

snapshotInformational(StickyHeaderNestedTableRenderer, {
	description: 'should have overflow shadow on nested table inside sticky header',

	prepare: async (page: Page) => {
		const tableRow = page.locator('tr').last();
		await tableRow.scrollIntoViewIfNeeded();
	},
});
