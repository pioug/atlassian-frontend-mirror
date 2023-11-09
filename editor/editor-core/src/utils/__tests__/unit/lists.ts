// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, ol, li } from '@atlaskit/editor-test-helpers/doc-builder';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import { pastePlugin } from '../../../plugins';
import { panelPlugin } from '@atlaskit/editor-plugin-panel';
import { betterTypeHistoryPlugin } from '@atlaskit/editor-plugin-better-type-history';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { doesSelectionWhichStartsOrEndsInListContainEntireList } from '../../../plugins/paste/handlers';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

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
      doc(
        ol()('{<}', li(p('One')), li(p('Two')), li(p('Three'))),
        p('goodbye{>}'),
      ),
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
