// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { doesSelectionWhichStartsOrEndsInListContainEntireList } from '@atlaskit/editor-plugin-paste/src/pm-plugins/util/handlers';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { betterTypeHistoryPlugin } from '@atlaskit/editor-plugins/better-type-history';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { emojiPlugin } from '@atlaskit/editor-plugins/emoji';
import { featureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { panelPlugin } from '@atlaskit/editor-plugins/panel';
import { pastePlugin } from '@atlaskit/editor-plugins/paste';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	createProsemirrorEditorFactory,
	Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, li, ol, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('doesSelectionWhichStartsOrEndsInListContainEntireList', () => {
	const createEditor = createProsemirrorEditorFactory();
	const editor = (doc: any) => {
		const preset = new Preset<LightEditorPlugin>()
			.add([featureFlagsPlugin, {}])
			.add([analyticsPlugin, {}])
			.add(betterTypeHistoryPlugin)
			.add([pastePlugin, {}])
			.add(decorationsPlugin)
			.add(listPlugin)
			.add(typeAheadPlugin)
			.add(emojiPlugin)
			.add(panelPlugin)
			.add(blockTypePlugin);
		return createEditor({
			doc,
			preset,
		});
	};
	it('should return true for selection of entire list', () => {
		const { editorView, editorAPI } = editor(
			doc(ol()('{<}', li(p('One')), li(p('Two')), li(p('Three{>}')))),
		);
		expect(
			doesSelectionWhichStartsOrEndsInListContainEntireList(
				editorView.state.selection,
				editorAPI.list?.actions?.findRootParentListNode,
			),
		).toBe(true);
	});

	it('should return true for selection starting in paragraph and ending at end of list', () => {
		const { editorView, editorAPI } = editor(
			doc(p('{<}hello'), ol()(li(p('One')), li(p('Two')), li(p('Three{>}')))),
		);
		expect(
			doesSelectionWhichStartsOrEndsInListContainEntireList(
				editorView.state.selection,
				editorAPI.list?.actions?.findRootParentListNode,
			),
		).toBe(true);
	});

	it('should return true for selection starting at the start of a list and ending in a paragraph', () => {
		const { editorView, editorAPI } = editor(
			doc(ol()('{<}', li(p('One')), li(p('Two')), li(p('Three'))), p('goodbye{>}')),
		);
		expect(
			doesSelectionWhichStartsOrEndsInListContainEntireList(
				editorView.state.selection,
				editorAPI.list?.actions?.findRootParentListNode,
			),
		).toBe(true);
	});

	it('should return false for selection of no list', () => {
		const { editorView, editorAPI } = editor(doc(p('{<}Hello{>}')));
		expect(
			doesSelectionWhichStartsOrEndsInListContainEntireList(
				editorView.state.selection,
				editorAPI.list?.actions?.findRootParentListNode,
			),
		).toBe(false);
	});

	it('should return false for selection starting in paragraph and ending inside a list', () => {
		const { editorView, editorAPI } = editor(
			doc(p('{<}hello'), ol()(li(p('One{>}')), li(p('Two')), li(p('Three')))),
		);
		expect(
			doesSelectionWhichStartsOrEndsInListContainEntireList(
				editorView.state.selection,
				editorAPI.list?.actions?.findRootParentListNode,
			),
		).toBe(false);
	});

	it('should return false for selection inside a list', () => {
		const { editorView, editorAPI } = editor(
			doc(ol()(li(p('{<}One')), li(p('Two{>}')), li(p('Three')))),
		);
		expect(
			doesSelectionWhichStartsOrEndsInListContainEntireList(
				editorView.state.selection,
				editorAPI.list?.actions?.findRootParentListNode,
			),
		).toBe(false);
	});
});
