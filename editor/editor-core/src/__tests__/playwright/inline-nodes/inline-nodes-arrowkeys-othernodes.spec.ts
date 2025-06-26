import { expect, editorTestCase as test } from '@af/editor-libra';

import {
	multilineWithDates,
	multipleNodesAcrossLinesWithDates,
	noTrailingSpacesWithDates,
	trailingSpacesWithDates,
} from './inline-nodes.spec.ts-fixtures/dates';
import {
	multilineWithEmoji,
	multipleNodesAcrossLinesWithEmoji,
	noTrailingSpacesWithEmoji,
	trailingSpacesWithEmoji,
} from './inline-nodes.spec.ts-fixtures/emoji';
import {
	multilineWithInlineCard,
	multipleNodesAcrossLinesWithInlineCard,
	noTrailingSpacesWithInlineCard,
	trailingSpacesWithInlineCard,
} from './inline-nodes.spec.ts-fixtures/inlinecard';
import {
	multilineWithMentions,
	multipleNodesAcrossLinesWithMentions,
	noTrailingSpacesWithMentions,
	trailingSpacesWithMentions,
} from './inline-nodes.spec.ts-fixtures/mentions';
import {
	multilineWithStatus,
	multipleNodesAcrossLinesWithStatus,
	noTrailingSpacesWithStatus,
	trailingSpacesWithStatus,
} from './inline-nodes.spec.ts-fixtures/status';
import {
	multilineWithUnsupportedInline,
	multipleNodesAcrossLinesWithUnsupportedInline,
	noTrailingSpacesWithUnsupportedInline,
	trailingSpacesWithUnsupportedInline,
} from './inline-nodes.spec.ts-fixtures/unsupportedinline';
import type { TestSuiteOptions } from './test-suite-options';

const testCases: Array<TestSuiteOptions> = [
	{
		nodeName: 'date',
		editorOptions: { allowDate: true },
		adfs: {
			trailingSpaces: trailingSpacesWithDates,
			notrailingSpaces: noTrailingSpacesWithDates,
			multipleNodesAcrossLines: multipleNodesAcrossLinesWithDates,
			multiline: multilineWithDates,
		},
	},
	{
		nodeName: 'emoji',
		adfs: {
			trailingSpaces: trailingSpacesWithEmoji,
			notrailingSpaces: noTrailingSpacesWithEmoji,
			multipleNodesAcrossLines: multipleNodesAcrossLinesWithEmoji,
			multiline: multilineWithEmoji,
		},
	},
	{
		nodeName: 'unsupportedInline',
		adfs: {
			trailingSpaces: trailingSpacesWithUnsupportedInline,
			notrailingSpaces: noTrailingSpacesWithUnsupportedInline,
			multipleNodesAcrossLines: multipleNodesAcrossLinesWithUnsupportedInline,
			multiline: multilineWithUnsupportedInline,
		},
	},
	{
		nodeName: 'status',
		editorOptions: { allowStatus: true },
		adfs: {
			trailingSpaces: trailingSpacesWithStatus,
			notrailingSpaces: noTrailingSpacesWithStatus,
			multipleNodesAcrossLines: multipleNodesAcrossLinesWithStatus,
			multiline: multilineWithStatus,
		},
	},
	{
		nodeName: 'inlineCard',
		editorOptions: {
			smartLinks: {},
		},
		adfs: {
			trailingSpaces: trailingSpacesWithInlineCard,
			notrailingSpaces: noTrailingSpacesWithInlineCard,
			multipleNodesAcrossLines: multipleNodesAcrossLinesWithInlineCard,
			multiline: multilineWithInlineCard,
		},
	},
	{
		only: true,
		nodeName: 'mention',
		adfs: {
			trailingSpaces: trailingSpacesWithMentions,
			notrailingSpaces: noTrailingSpacesWithMentions,
			multipleNodesAcrossLines: multipleNodesAcrossLinesWithMentions,
			multiline: multilineWithMentions,
		},
	},
];

const filterTestCasesIfOnlySet = (testCases: Array<TestSuiteOptions>) =>
	testCases.some((c) => c.only) ? testCases.filter((c) => c.only) : testCases;

filterTestCasesIfOnlySet(testCases).forEach(({ nodeName, adfs, editorOptions }) => {
	test.describe(`inline-nodes - ${nodeName}`, () => {
		test.use({
			editorProps: {
				appearance: 'full-page',
				allowTextAlignment: true,
				allowTables: {
					advanced: true,
					allowColumnResizing: true,
				},
				...editorOptions,
			},
		});

		test.describe(`trailing spaces`, () => {
			test.use({
				adf: adfs.trailingSpaces,
			});

			test(`Can select ${nodeName} nodes with the left arrow key and move across them`, async ({
				editor,
			}) => {
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
				await expect(editor).toHaveSelection({ type: 'node', anchor: 5 });
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
				await expect(editor).toHaveSelection({ type: 'node', anchor: 3 });
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
				await expect(editor).toHaveSelection({ type: 'node', anchor: 1 });
				await editor.keyboard.press('ArrowLeft');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 1,
					head: 1,
				});
			});

			test(`Can select ${nodeName} nodes with the right arrow key and move across them`, async ({
				editor,
			}) => {
				await editor.selection.set({
					anchor: 1,
					head: 1,
				});
				await editor.keyboard.press('ArrowRight');
				await expect(editor).toHaveSelection({ type: 'node', anchor: 1 });
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
				await expect(editor).toHaveSelection({ type: 'node', anchor: 3 });
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
				await expect(editor).toHaveSelection({ type: 'node', anchor: 5 });
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
				adf: adfs.notrailingSpaces,
			});

			test(`Can select ${nodeName} nodes with the left arrow key and move across them`, async ({
				editor,
			}) => {
				await editor.selection.set({
					anchor: 4,
					head: 4,
				});

				await editor.keyboard.press('ArrowLeft');
				await expect(editor).toHaveSelection({ type: 'node', anchor: 3 });
				await editor.keyboard.press('ArrowLeft');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 3,
					head: 3,
				});
				await editor.keyboard.press('ArrowLeft');
				await expect(editor).toHaveSelection({ type: 'node', anchor: 2 });
				await editor.keyboard.press('ArrowLeft');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 2,
					head: 2,
				});
				await editor.keyboard.press('ArrowLeft');
				await expect(editor).toHaveSelection({ type: 'node', anchor: 1 });
				await editor.keyboard.press('ArrowLeft');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 1,
					head: 1,
				});
			});

			test(`Can select ${nodeName} nodes with the right arrow key and move across them`, async ({
				editor,
			}) => {
				await editor.selection.set({
					anchor: 1,
					head: 1,
				});

				await editor.keyboard.press('ArrowRight');
				await expect(editor).toHaveSelection({ type: 'node', anchor: 1 });
				await editor.keyboard.press('ArrowRight');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 2,
					head: 2,
				});
				await editor.keyboard.press('ArrowRight');
				await expect(editor).toHaveSelection({ type: 'node', anchor: 2 });
				await editor.keyboard.press('ArrowRight');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 3,
					head: 3,
				});
				await editor.keyboard.press('ArrowRight');
				await expect(editor).toHaveSelection({ type: 'node', anchor: 3 });
				await editor.keyboard.press('ArrowRight');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 4,
					head: 4,
				});
			});
		});
	});
});
