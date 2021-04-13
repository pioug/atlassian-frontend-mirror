import { findTable } from '@atlaskit/editor-tables/utils';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  th,
  tdEmpty,
  tdCursor,
  thEmpty,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { TablePluginState } from '../../../../../plugins/table/types';
import { containsHeaderColumn } from '../../../../../plugins/table/utils/nodes';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';

describe('table merging logic', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      pluginKey,
    });

  describe('#containsHeaderColumn', () => {
    it('should return true when first col is all tableHeaders', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, tdCursor, tdEmpty),
            tr(thEmpty, tdEmpty, tdEmpty),
            tr(thEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      const TableWithPos = findTable(editorView.state.selection)!;
      expect(containsHeaderColumn(editorView.state, TableWithPos.node)).toEqual(
        true,
      );
    });

    it('should return true when first col has a rowspan', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, tdCursor, tdEmpty),
            tr(th({ rowspan: 2 })(p()), tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty),
          ),
        ),
      );

      const TableWithPos = findTable(editorView.state.selection)!;
      expect(containsHeaderColumn(editorView.state, TableWithPos.node)).toEqual(
        true,
      );
    });
  });
});
