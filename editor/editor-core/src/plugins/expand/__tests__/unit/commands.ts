import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, p, expand } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { toggleExpandExpanded } from '../../commands';
import expandPlugin from '../../index';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

describe('Expand Commands', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add(decorationsPlugin)
        .add(expandPlugin),
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
