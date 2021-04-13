import {
  setCellAttrs,
  findCellClosestToPos,
} from '@atlaskit/editor-tables/utils';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  tdEmpty,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { tableBackgroundColorNames, rgbToHex } from '@atlaskit/adf-schema';
import {
  TablePluginState,
  PluginConfig,
} from '../../../../../plugins/table/types';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';
import TableCellViews from '../../../../../plugins/table/nodeviews/tableCell';
describe('table -> nodeviews -> cell.tsx', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder, props?: PluginConfig) =>
    createEditor({
      doc,
      editorProps: {
        allowTables: { advanced: true, ...props },
      },
      pluginKey,
    });

  describe('when background color is set to "red"', () => {
    it('should update cell DOM node style attribute with the new color', () => {
      const {
        editorView,
        refs: { pos },
      } = editor(
        doc(p('text'), table()(tr(td()(p('{pos}text')), tdEmpty, tdEmpty))),
      );
      const { state, dispatch } = editorView;
      const cell = findCellClosestToPos(state.doc.resolve(pos))!;
      const background = tableBackgroundColorNames.get('red');
      dispatch(setCellAttrs(cell, { background })(state.tr));
      const cellDomNode = document.querySelector('td')!;
      expect(rgbToHex(cellDomNode.style.backgroundColor!)).toEqual(background);
    });
  });

  describe('when background color is set to "white"', () => {
    it('should remove backgroundColor style attribute from cell DOM node ', () => {
      const {
        editorView,
        refs: { pos },
      } = editor(
        doc(
          p('text'),
          table()(
            tr(td({ background: 'red' })(p('{pos}text')), tdEmpty, tdEmpty),
          ),
        ),
      );
      const { state, dispatch } = editorView;
      const cell = findCellClosestToPos(state.doc.resolve(pos))!;
      const background = tableBackgroundColorNames.get('white');
      dispatch(setCellAttrs(cell, { background })(state.tr));
      const cellDomNode = document.querySelector('td')!;
      expect(cellDomNode.style.backgroundColor).toEqual('');
    });
  });

  describe('nodeview update', () => {
    it('should not recreate nodeviews on attrs update', () => {
      const {
        editorView,
        refs: { pos },
      } = editor(
        doc(p('text'), table()(tr(td()(p('{pos}text')), tdEmpty, tdEmpty))),
        {
          tableCellOptimization: true,
        },
      );
      jest.clearAllMocks();

      const { state, dispatch } = editorView;
      const cell = findCellClosestToPos(state.doc.resolve(pos))!;
      const background = tableBackgroundColorNames.get('red');
      const updateSpy = jest.spyOn(TableCellViews.prototype, 'update');
      dispatch(setCellAttrs(cell, { background })(state.tr));
      expect(updateSpy).toHaveReturnedWith(true);
      const cellDomNode = document.querySelector('td')!;
      expect(rgbToHex(cellDomNode.style.backgroundColor!)).toEqual(background);
    });
  });
});
