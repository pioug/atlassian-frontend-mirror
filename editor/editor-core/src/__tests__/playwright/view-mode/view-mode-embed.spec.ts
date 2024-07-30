import {
	EditorEmbedCardModel,
	EditorNodeContainerModel,
	expect,
	editorViewModeTestCase as test,
} from '@af/editor-libra';
import { type EditorViewModePageInterface } from '@af/editor-libra/src/types';

import { viewModeEmbedAdf } from './view-mode.spec.ts-fixtures';

const getCursorStyles = async (editor: EditorViewModePageInterface) => {
	const nodes = EditorNodeContainerModel.from(editor);
	const embedCardModel = EditorEmbedCardModel.from(nodes.embedCard);
	await embedCardModel.waitForStable();

	return embedCardModel.header.locator('a').evaluate((element) => {
		return window.getComputedStyle(element).cursor;
	});
};

test.describe('embed cards in view mode with smart-links-in-live-pages FF on', () => {
	test.use({
		adf: viewModeEmbedAdf,
		editorProps: {
			appearance: 'full-page',
			allowTextAlignment: true,
			smartLinks: {
				allowBlockCards: true,
				allowEmbeds: true,
			},
		},
		platformFeatureFlags: {
			'platform.linking-platform.smart-links-in-live-pages': true,
		},
	});

	test.describe('when view mode is enabled', () => {
		test('cursor should be pointer over title', async ({ editor }) => {
			await editor.setViewMode('view');
			const titleCursor = await getCursorStyles(editor);

			expect(titleCursor).toEqual('pointer');
		});
	});

	test.describe('when view mode is disabled', () => {
		test('cursor should be pointer over title', async ({ editor }) => {
			await editor.setViewMode('edit');
			const titleCursor = await getCursorStyles(editor);

			expect(titleCursor).toEqual('pointer');
		});
	});
});

test.describe('embed cards in view mode with smart-links-in-live-pages FF off', () => {
	test.use({
		adf: viewModeEmbedAdf,
		editorProps: {
			appearance: 'full-page',
			allowTextAlignment: true,
			smartLinks: {
				allowBlockCards: true,
				allowEmbeds: true,
			},
		},
		platformFeatureFlags: {
			'platform.linking-platform.smart-links-in-live-pages': false,
		},
	});

	test.describe('when view mode is enabled', () => {
		test('cursor should be text over title', async ({ editor }) => {
			await editor.setViewMode('view');
			const titleCursor = await getCursorStyles(editor);

			expect(titleCursor).toEqual('auto');
		});
	});

	test.describe('when view mode is disabled', () => {
		test('cursor should be auto over title', async ({ editor }) => {
			await editor.setViewMode('edit');
			const titleCursor = await getCursorStyles(editor);

			expect(titleCursor).toEqual('auto');
		});
	});
});
