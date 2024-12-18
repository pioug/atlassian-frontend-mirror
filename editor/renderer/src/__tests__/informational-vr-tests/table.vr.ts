// import type { Locator, Page } from '@playwright/test';
import { snapshotInformational } from '@af/visual-regression';
import { BrokenTable } from './table.fixture';

snapshotInformational(BrokenTable, {
	description: 'should render table with correct columns',
	featureFlags: {
		platform_editor_table_col_calculation_fix: true,
	},
});
