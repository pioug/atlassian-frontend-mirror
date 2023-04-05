import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, p, ol, li } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  blockTypePlugin,
  listPlugin,
  panelPlugin,
  pastePlugin,
} from '../../../plugins';
import { doesSelectionWhichStartsOrEndsInListContainEntireList } from '../../lists';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';

describe('doesSelectionWhichStartsOrEndsInListContainEntireList', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) => {
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([pastePlugin, {}])
      .add(listPlugin)
      .add(panelPlugin)
      .add(blockTypePlugin);
    return createEditor({
      doc,
      preset,
    });
  };
  it('should return true for selection of entire list', () => {
    const { editorView } = editor(
      doc(ol()('{<}', li(p('One')), li(p('Two')), li(p('Three{>}')))),
    );
    expect(
      doesSelectionWhichStartsOrEndsInListContainEntireList(
        editorView.state.selection,
      ),
    ).toBe(true);
  });

  it('should return true for selection starting in paragraph and ending at end of list', () => {
    const { editorView } = editor(
      doc(p('{<}hello'), ol()(li(p('One')), li(p('Two')), li(p('Three{>}')))),
    );
    expect(
      doesSelectionWhichStartsOrEndsInListContainEntireList(
        editorView.state.selection,
      ),
    ).toBe(true);
  });

  it('should return true for selection starting at the start of a list and ending in a paragraph', () => {
    const { editorView } = editor(
      doc(
        ol()('{<}', li(p('One')), li(p('Two')), li(p('Three'))),
        p('goodbye{>}'),
      ),
    );
    expect(
      doesSelectionWhichStartsOrEndsInListContainEntireList(
        editorView.state.selection,
      ),
    ).toBe(true);
  });

  it('should return false for selection of no list', () => {
    const { editorView } = editor(doc(p('{<}Hello{>}')));
    expect(
      doesSelectionWhichStartsOrEndsInListContainEntireList(
        editorView.state.selection,
      ),
    ).toBe(false);
  });

  it('should return false for selection starting in paragraph and ending inside a list', () => {
    const { editorView } = editor(
      doc(p('{<}hello'), ol()(li(p('One{>}')), li(p('Two')), li(p('Three')))),
    );
    expect(
      doesSelectionWhichStartsOrEndsInListContainEntireList(
        editorView.state.selection,
      ),
    ).toBe(false);
  });

  it('should return false for selection inside a list', () => {
    const { editorView } = editor(
      doc(ol()(li(p('{<}One')), li(p('Two{>}')), li(p('Three')))),
    );
    expect(
      doesSelectionWhichStartsOrEndsInListContainEntireList(
        editorView.state.selection,
      ),
    ).toBe(false);
  });
});
