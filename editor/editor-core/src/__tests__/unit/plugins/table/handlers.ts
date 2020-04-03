import { DecorationSet } from 'prosemirror-view';
import { TextSelection } from 'prosemirror-state';
import { addColumnAt } from 'prosemirror-utils';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  TablePluginState,
  TableDecorations,
} from '../../../../plugins/table/types';
import { handleDocOrSelectionChanged } from '../../../../plugins/table/handlers';
import { pluginKey } from '../../../../plugins/table/pm-plugins/plugin-factory';
import { defaultTableSelection } from '../../../../plugins/table/pm-plugins/default-table-selection';

describe('table action handlers', () => {
  let editor: any;
  let defaultPluginState: any;

  beforeEach(() => {
    const createEditor = createEditorFactory<TablePluginState>();
    editor = (doc: any) =>
      createEditor({
        doc,
        editorProps: { allowTables: true },
        pluginKey,
      });

    defaultPluginState = {
      ...defaultTableSelection,
      decorationSet: DecorationSet.empty,
      pluginConfig: {},
      editorHasFocus: true,
      isHeaderColumnEnabled: false,
      isHeaderRowEnabled: true,
    };
  });

  describe('#handleDocOrSelectionChanged', () => {
    it('should return a new state with updated tableNode prop and reset selection', () => {
      const pluginState = {
        ...defaultPluginState,
        hoveredColumns: [1, 2, 3],
        hoveredRows: [1, 2, 3],
        isInDanger: true,
        tableNode: undefined,
        targetCellPosition: undefined,
      };
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
      );
      const { state } = editorView;
      const cursorPos = 8;
      editorView.dispatch(
        state.tr.setSelection(new TextSelection(state.doc.resolve(cursorPos))),
      );

      const newState = handleDocOrSelectionChanged(
        editorView.state.tr,
        pluginState,
      );

      delete newState.decorationSet;
      delete pluginState.decorationSet;

      expect(newState).toEqual({
        ...pluginState,
        ...defaultTableSelection,
        tableNode: editorView.state.doc.firstChild,
        targetCellPosition: cursorPos - 2,
      });
    });

    describe('#decorationSet', () => {
      describe('when the doc did not changed', () => {
        it('should not re-create the decorations', () => {
          const pluginState = {
            ...defaultPluginState,
          };
          const { editorView } = editor(
            doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
          );

          const oldState = handleDocOrSelectionChanged(
            editorView.state.tr,
            pluginState,
          );

          const newState = handleDocOrSelectionChanged(
            editorView.state.tr,
            oldState,
          );

          expect(newState.decorationSet).toEqual(oldState.decorationSet);
        });
      });

      describe('when the table changed', () => {
        it('should re-create the column controls decorations', () => {
          const { editorView } = editor(
            doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
          );
          const { state } = editorView;

          const nextPluginState = handleDocOrSelectionChanged(
            editorView.state.tr,
            defaultPluginState,
          );

          const { tr: transaction } = state;
          editorView.dispatch(addColumnAt(2)(transaction));

          const newState = handleDocOrSelectionChanged(
            transaction,
            nextPluginState,
          );
          const expectedDecorationSet = newState.decorationSet;
          const decorations = expectedDecorationSet.find(
            undefined,
            undefined,
            spec =>
              spec.key.indexOf(TableDecorations.COLUMN_CONTROLS_DECORATIONS) >
              -1,
          );

          expect(decorations).toHaveLength(3);
        });
      });

      describe('when nothing changed', () => {
        it('should not re-create the column controls decorations', () => {
          const { editorView } = editor(
            doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
          );
          const oldPluginState = handleDocOrSelectionChanged(
            editorView.state.tr,
            defaultPluginState,
          );

          const newPluginState = handleDocOrSelectionChanged(
            editorView.state.tr,
            oldPluginState,
          );
          expect(oldPluginState.decorationSet).toEqual(
            newPluginState.decorationSet,
          );
        });
      });
    });
  });
});
