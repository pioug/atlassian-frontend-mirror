import {
  doc,
  ul,
  ol,
  li,
  p,
  panel,
  table,
  tr,
  td,
  layoutSection,
  layoutColumn,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { deleteAndMoveCursor } from '../../../commands/delete-and-move-cursor';
import listPlugin from '../../../../list';
import codeBlockPlugin from '../../../../code-block';
import layoutPlugin from '../../../../layout';
import mediaPlugin from '../../../../media';
import panelPlugin from '../../../../panel';
import floatingToolbarPlugin from '../../../../floating-toolbar';

import editorDisabledPlugin from '../../../../editor-disabled';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

describe('delete behaviour - cursor position after delete', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}])
      .add(contentInsertionPlugin)
      .add(editorDisabledPlugin)
      .add(decorationsPlugin)
      .add(listPlugin)
      .add([codeBlockPlugin, { appearance: 'full-page' }])
      .add(layoutPlugin)
      .add(widthPlugin)
      .add(gridPlugin)
      .add(floatingToolbarPlugin)
      .add([mediaPlugin, { allowMediaSingle: true }])
      .add(tablesPlugin)
      .add(panelPlugin);

    return createEditor({
      doc,
      preset,
    });
  };

  describe('when deleting an unordered list in a layout', () => {
    it('should not move cursor to right when deleting in a layout', () => {
      const initialDoc = doc(
        layoutSection(
          layoutColumn({ width: 50 })(
            ul(li(p('{<}a')), li(p('b')), li(p('c{>}'))),
          ),
          layoutColumn({ width: 50 })(p('')),
        ),
      );

      const expectedDoc = doc(
        layoutSection(
          layoutColumn({ width: 50 })(p('')),
          layoutColumn({ width: 50 })(p('')),
        ),
      );

      const { editorView } = editor(initialDoc);
      deleteAndMoveCursor(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should not move cursor to right when deleting nested list in a layout', () => {
      const initialDoc = doc(
        layoutSection(
          layoutColumn({ width: 50 })(
            ul(li(p('{<}a'), ul(li(p('b'), ul(li(p('c{>}'))))))),
          ),
          layoutColumn({ width: 50 })(p('')),
        ),
      );

      const expectedDoc = doc(
        layoutSection(
          layoutColumn({ width: 50 })(p('')),
          layoutColumn({ width: 50 })(p('')),
        ),
      );

      const { editorView } = editor(initialDoc);
      deleteAndMoveCursor(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('when deleting in table cell', () => {
    const TABLE_LOCAL_ID = 'test-table-local-id';

    it('should not move cursor to right when deleting in table cell with text in panel', () => {
      const initialDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(
            td()(panel()(p('AA{<}AA')), p('BBBB{>}')),
            td()(p('')),
            td()(p('')),
          ),
        ),
      );

      const expectedDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(td()(panel()(p('AA{<>}'))), td()(p('')), td()(p(''))),
        ),
      );

      const { editorView } = editor(initialDoc);
      deleteAndMoveCursor(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should not move cursor to right when deleting in table cell', () => {
      const initialDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(
            td()(ul(li(p('{<}a')), li(p('b')), li(p('c{>}')))),
            td()(p('')),
            td()(p('')),
          ),
        ),
      );

      const expectedDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(td()(p('{<>}')), td()(p('')), td()(p(''))),
        ),
      );

      const { editorView } = editor(initialDoc);
      deleteAndMoveCursor(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should not move cursor to right when deleting nested list in table cell', () => {
      const initialDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(
            td()(ul(li(p('{<}a'), ul(li(p('b'), ul(li(p('c{>}')))))))),
            td()(p('')),
            td()(p('')),
          ),
        ),
      );

      const expectedDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(td()(p('{<>}')), td()(p('')), td()(p(''))),
        ),
      );

      const { editorView } = editor(initialDoc);
      deleteAndMoveCursor(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('when deleting an ordered list in table cell', () => {
    const TABLE_LOCAL_ID = 'test-table-local-id';

    it('should not move cursor to right when deleting in table cell', () => {
      const initialDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(
            td()(ol()(li(p('{<}a')), li(p('b')), li(p('c{>}')))),
            td()(p('')),
            td()(p('')),
          ),
        ),
      );

      const expectedDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(td()(p('{<>}')), td()(p('')), td()(p(''))),
        ),
      );

      const { editorView } = editor(initialDoc);
      deleteAndMoveCursor(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should not move cursor to right when deleting in table cell with text after list', () => {
      const initialDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(
            td()(ol()(li(p('{<}a')), li(p('b')), li(p('c'))), p('0000{>}')),
            td()(p('')),
            td()(p('')),
          ),
        ),
      );

      const expectedDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(td()(ol()(li(p('{<>}')))), td()(p('')), td()(p(''))),
        ),
      );

      const { editorView } = editor(initialDoc);
      deleteAndMoveCursor(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should not move cursor to right when deleting nested list in table cell', () => {
      const initialDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(
            td()(ol()(li(p('{<}a'), ol()(li(p('b'), ol()(li(p('c{>}')))))))),
            td()(p('')),
            td()(p('')),
          ),
        ),
      );

      const expectedDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(td()(p('{<>}')), td()(p('')), td()(p(''))),
        ),
      );

      const { editorView } = editor(initialDoc);
      deleteAndMoveCursor(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should not move cursor to right when deleting nested list in table cell with ghost selection', () => {
      const initialDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(
            td()(
              ol()(li('{<}', p('a'), ol()(li(p('b'), ol()(li(p('c{>}'))))))),
            ),
            td()(p('')),
            td()(p('')),
          ),
        ),
      );

      const expectedDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(td()(p('{<>}')), td()(p('')), td()(p(''))),
        ),
      );

      const { editorView } = editor(initialDoc);
      deleteAndMoveCursor(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should not move cursor to right when partially deleting list in table cell', () => {
      const initialDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(
            td()(ol()(li(p('a')), li(p('{<}b')), li(p('c{>}')))),
            td()(p('')),
            td()(p('')),
          ),
        ),
      );

      const expectedDoc = doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(td()(ol()(li(p('a')), li(p('{<>}')))), td()(p('')), td()(p(''))),
        ),
      );

      const { editorView } = editor(initialDoc);
      deleteAndMoveCursor(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('when selection is not TextSelection', () => {
    it('should return false', () => {
      const initialDoc = doc(
        table({ localId: 'TABLE_LOCAL_ID' })(
          // prettier-ignore
          tr(
            td()(
              '{<node>}',
              panel()(p('panel selected'))
            ),
            td()(p('')),
            td()(p('hello')),
          ),
        ),
      );

      const { editorView } = editor(initialDoc);
      expect(
        deleteAndMoveCursor(editorView.state, editorView.dispatch),
      ).toBeFalsy();
    });
  });
});
