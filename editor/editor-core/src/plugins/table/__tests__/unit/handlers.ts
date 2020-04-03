import { DecorationSet } from 'prosemirror-view';
import { Selection } from 'prosemirror-state';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { TablePluginState, TableDecorations } from '../../types';
import { selectColumn } from '../../commands';
import { handleDocOrSelectionChanged } from '../../handlers';
import { pluginKey } from '../../pm-plugins/plugin-factory';
import { defaultTableSelection } from '../../pm-plugins/default-table-selection';

describe('table plugin: handlers', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      pluginKey,
    });

  const defaultTablePluginState = {
    ...defaultTableSelection,
    decorationSet: DecorationSet.empty,
    pluginConfig: {},
    editorHasFocus: true,
    isHeaderColumnEnabled: false,
    isHeaderRowEnabled: true,
  };

  describe('#handleDocOrSelectionChanged', () => {
    describe('when there is a selection pointer set', () => {
      it('should remove the column selected decorations', () => {
        const { editorView } = editor(
          doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
        );

        selectColumn(1)(editorView.state, editorView.dispatch);

        const { tr: transaction } = editorView.state;

        transaction.setMeta('pointer', true);
        transaction.setSelection(Selection.atStart(transaction.doc));

        const { decorationSet } = handleDocOrSelectionChanged(
          transaction,
          defaultTablePluginState,
        );

        const columnSelectedDecorations = decorationSet.find(
          undefined,
          undefined,
          spec => spec.key.indexOf(TableDecorations.COLUMN_SELECTED) > -1,
        );

        expect(columnSelectedDecorations).toHaveLength(0);
      });
    });
  });
});
