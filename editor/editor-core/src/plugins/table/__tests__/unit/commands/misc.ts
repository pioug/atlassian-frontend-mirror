import { isColumnSelected } from 'prosemirror-utils';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  tr,
  tdEmpty,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { selectColumn } from '../../../commands';
import { EditorProps } from '../../../../../types';
import { TablePluginState, TableDecorations } from '../../../types';
import { getPluginState, pluginKey } from '../../../pm-plugins/plugin-factory';
import { getDecorations } from '../../../pm-plugins/decorations/plugin';

describe('table plugin: commands', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const editor = (doc: any, props: Partial<EditorProps> = {}) =>
    createEditor({
      doc,
      editorProps: {
        allowTables: {
          allowHeaderRow: true,
        },
        allowPanel: true,
        ...props,
      },
      pluginKey,
    });

  describe('#selectColumn', () => {
    it('should select a column and set targetCellPosition to point to the first cell', () => {
      const { editorView } = editor(doc(table()(tr(tdEmpty, tdEmpty))));
      const { state, dispatch } = editorView;
      selectColumn(1)(state, dispatch);
      const pluginState = getPluginState(editorView.state);
      expect(pluginState.targetCellPosition).toEqual(6);
      expect(isColumnSelected(1)(editorView.state.selection));
    });

    it('should create decorations to select the column', () => {
      const { editorView } = editor(doc(table()(tr(tdEmpty, tdEmpty))));
      const { state, dispatch } = editorView;
      selectColumn(1)(state, dispatch);
      const decorationSet = getDecorations(editorView.state);
      const columnSelectedDecorations = decorationSet.find(
        undefined,
        undefined,
        spec => spec.key.indexOf(TableDecorations.COLUMN_SELECTED) > -1,
      );

      expect(columnSelectedDecorations).toHaveLength(1);
    });
  });
});
