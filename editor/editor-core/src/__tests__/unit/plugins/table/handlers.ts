import { TextSelection } from 'prosemirror-state';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  tr,
  tdEmpty,
  tdCursor,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { TablePluginState } from '@atlaskit/editor-plugin-table/types';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { handleDocOrSelectionChanged } from '@atlaskit/editor-plugin-table/src/plugins/table/handlers';
import { pluginKey } from '@atlaskit/editor-plugin-table/plugin-key';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { defaultTableSelection } from '@atlaskit/editor-plugin-table/src/plugins/table/pm-plugins/default-table-selection';

describe('table action handlers', () => {
  let editor: any;
  let defaultPluginState: any;

  beforeEach(() => {
    const createEditor = createEditorFactory<TablePluginState>();
    editor = (doc: DocBuilder) =>
      createEditor({
        doc,
        editorProps: { allowTables: true },
        pluginKey,
      });

    defaultPluginState = {
      ...defaultTableSelection,
      pluginConfig: {},
      editorHasFocus: true,
      isNumberColumnEnabled: false,
      isHeaderColumnEnabled: false,
      isHeaderRowEnabled: false,
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
        ordering: undefined,
        resizeHandleColumnIndex: undefined,
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

      expect(newState).toEqual({
        ...pluginState,
        ...defaultTableSelection,
        tableNode: editorView.state.doc.firstChild,
        targetCellPosition: cursorPos - 2,
      });
    });
  });
});
