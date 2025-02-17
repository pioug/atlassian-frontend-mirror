import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';
import MediaWithText from '../../../examples/media-with-text';

snapshotInformational(MediaWithText, {
	drawsOutsideBounds: true,
	prepare: async (page: Page, component: Locator) => {
		await page.keyboard.press('ControlOrMeta+A');
	},
	description: 'Select all content on the page',
});
