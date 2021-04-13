import {
  Preset,
  createProsemirrorEditorFactory,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  expand,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { toggleExpandExpanded } from '../../commands';
import expandPlugin from '../../index';

describe('Expand Commands', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(expandPlugin),
    });
  };

  describe('toggleExpandExpanded()', () => {
    it('should move to right gap cursor if selection is inside the expand when collapsing', () => {
      const { editorView, refs } = editor(
        doc('{expandPos}', expand()(p('{<>}'))),
      );
      const { state, dispatch } = editorView;

      toggleExpandExpanded(refs.expandPos, state.schema.nodes.expand)(
        state,
        dispatch,
      );

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(expand({ __expanded: false })(p('')), '{<|gap>}'),
      );
    });

    it('should leave selection along if outside the expand when collapsing', () => {
      const { editorView, refs } = editor(
        doc(p('Hello!{<>}'), '{expandPos}', expand()(p())),
      );
      const { state, dispatch } = editorView;

      toggleExpandExpanded(refs.expandPos, state.schema.nodes.expand)(
        state,
        dispatch,
      );

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(p('Hello!{<>}'), expand({ __expanded: false })(p())),
      );
    });
  });
});
