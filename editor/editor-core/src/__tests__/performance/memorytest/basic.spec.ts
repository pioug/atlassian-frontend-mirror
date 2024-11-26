import { expect, editorPerformanceTestCase as test } from '@af/editor-libra';
import { EditorNodeContainerModel, EditorTableModel } from '@af/editor-libra/page-models';

import { hugeDocument } from '../fixtures/huge-document';

test.use({
	launchOptions: {
		args: ['--js-flags=--expose-gc'],
	},
});
test.describe('@composable-full-page__memory', () => {
	test.describe('Editor - Performance', () => {
		test.describe('full-page__with-huge-document', () => {
			test.use({
				editorProps: {
					appearance: 'full-page',
					allowTables: {
						advanced: true,
					},
				},
				editorPerformanceTestOptions: {
					editorVersion: 'composable',
					performanceTestType: 'memory',
				},
				adf: hugeDocument,
			});

			// To be renamed after some soaking to evaluate data ...
			test('beta - simulate page interactions', async ({ editor }) => {
				await editor.selection.set({ anchor: 1, head: 1 });
				await Promise.allSettled([
					editor.keyboard.type('vvcccckddfnektkhdevnkkdvdhhgtnnlteutdhtknick', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfnevlucnkfjcufdreciuetvjchbrkgrdgeu', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfneljrnuugtdkcjtgneufngdfreibucniik', {
						delay: 0,
					}),
				]);

				// DO NOT change this test - you will break performance
				// metrics recorded and monitored from the test.
				// If there is a breaking change, create a new change
				// and deprecate this one.

				const nodes = EditorNodeContainerModel.from(editor);
				const tableModel = EditorTableModel.from(nodes.table.first());
				const cell = await tableModel.cell(0);
				// Click to the first cell (first row)
				await cell.click();
				// Move the mouse to the last visible cell (same column)

				await editor.page.mouse.move(100, 0);

				// 16 cols

				const row2Cell = await tableModel.cell(16);
				await row2Cell.hover();
				await row2Cell.click();

				const row3Cell = await tableModel.cell(32);
				await row3Cell.hover();
				await row3Cell.click();

				const row4Cell = await tableModel.cell(48);
				await row4Cell.hover();
				await row4Cell.click();

				const row5Cell = await tableModel.cell(64);
				await row5Cell.hover();
				await row5Cell.click();

				// Scroll to the end of table
				await tableModel.scrollTable(editor, 1000);
				await nodes.paragraph.last().click();

				expect(true).toBe(true);
			});
		});
	});
});
