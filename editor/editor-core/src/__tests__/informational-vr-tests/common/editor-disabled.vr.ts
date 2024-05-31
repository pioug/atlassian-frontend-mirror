import type { Page } from '@playwright/test';

import { EditorPageModel } from '@af/editor-libra/page-models';
import { snapshotInformational } from '@af/visual-regression';

import { Editor } from './editor-disabled.fixtures';

snapshotInformational(Editor, {
	description: 'Selection disabled',
	selector: {
		byTestId: 'ak-editor-fp-content-area',
	},
	prepare: async (page: Page) => {
		const editor = await EditorPageModel.from({ page });
		await editor.selection.set({ anchor: 10, head: 50 });
		await editor.waitForEditorStable();
	},
});
