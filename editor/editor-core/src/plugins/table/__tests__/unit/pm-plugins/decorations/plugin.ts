import { Selection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { addColumnAt } from 'prosemirror-utils';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { TablePluginState, TableDecorations } from '../../../../types';
import { selectColumn } from '../../../../commands';
import { pluginKey } from '../../../../pm-plugins/plugin-factory';
import {
  getDecorations,
  handleDocOrSelectionChanged,
} from '../../../../pm-plugins/decorations/plugin';

describe('decorations plugin', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      pluginKey,
    });

  // ED-8457
  describe('when there is a selection pointer set', () => {
    it('should remove the column selected decorations', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
      );

      selectColumn(1)(editorView.state, editorView.dispatch);

      const { tr: transaction } = editorView.state;

      transaction.setMeta('pointer', true);
      transaction.setSelection(Selection.atStart(transaction.doc));
      editorView.dispatch(transaction);

      const decorationSet = getDecorations(editorView.state);

      const columnSelectedDecorations = decorationSet.find(
        undefined,
        undefined,
        spec => spec.key.indexOf(TableDecorations.COLUMN_SELECTED) > -1,
      );

      expect(columnSelectedDecorations).toHaveLength(0);
    });
  });

  describe('when the doc did not changed', () => {
    it('should not re-create the decorations', () => {
      const pluginState = DecorationSet.empty;
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

      expect(newState).toEqual(oldState);
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
        DecorationSet.empty,
      );

      const { tr: transaction } = state;
      editorView.dispatch(addColumnAt(2)(transaction));

      const newState = handleDocOrSelectionChanged(
        transaction,
        nextPluginState,
      );
      const expectedDecorationSet = newState;
      const decorations = expectedDecorationSet.find(
        undefined,
        undefined,
        spec =>
          spec.key.indexOf(TableDecorations.COLUMN_CONTROLS_DECORATIONS) > -1,
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
        DecorationSet.empty,
      );

      const newPluginState = handleDocOrSelectionChanged(
        editorView.state.tr,
        oldPluginState,
      );
      expect(oldPluginState).toEqual(newPluginState);
    });
  });
});