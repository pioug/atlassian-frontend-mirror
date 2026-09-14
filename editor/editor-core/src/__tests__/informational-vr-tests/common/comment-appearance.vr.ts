import type { Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import { CommentEditorTwoLineToolbar } from './comment-appearance.fixtures.vr.ap';

snapshotInformational(CommentEditorTwoLineToolbar, {
	description: 'Comment editor two line toolbar small viewport',
	prepare: async (page: Page) => {
		await page.setViewportSize({ width: 400, height: 720 });
	},
});
