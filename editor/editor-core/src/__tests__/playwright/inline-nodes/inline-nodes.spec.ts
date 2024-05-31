import { BROWSERS, expect, fixTest, editorTestCase as test } from '@af/editor-libra';

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
	multilineWithPlaceholder,
	multipleNodesAcrossLinesWithPlaceholder,
	noTrailingSpacesWithPlaceholder,
	trailingSpacesWithPlaceholder,
} from './inline-nodes.spec.ts-fixtures/placeholder';
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
		nodeName: 'mention',
		//editorOptions: { allowMention: true },
		adfs: {
			trailingSpaces: trailingSpacesWithMentions,
			notrailingSpaces: noTrailingSpacesWithMentions,
			multipleNodesAcrossLines: multipleNodesAcrossLinesWithMentions,
			multiline: multilineWithMentions,
		},
	},
	{
		nodeName: 'placeholder',
		editorOptions: {
			allowTemplatePlaceholders: {
				allowInserting: true,
			},
		},
		adfs: {
			trailingSpaces: trailingSpacesWithPlaceholder,
			notrailingSpaces: noTrailingSpacesWithPlaceholder,
			multipleNodesAcrossLines: multipleNodesAcrossLinesWithPlaceholder,
			multiline: multilineWithPlaceholder,
		},
	},
];

const selectLineFromLineEndShortCut =
	process.platform === 'darwin' ? 'Meta+Shift+ArrowLeft' : 'Shift+Home';

