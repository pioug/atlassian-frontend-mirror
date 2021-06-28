import { PluginKey } from 'prosemirror-state';
import { isColumnSelected } from '@atlaskit/editor-tables/utils';
import {
  doc,
  table,
  tdEmpty,
  tr,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import panelPlugin from '../../../../panel';
import { selectColumn } from '../../../commands';
import { getDecorations } from '../../../pm-plugins/decorations/plugin';
import { getPluginState, pluginKey } from '../../../pm-plugins/plugin-factory';
import { TableDecorations, TablePluginState } from '../../../types';
import tablePlugin from '../../../';

describe('table plugin: commands', () => {
  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>().add(panelPlugin).add([
    tablePlugin,
    {
      tableOptions: { allowHeaderColumn: true },
    },
  ]);
  const editor = (doc: DocBuilder) =>
    createEditor<TablePluginState, PluginKey>({
      doc,
      preset,
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
        (spec) => spec.key.indexOf(TableDecorations.COLUMN_SELECTED) > -1,
      );

      expect(columnSelectedDecorations).toHaveLength(1);
    });
  });
});
