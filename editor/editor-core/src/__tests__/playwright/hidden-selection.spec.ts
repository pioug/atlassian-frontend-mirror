import { editorTestCase as test } from '@af/editor-libra/editor-test-case';
import { expect } from '@af/editor-libra/matchers';
import type { Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

const paragraph = (text: string) => ({
	type: 'paragraph',
	content: [{ type: 'text', text, marks: [{ type: 'strong' }] }],
});

for (const enabled of [false, true]) {
	test.describe(`hidden native selection, improve INP ${enabled ? 'on' : 'off'}`, () => {
		test.use({
			exampleName: 'testing' as keyof typeof import('../../../examples/99-testing.tsx'),
			platformFeatureFlags: {
				platform_editor_improve_inp: enabled,
				platform_editor_nest_table_in_panel: false,
			},
			editorProps: { appearance: 'full-page', allowPanel: true, allowTables: true },
			adf: {
				type: 'doc',
				version: 1,
				content: [
					{ type: 'panel', attrs: { panelType: 'info' }, content: [paragraph('Panel text')] },
					{
						type: 'table',
						content: [
							{
								type: 'tableRow',
								content: ['First cell', 'Second cell'].map((text) => ({
									type: 'tableCell',
									content: [paragraph(text)],
								})),
							},
						],
					},
					paragraph('Unselected text'),
				],
			},
		});

		for (const kind of ['panel', 'cell', 'gapcursor'] as const) {
			const selectedTextCount = kind === 'gapcursor' ? 0 : kind === 'panel' ? 1 : 2;
			const selectionType = kind === 'panel' ? 'node' : kind;
			// Treatment scopes panel/cell caret suppression to the selected subtree.
			// Control and the dedicated gap-cursor rules still suppress at the root.
			const hasScopedCaret = enabled && kind !== 'gapcursor';
			const caretSelector = hasScopedCaret
				? '.ProseMirror .selectedCell strong, .ProseMirror .ak-editor-selected-node strong'
				: '.ProseMirror';
			const expectedCaretCount = hasScopedCaret ? selectedTextCount : 1;

			test(`suppresses ${kind} selection and restores text highlighting`, async ({
				editor,
				page,
			}) => {
				// Make native highlighting observable rather than relying on UA highlight defaults.
				await editor.page.addStyleTag({
					content: '.ProseMirror ::selection { background-color: rgb(255, 0, 255); }',
				});
				const selection = await editor.page.evaluate((kind) => {
					const win = window as unknown as Window & {
						__editorView: EditorView;
						// eslint-disable-next-line playwright/no-unsafe-references -- Type-only import; runtime constructor comes from the test page.
						__TextSelection: typeof TextSelection;
					};
					const view = win.__editorView;
					// eslint-disable-next-line playwright/no-unsafe-references -- Type-only import; runtime constructor comes from the test page.
					const SelectionClass = Object.getPrototypeOf(win.__TextSelection) as typeof Selection;
					const positions: Record<string, number[]> = {};
					view.state.doc.descendants((node, pos) => {
						const name = node.type.name === 'panel_c1' ? 'panel' : node.type.name;
						(positions[name] ??= []).push(pos);
					});
					const json =
						kind === 'cell'
							? { type: 'cell', anchor: positions.tableCell[0], head: positions.tableCell[1] }
							: kind === 'gapcursor'
								? { type: 'gapcursor', pos: 0, side: 'left' }
								: { type: 'node', anchor: positions[kind][0] };
					view.dispatch(view.state.tr.setSelection(SelectionClass.fromJSON(view.state.doc, json)));
					view.focus();
					return view.state.selection.toJSON();
				}, kind);
				expect(selection.type).toBe(selectionType);
				const root = editor.page.locator('.ProseMirror');
				await expect(root).toHaveClass(/ProseMirror-hideselection/u);
				const selected = root.locator('.selectedCell strong, .ak-editor-selected-node strong');
				await expect(selected).toHaveCount(selectedTextCount);
				const caretTargets = editor.page.locator(caretSelector);
				await expect(caretTargets).toHaveCount(expectedCaretCount);
				await expect
					.poll(() =>
						caretTargets.evaluateAll((elements) =>
							elements.map((el) => getComputedStyle(el).caretColor),
						),
					)
					.toEqual(Array(expectedCaretCount).fill('rgba(0, 0, 0, 0)'));
				await expect
					.poll(() =>
						selected.evaluateAll((elements) =>
							elements.map((el) => getComputedStyle(el, '::selection').backgroundColor),
						),
					)
					.toEqual(Array(selectedTextCount).fill('rgba(0, 0, 0, 0)'));
				const sibling = root.locator('strong').filter({ hasText: 'Unselected text' });
				await expect
					.poll(() => sibling.evaluate((el) => getComputedStyle(el, '::selection').backgroundColor))
					.toBe(enabled ? 'rgb(255, 0, 255)' : 'rgba(0, 0, 0, 0)');

				await sibling.click();
				await page.keyboard.press('Home');
				await page.keyboard.press('Shift+ArrowRight');
				await expect(root).not.toHaveClass(/ProseMirror-hideselection/u);
				await expect
					.poll(() => sibling.evaluate((el) => getComputedStyle(el, '::selection').backgroundColor))
					.toBe('rgb(255, 0, 255)');
			});
		}
	});
}
