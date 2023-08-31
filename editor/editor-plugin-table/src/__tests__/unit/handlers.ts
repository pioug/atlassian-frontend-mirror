import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  doc,
  table,
  tdCursor,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../plugins/table-plugin';
import { handleDocOrSelectionChanged } from '../../plugins/table/handlers';
import { defaultTableSelection } from '../../plugins/table/pm-plugins/default-table-selection';
import { pluginKey } from '../../plugins/table/pm-plugins/plugin-key';
import type { TablePluginState } from '../../plugins/table/types';

describe('table action handlers', () => {
  let editor: any;
  let defaultPluginState: any;

  beforeEach(() => {
    const createEditor = createProsemirrorEditorFactory();
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}])
      .add(contentInsertionPlugin)
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add(tablePlugin);

    editor = (doc: DocBuilder) =>
      createEditor<TablePluginState, PluginKey, typeof preset>({
        doc,
        preset,
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
