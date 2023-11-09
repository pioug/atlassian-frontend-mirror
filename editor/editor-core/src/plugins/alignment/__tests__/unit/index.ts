import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  h1,
  panel,
  code_block,
  alignment as alignmentMark,
  table,
  td,
  tr,
  ul,
  li,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { pluginKey as alignmentPluginKey } from '../../pm-plugins/main';
import { changeAlignment } from '../../commands';
import { wrapSelectionIn } from '@atlaskit/editor-common/utils';

import alignmentPlugin from '../../';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';

import { panelPlugin } from '@atlaskit/editor-plugin-panel';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import type { AlignmentPluginState } from '../../pm-plugins/types';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';

const alignmentPreset = new Preset<LightEditorPlugin>()
  .add([featureFlagsPlugin, {}])
  .add([analyticsPlugin, {}])
  .add(contentInsertionPlugin)
  .add(decorationsPlugin)
  .add(alignmentPlugin)
  .add(widthPlugin)
  .add(guidelinePlugin)
  .add(selectionPlugin)
  .add(tablesPlugin)
  .add(listPlugin)
  .add(compositionPlugin)
  .add([codeBlockPlugin, { appearance: 'full-page' }])
  .add(blockTypePlugin)
  .add(panelPlugin);

describe('alignment', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor<AlignmentPluginState, PluginKey, typeof alignmentPreset>({
      doc,
      pluginKey: alignmentPluginKey,
      preset: alignmentPreset,
    });

  describe('applies alignment', () => {
    it('should be able to add alignment to a top level paragraph', () => {
      const { editorView } = editor(doc(p('hello{<>}')));
      const { dispatch, state } = editorView;
      changeAlignment('end')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(alignmentMark({ align: 'end' })(p('hello{<>}'))),
      );
    });

    it('applies alignment only to the current paragraph', () => {
      const { editorView } = editor(doc(p('hello{<>}'), p('world')));
      const { dispatch, state } = editorView;
      changeAlignment('end')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(alignmentMark({ align: 'end' })(p('hello{<>}')), p('world')),
      );
    });

    it('should be able to add alignment to a top level heading', () => {
      const { editorView } = editor(doc(h1('hello{<>}')));
      const { dispatch, state } = editorView;
      changeAlignment('end')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(alignmentMark({ align: 'end' })(h1('hello{<>}'))),
      );
    });

    it('applies alignment to multiple paragraphs', () => {
      const { editorView } = editor(
        doc(p('{<}hello'), panel()(p('hello')), p('world{>}')),
      );
      const { dispatch, state } = editorView;
      changeAlignment('end')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          alignmentMark({ align: 'end' })(p('{<}hello')),
          panel()(p('hello')),
          alignmentMark({ align: 'end' })(p('world{>}')),
        ),
      );
    });
  });

  describe('Does not apply inside special block nodes', () => {
    it('Does not apply to paragraph inside a panel', () => {
      const { editorView } = editor(doc(panel()(p('hello{<>}'))));
      const { dispatch, state } = editorView;
      changeAlignment('end')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(p('hello{<>}'))),
      );
    });

    it('Does not apply to paragraph inside a codeblock', () => {
      const { editorView } = editor(doc(code_block()('hello{<>}')));
      const { dispatch, state } = editorView;
      changeAlignment('end')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('hello{<>}')),
      );
    });

    it('Removes alignment when panel is added to the selection', () => {
      const { editorView } = editor(
        doc(alignmentMark({ align: 'end' })(p('hello{<>}'))),
      );
      const { dispatch, state } = editorView;
      wrapSelectionIn(state.schema.nodes.panel)(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(p('hello{<>}'))),
      );
    });

    it('Removes alignment when the text is toggled to a list', () => {
      const { editorView, editorAPI } = editor(
        doc(alignmentMark({ align: 'end' })(p('{<>}hello'))),
      );
      editorAPI.core.actions.execute(
        editorAPI.list.commands.toggleBulletList(INPUT_METHOD.TOOLBAR),
      );
      expect(editorView.state.doc).toEqualDocument(doc(ul(li(p('hello')))));
    });
  });

  describe('Adds alignment to top level paragraphs inside tables', () => {
    const TABLE_LOCAL_ID = 'test-table-local-id';
    it('Does not apply to paragraph inside a table', () => {
      const { editorView } = editor(
        doc(
          p('text'),
          table({ localId: TABLE_LOCAL_ID })(
            tr(td({})(p('hello')), td({})(p('world{<>}'))),
          ),
        ),
      );
      const { dispatch, state } = editorView;
      changeAlignment('end')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          table({ localId: TABLE_LOCAL_ID })(
            tr(
              td({})(p('hello')),
              td({})(alignmentMark({ align: 'end' })(p('world{<>}'))),
            ),
          ),
        ),
      );
    });
  });
});
