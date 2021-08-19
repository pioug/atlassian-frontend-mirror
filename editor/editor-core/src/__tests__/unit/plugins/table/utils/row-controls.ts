import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findTable } from '@atlaskit/editor-tables/utils';
import { uuid } from '@atlaskit/adf-schema';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr as row,
  th,
  td,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { TablePluginState } from '../../../../../plugins/table/types';
import { copyPreviousRow } from '../../../../../plugins/table/utils/row-controls';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('table plugin: utils/row-controls.js', () => {
  beforeAll(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
  });

  afterAll(() => {
    uuid.setStatic(false);
  });

  const createEditor = createEditorFactory<TablePluginState>();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      pluginKey,
    });

  describe('#copyPreviousRow', () => {
    describe('complex table', () => {
      it('should accept rowIndex zero', () => {
        const { editorView } = editor(
          doc(
            table()(
              row(th()(p('{<>}a1')), th()(p('a2')), th()(p('a3'))),
              row(th()(p('b1')), td()(p('b3')), td()(p('b3'))),
            ),
          ),
        );
        const { state } = editorView;
        expect(() => {
          copyPreviousRow(state.schema)(0)(state.tr);
        }).toThrow(
          /Row Index less or equal 0 isn't not allowed since there is not a previous to copy/,
        );
      });

      it('should copy column header', () => {
        const { editorView } = editor(
          doc(
            table()(
              row(th()(p('{<>}a1')), th()(p('a2')), th()(p('a3'))),
              row(th()(p('b1')), td()(p('b3')), td()(p('b3'))),
            ),
          ),
        );
        const { state } = editorView;
        const newTr = copyPreviousRow(state.schema)(2)(state.tr);
        expect(newTr.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              row(th()(p('{<>}a1')), th()(p('a2')), th()(p('a3'))),
              row(th()(p('b1')), td()(p('b3')), td()(p('b3'))),
              row(th()(p('')), td()(p('')), td()(p(''))),
            ),
          ),
        );
      });

      it('should copy column header with colspan', () => {
        const { editorView } = editor(
          doc(
            table()(
              row(th()(p('{<>}a1')), th()(p('a2')), th()(p('a3'))),
              row(th({ colspan: 2 })(p('b1')), td()(p('b3'))),
            ),
          ),
        );
        const { state } = editorView;
        const newTr = copyPreviousRow(state.schema)(2)(state.tr);
        expect(newTr.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              row(th()(p('{<>}a1')), th()(p('a2')), th()(p('a3'))),
              row(th({ colspan: 2 })(p('b1')), td()(p('b3'))),
              row(th({ colspan: 2 })(p('')), td()(p(''))),
            ),
          ),
        );
      });

      it('should keep colspan', () => {
        const { editorView } = editor(
          doc(
            table()(
              row(th()(p('{<>}a1')), th()(p('a2')), th()(p('a3'))),
              row(td({ colspan: 2 })(p('b1')), td()(p('b3'))),
            ),
          ),
        );

        const { state } = editorView;
        const newTr = copyPreviousRow(state.schema)(2)(state.tr);
        expect(newTr.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              row(th()(p('{<>}a1')), th()(p('a2')), th()(p('a3'))),
              row(td({ colspan: 2 })(p('b1')), td()(p('b3'))),
              row(td({ colspan: 2 })(p('')), td()(p(''))),
            ),
          ),
        );
      });

      it('should copy background colors and does not expand previous rowspan', () => {
        const { editorView } = editor(
          doc(
            table()(
              row(th()(p('{<>}a1')), th()(p('a2')), th()(p('a3'))),
              row(
                td()(p('b1')),
                td()(p('b2')),
                td({ background: '#eeeaaa', rowspan: 4 })(p('b3')),
              ),
              row(td()(p('c1')), td()(p('c2'))),
              row(
                td()(p('d1')),
                td({ background: '#fffaaa', rowspan: 3 })(p('d2')),
              ),
              row(td()(p('XXXX'))),
              row(td()(p('e1')), td()(p('e2'))),
              row(td()(p('f1')), td()(p('f2')), td()(p('f3'))),
            ),
          ),
        );
        const { state } = editorView;

        const newTr = copyPreviousRow(state.schema)(5)(state.tr);

        const newTable = findTable(newTr.selection);
        const map = TableMap.get(newTable!.node);
        expect(map.problems).toBeNull();
        expect(newTr.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              row(th()(p('a1')), th()(p('a2')), th()(p('a3'))),
              row(
                td()(p('b1')),
                td()(p('b2')),
                td({ background: '#eeeaaa', rowspan: 4 })(p('b3')),
              ),
              row(td()(p('c1')), td()(p('c2'))),
              row(
                td()(p('d1')),
                td({ background: '#fffaaa', rowspan: 4 })(p('d2')),
              ),
              row(td()(p('XXXX'))),
              row(td()(p('')), td({ background: '#eeeaaa' })(p(''))),
              row(td()(p('e1')), td()(p('e2'))),
              row(td()(p('f1')), td()(p('f2')), td()(p('f3'))),
            ),
          ),
        );
      });
    });
  });
});
