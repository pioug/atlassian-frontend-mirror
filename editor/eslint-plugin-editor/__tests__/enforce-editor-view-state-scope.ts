import { tsRuleTester } from './utils/_tester';
import { rule } from '../rules/enforce-editor-view-state-scope';

describe('enforce-editor-view-state-scope', () => {
	tsRuleTester.run('enforce-editor-view-state-scope', rule, {
		valid: [
			{
				code: `
				function foo(view: EditorView) {
					const { selection } = view.state;
					return selection;
				}
				`,
			},
			{
				code: `
				function foo(view:EditorView, otherParam) {
					const { state } = view;
					return state.selection;
				}
				`,
			},
			{
				code: `
				function foo1(view:EditorView) {
					const { selection } = view.state;
					console.log(selection);
					function foo2(view:EditorView) {
						const { state } = view;
						return state.selection;
					}
				}
				`,
			},
			{
				code: `
					export const testPlugin = () => {
						return {
							name: 'test',
							pluginsOptions: {
								selectionToolbar: (state: EditorState) => {
									function getSelection(view: EditorView) {
										const { selection: currentSelection } = view.state;
										return { selection: currentSelection };
									}
								},
							},
						};
					};`,
			},
		],
		invalid: [
			// state accessed from a different scope than view
			{
				code: `
				const state: EditorState = {'selection': null};
				function foo(view: EditorView) {
					const { selection } = state;
					return selection;
				}
				`,
				errors: [
					{
						messageId: 'differentEditorViewAndStateScope',
						data: { name: 'element' },
					},
				],
			},
			{
				code: `
				function foo1(state: EditorState) {
					function foo2(view: EditorView) {
						return state;
					}
				}
				`,
				errors: [
					{
						messageId: 'differentEditorViewAndStateScope',
						data: { name: 'element' },
					},
				],
			},
			{
				code: `
					export const testPlugin = () => {
						return {
							name: 'test',
							pluginsOptions: {
								selectionToolbar: (state: EditorState) => {
									function getSelection(view: EditorView) {
										const { selection: currentSelection } = state;
										return { selection: currentSelection };
									}
								},
							},
						};
					};`,
				errors: [
					{
						messageId: 'differentEditorViewAndStateScope',
						data: { name: 'element' },
					},
				],
			},
		],
	});
});
