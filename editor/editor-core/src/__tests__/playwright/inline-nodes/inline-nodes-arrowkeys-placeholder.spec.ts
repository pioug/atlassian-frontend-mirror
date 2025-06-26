import { expect, editorTestCase as test } from '@af/editor-libra';
import { fixTest } from '@af/integration-testing';
import { BROWSERS } from '@af/integration-testing/config/constants';

import {
	noTrailingSpacesWithPlaceholder,
	trailingSpacesWithPlaceholder,
} from './inline-nodes.spec.ts-fixtures/placeholder';

test.describe(`inline-nodes - placeholder`, () => {
	test.use({
		editorProps: {
			appearance: 'full-page',
			allowTextAlignment: true,
			allowTables: {
				advanced: true,
				allowColumnResizing: true,
			},
			allowTemplatePlaceholders: {
				allowInserting: true,
			},
		},
	});

	test.describe(`trailing spaces`, () => {
		test.use({
			adf: trailingSpacesWithPlaceholder,
		});

		test('Can select placeholder nodes with the left arrow key and move across them', async ({
			editor,
		}) => {
			fixTest({
				jiraIssueId: 'ED-20526',
				reason: 'selection issue on firefox',
				browsers: [BROWSERS.firefox],
			});
			await editor.selection.set({
				anchor: 7,
				head: 7,
			});
			await editor.keyboard.press('ArrowLeft');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 6,
				head: 6,
			});
			await editor.keyboard.press('ArrowLeft');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 5,
				head: 5,
			});
			await editor.keyboard.press('ArrowLeft');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 4,
				head: 4,
			});
			await editor.keyboard.press('ArrowLeft');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 3,
				head: 3,
			});
			await editor.keyboard.press('ArrowLeft');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 2,
				head: 2,
			});
			await editor.keyboard.press('ArrowLeft');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 1,
				head: 1,
			});
		});

		test('Can select placeholder nodes with the right arrow key and move across them', async ({
			editor,
		}) => {
			fixTest({
				jiraIssueId: 'ED-20526',
				reason: 'selection issue on firefox',
				browsers: [BROWSERS.firefox],
			});
			await editor.selection.set({
				anchor: 1,
				head: 1,
			});
			await editor.keyboard.press('ArrowRight');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 2,
				head: 2,
			});
			await editor.keyboard.press('ArrowRight');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 3,
				head: 3,
			});
			await editor.keyboard.press('ArrowRight');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 4,
				head: 4,
			});
			await editor.keyboard.press('ArrowRight');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 5,
				head: 5,
			});
			await editor.keyboard.press('ArrowRight');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 6,
				head: 6,
			});
		});

		test('should capture and report a11y violations', async ({ editor }) => {
			await editor.selection.set({
				anchor: 7,
				head: 7,
			});
			await editor.keyboard.press('ArrowLeft');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 6,
				head: 6,
			});

			await expect(editor.page).toBeAccessible();
		});
	});

	test.describe(`no trailing spaces`, () => {
		test.use({
			adf: noTrailingSpacesWithPlaceholder,
		});

		test('Can select placeholder nodes with the left arrow key and move across them', async ({
			editor,
		}) => {
			fixTest({
				jiraIssueId: 'ED-20526',
				reason: 'selection issue on firefox',
				browsers: [BROWSERS.firefox],
			});
			await editor.selection.set({
				anchor: 4,
				head: 4,
			});

			await editor.keyboard.press('ArrowLeft');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 3,
				head: 3,
			});
			await editor.keyboard.press('ArrowLeft');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 2,
				head: 2,
			});
			await editor.keyboard.press('ArrowLeft');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 1,
				head: 1,
			});
		});

		test('Can select placeholder nodes with the right arrow key and move across them', async ({
			editor,
		}) => {
			fixTest({
				jiraIssueId: 'ED-20526',
				reason: 'selection issue on firefox',
				browsers: [BROWSERS.firefox],
			});
			await editor.selection.set({
				anchor: 1,
				head: 1,
			});

			await editor.keyboard.press('ArrowRight');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 2,
				head: 2,
			});
			await editor.keyboard.press('ArrowRight');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 3,
				head: 3,
			});
			await editor.keyboard.press('ArrowRight');
			await expect(editor).toHaveSelection({
				type: 'text',
				anchor: 4,
				head: 4,
			});
		});
	});
});
