import { snapshotInformational } from '@af/visual-regression';
import type { Page } from '@playwright/test';

import { BrokenTable, TableWithParagraph } from './table.fixture.vr.ap';

snapshotInformational(BrokenTable, {
	description: 'should render table with correct columns',
});

snapshotInformational(TableWithParagraph, {
	description: 'should render table with paragraph and show sort button correctly',
	prepare: async (page: Page) => {
		const headerCell = page.locator('th').first();
		const sortButton = page.locator('th .ak-renderer-tableHeader-sorting-icon').first();

		await headerCell.hover();
		await sortButton.waitFor({ state: 'visible' });
	},
});