const selectLineFromLineStartShortCut =
	process.platform === 'darwin' ? 'Meta+Shift+ArrowRight' : 'Shift+End';

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

			test('Extend a selection to the start of the current line from the current position', async ({
				editor,
			}) => {
				await editor.selection.set({
					anchor: 7,
					head: 1,
				});
				await editor.keyboard.press(selectLineFromLineEndShortCut);
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 7,
					head: 1,
				});
			});

			test('Can click and drag to extend a selection to the start of the current line from the current position', async ({
				editor,
			}) => {
				fixTest({
					jiraIssueId: 'ED-20526',
					reason: 'selection issue on webkit',
					browsers: [BROWSERS.webkit],
				});
				const cursorPositionEndOfLine = await editor.selection.setCursor({
					position: 7,
				});

				const cursorPositionStartOfLine = await editor.selection.setCursor({
					position: 1,
				});

				await editor.page.mouse.move(cursorPositionEndOfLine.x, cursorPositionEndOfLine.y);
				await editor.page.mouse.down();
				await editor.page.mouse.move(cursorPositionStartOfLine.x, cursorPositionStartOfLine.y);
				await editor.page.mouse.up();

				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 7,
					head: 1,
				});
			});
		});

		test.describe(`no trailing spaces`, () => {
			test.use({
				adf: adfs.notrailingSpaces,
			});

			test('Extend a selection to the start of the current line from the current position', async ({
				editor,
			}) => {
				await editor.selection.set({
					anchor: 4,
					head: 4,
				});

				await editor.keyboard.press(selectLineFromLineEndShortCut);

				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 4,
					head: 1,
				});
			});

			test('Extend a selection to the end of the current line from the current position', async ({
				editor,
			}) => {
				await editor.selection.set({
					anchor: 1,
					head: 1,
				});

				await editor.keyboard.press(selectLineFromLineStartShortCut);

				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 1,
					head: 4,
				});
			});

			test(`Can extend the selection right by one with shift + right arrow key to select ${nodeName} node`, async ({
				editor,
			}) => {
				fixTest({
					jiraIssueId: 'ED-20526',
					reason: 'selection issue on firefox',
					browsers: [BROWSERS.firefox],
				});
				fixTest({
					jiraIssueId: 'TBD',
					reason:
						'selection issue caused by extra spaces added due to allowInlineCursorTarget option on preset',
					browsers: [BROWSERS.firefox, BROWSERS.chromium, BROWSERS.webkit],
				});
				await editor.selection.set({
					anchor: 1,
					head: 1,
				});
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 1,
					head: 1,
				});
				await editor.keyboard.press('Shift+ArrowRight');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 1,
					head: 2,
				});
				await editor.keyboard.press('Shift+ArrowRight');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 1,
					head: 3,
				});
				await editor.keyboard.press('Shift+ArrowRight');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 1,
					head: 4,
				});
			});

			test(`Can extend the selection left by one with shift + left arrow key to select ${nodeName} node`, async ({
				editor,
			}) => {
				fixTest({
					jiraIssueId: 'ED-20526',
					reason: 'selection issue on firefox',
					browsers: [BROWSERS.firefox],
				});
				// fixTest({
				//   jiraIssueId:'TBD',
				//   reason: 'selection issue caused by extra spaces added due to allowInlineCursorTarget option on preset',
				//   browsers: [BROWSERS.firefox, BROWSERS.chromium, BROWSERS.webkit]
				// });
				await editor.selection.set({
					anchor: 4,
					head: 4,
				});
				await editor.keyboard.press('Shift+ArrowLeft');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 4,
					head: 3,
				});
				await editor.keyboard.press('Shift+ArrowLeft');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 4,
					head: 2,
				});
				await editor.keyboard.press('Shift+ArrowLeft');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 4,
					head: 1,
				});
			});

			test('Can insert text directly after the last node view in the same paragraph', async ({
				editor,
			}) => {
				await editor.selection.set({
					anchor: 4,
					head: 4,
				});
				await editor.keyboard.type('test');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 8,
					head: 8,
				});
			});
		});

		test.describe(`multiple nodes across lines`, () => {
			test.use({
				adf: adfs.multipleNodesAcrossLines,
			});
			test(`Can move the selection down one line using down arrow key when ${nodeName} is the first node of each line`, async ({
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
				await editor.keyboard.press('ArrowDown');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 6,
					head: 6,
				});
				await editor.keyboard.press('ArrowDown');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 11,
					head: 11,
				});
				await editor.keyboard.press('ArrowDown');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 16,
					head: 16,
				});
				await editor.keyboard.press('ArrowDown');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 18,
					head: 18,
				});
			});
			test(`Can move the selection up one line using up arrow key when ${nodeName} is the first node of each line`, async ({
				editor,
			}) => {
				fixTest({
					jiraIssueId: 'ED-20526',
					reason: 'selection issue on firefox',
					browsers: [BROWSERS.firefox],
				});
				await editor.selection.set({
					anchor: 18,
					head: 18,
				});

				await editor.keyboard.press('ArrowUp');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 16,
					head: 16,
				});
				await editor.keyboard.press('ArrowUp');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 11,
					head: 11,
				});
				await editor.keyboard.press('ArrowUp');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 6,
					head: 6,
				});
				await editor.keyboard.press('ArrowUp');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 1,
					head: 1,
				});
			});
			test(`Can move the selection down one line using down arrow key when in between ${nodeName} nodes`, async ({
				editor,
				browser,
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
				await editor.keyboard.press('ArrowDown');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 11,
					head: 11,
				});
				await editor.keyboard.press('ArrowDown');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 16,
					head: 16,
				});
				await editor.keyboard.press('ArrowDown');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 18,
					head: 18,
				});
			});
			test(`Can move the selection up one line using up arrow key when in between ${nodeName} nodes`, async ({
				editor,
			}) => {
				fixTest({
					jiraIssueId: 'ED-20526',
					reason: 'selection issue on firefox',
					browsers: [BROWSERS.firefox],
				});
				await editor.selection.set({
					anchor: 14,
					head: 14,
				});
				await editor.keyboard.press('ArrowUp');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 11,
					head: 11,
				});
				await editor.keyboard.press('ArrowUp');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 6,
					head: 6,
				});
				await editor.keyboard.press('ArrowUp');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 1,
					head: 1,
				});
			});

			test('Can extend the selection one line up with shift + arrow up', async ({ editor }) => {
				fixTest({
					jiraIssueId: 'ED-20526',
					reason: 'selection issue on firefox',
					browsers: [BROWSERS.firefox],
				});
				await editor.selection.set({
					anchor: 18,
					head: 18,
				});

				await editor.keyboard.press('Shift+ArrowUp');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 18,
					head: 16,
				});
				await editor.keyboard.press('Shift+ArrowUp');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 18,
					head: 11,
				});
				await editor.keyboard.press('Shift+ArrowUp');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 18,
					head: 6,
				});
				await editor.keyboard.press('Shift+ArrowUp');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 18,
					head: 1,
				});
			});
			test('Can extend the selection one line down with shift + arrow down', async ({ editor }) => {
				fixTest({
					jiraIssueId: 'ED-20526',
					reason: 'selection issue on firefox',
					browsers: [BROWSERS.firefox],
				});
				await editor.selection.set({
					anchor: 1,
					head: 1,
				});

				await editor.keyboard.press('Shift+ArrowDown');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 1,
					head: 6,
				});
				await editor.keyboard.press('Shift+ArrowDown');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 1,
					head: 11,
				});
				await editor.keyboard.press('Shift+ArrowDown');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 1,
					head: 16,
				});
				await editor.keyboard.press('Shift+ArrowDown');
				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 1,
					head: 18,
				});
			});
		});

		test.describe(`multiline`, () => {
			test.use({
				adf: adfs.multiline,
			});
			test('Can insert text directly after the last node view in the same paragraph', async ({
				editor,
			}) => {
				await editor.selection.set({
					anchor: 7,
					head: 7,
				});

				await editor.keyboard.type('test');

				await expect(editor).toHaveSelection({
					type: 'text',
					anchor: 11,
					head: 11,
				});
			});
		});
	});
});
