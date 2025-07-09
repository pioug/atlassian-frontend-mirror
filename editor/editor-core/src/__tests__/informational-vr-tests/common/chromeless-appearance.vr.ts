import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import { ChromelessEditor } from './chromeless-appearance.fixtures';

snapshotInformational(ChromelessEditor, {
	description: 'Chromeless editor small viewport',
	prepare: async (page: Page) => {
		await page.setViewportSize({ width: 400, height: 100 });
	},
});
