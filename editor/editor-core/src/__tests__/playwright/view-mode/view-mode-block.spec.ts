import {
	EditorBlockCardModel,
	EditorNodeContainerModel,
	expect,
	editorViewModeTestCase as test,
} from '@af/editor-libra';
import { type EditorViewModePageInterface } from '@af/editor-libra/src/types';
import { blockCard, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { viewModeBlockAdf } from './view-mode.spec.ts-fixtures';

const getCursorStyles = async (editor: EditorViewModePageInterface) => {
	const nodes = EditorNodeContainerModel.from(editor);
	const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);
	await blockCardModel.waitForStable();

	const titleCursorStyle = await nodes.blockCard
		.locator('.block-card-content-header')
		.evaluate((element) => {
			return window.getComputedStyle(element).cursor;
		});

	const descriptionCursorStyle = await blockCardModel.blockCardDescription.evaluate((element) => {
		return window.getComputedStyle(element).cursor;
	});

	return { titleCursor: titleCursorStyle, descriptionCursor: descriptionCursorStyle };
};

test.describe('block cards in view mode with content-editable FF on', () => {
	test.use({
		adf: viewModeBlockAdf,
		editorProps: {
			appearance: 'full-page',
			allowTextAlignment: true,
			smartLinks: {
				allowBlockCards: true,
			},
		},
		platformFeatureFlags: {
			'linking-platform-contenteditable-false-live-view': true,
		},
	});

	test.describe('when view mode is enabled', () => {
		test('and FF is on, clicking on description does not let you change text', async ({
			editor,
		}) => {
			await editor.setViewMode('view');

			const nodes = EditorNodeContainerModel.from(editor);
			const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);
			await blockCardModel.waitForStable();

			// click on description of block card and attempt to edit text
			await blockCardModel.blockCardDescription.click();
			await editor.keyboard.type('this text should not exist');

			const expectedBlockCard = blockCard({
				url: 'http://www.atlassian.com',
			});

			await expect(editor).toMatchDocument(doc(p(' '), expectedBlockCard()));
			await expect(editor.content).not.toContainText('this text should not exist');
		});
	});

	test.describe('when view mode is disabled', () => {
		test('clicking block card and typing should replace the block card with text', async ({
			editor,
		}) => {
			await editor.setViewMode('edit');

			const nodes = EditorNodeContainerModel.from(editor);
			const blockCardModel = EditorBlockCardModel.from(nodes.blockCard);

			await blockCardModel.waitForStable();
			await blockCardModel.click();
			await editor.keyboard.type('this text should exist');

			await expect(editor).toMatchDocument(doc(p(' '), p('this text should exist')));
		});
	});
});

test.describe('block cards in view mode with smart-links-in-live-pages FF on', () => {
	test.use({
		adf: viewModeBlockAdf,
		editorProps: {
			appearance: 'full-page',
			allowTextAlignment: true,
			smartLinks: {
				allowBlockCards: true,
			},
		},
		platformFeatureFlags: {
			'platform.linking-platform.smart-links-in-live-pages': true,
		},
	});

	test.describe('when view mode is enabled', () => {
		test('cursor should be text over the description, and pointer over title', async ({
			editor,
		}) => {
			await editor.setViewMode('view');
			const { titleCursor, descriptionCursor } = await getCursorStyles(editor);

			expect(titleCursor).toEqual('pointer');
			expect(descriptionCursor).toEqual('text');
		});
	});

	test.describe('when view mode is disabled', () => {
		test('cursor should be text over the description, and pointer over title', async ({
			editor,
		}) => {
			await editor.setViewMode('edit');
			const { titleCursor, descriptionCursor } = await getCursorStyles(editor);

			expect(titleCursor).toEqual('pointer');
			expect(descriptionCursor).toEqual('text');
		});
	});
});

test.describe('block cards in view mode with smart-links-in-live-pages FF off', () => {
	test.use({
		adf: viewModeBlockAdf,
		editorProps: {
			appearance: 'full-page',
			allowTextAlignment: true,
			smartLinks: {
				allowBlockCards: true,
			},
		},
		platformFeatureFlags: {
			'platform.linking-platform.smart-links-in-live-pages': false,
		},
	});

	test.describe('when view mode is enabled', () => {
		test('cursor should be pointer over the description, and auto over title', async ({
			editor,
		}) => {
			await editor.setViewMode('view');
			const { titleCursor, descriptionCursor } = await getCursorStyles(editor);

			expect(titleCursor).toEqual('auto');
			expect(descriptionCursor).toEqual('pointer');
		});
	});

	test.describe('when view mode is disabled', () => {
		test('cursor should be pointer over the description, and auto over title', async ({
			editor,
		}) => {
			await editor.setViewMode('edit');
			const { titleCursor, descriptionCursor } = await getCursorStyles(editor);

			expect(titleCursor).toEqual('auto');
			expect(descriptionCursor).toEqual('pointer');
		});
	});
});
