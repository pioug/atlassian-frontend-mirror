import { snapshotInformational } from '@af/visual-regression';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { RendererMention } from './mention.fixtures';

snapshotInformational(RendererMention, {
	prepare: async (page: Page, component: Locator) => {
		const mention = page.locator('[data-mention-id]');
		await mention.click();
	},
});
