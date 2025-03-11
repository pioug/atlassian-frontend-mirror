import { snapshotInformational } from '@af/visual-regression';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { RendererMention } from './mention.fixtures';

snapshotInformational(RendererMention, {
	featureFlags: {
		platform_editor_react18_mention_with_provider_fix: [true, false],
	},
	prepare: async (page: Page, component: Locator) => {
		const mention = page.locator('[data-mention-id]');
		await mention.click();
	},
});
