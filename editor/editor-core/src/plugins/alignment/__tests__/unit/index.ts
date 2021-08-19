import { PluginKey } from 'prosemirror-state';
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
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { pluginKey as alignmentPluginKey } from '../../pm-plugins/main';
import { changeAlignment } from '../../commands';
import { insertBlockType } from '../../../block-type/commands';
import { toggleBulletList } from '../../../list/commands';

import alignmentPlugin from '../../';
import tablePlugin from '../../../table';

import panelPlugin from '../../../panel';
import listPlugin from '../../../list';
import codeBlockPlugin from '../../../code-block';
import blockTypePlugin from '../../../block-type';
import { AlignmentPluginState } from '../../pm-plugins/types';

const alignmentPreset = new Preset<LightEditorPlugin>()
  .add(alignmentPlugin)
  .add(tablePlugin)
  .add(listPlugin)
  .add(codeBlockPlugin)
  .add(blockTypePlugin)
  .add(panelPlugin);

describe('alignment', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor<AlignmentPluginState, PluginKey>({
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
      insertBlockType('panel')(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(p('hello{<>}'))),
      );
    });

    it('Removes alignment when the text is toggled to a list', () => {
      const { editorView } = editor(
        doc(alignmentMark({ align: 'end' })(p('{<>}hello'))),
      );
      toggleBulletList(editorView);
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
