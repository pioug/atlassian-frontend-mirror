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
  thEmpty,
  th,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  tableBackgroundColorNames,
  rgbToHex,
  uuid,
} from '@atlaskit/adf-schema';
import {
  TablePluginState,
  PluginConfig,
} from '../../../../../plugins/table/types';
import { mergeCells } from '../../../../../plugins/table/transforms';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';
import TableCellViews from '../../../../../plugins/table/nodeviews/tableCell';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import * as domHelpers from '../../../../../plugins/table/pm-plugins/sticky-headers/nodeviews/dom';

jest.mock('@atlaskit/editor-common', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common'),
  browser: {
    chrome: false,
  },
}));

describe('table -> nodeviews -> tableCell.tsx', () => {
  const TABLE_LOCAL_ID = 'test-table-local-id';
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
    beforeAll(() => {
      uuid.setStatic(TABLE_LOCAL_ID);
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

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

  describe('with tableCellOptimization on', () => {
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
        const { state, dispatch } = editorView;
        const cell = findCellClosestToPos(state.doc.resolve(pos))!;
        const background = tableBackgroundColorNames.get('red');
        const updateSpy = jest.spyOn(TableCellViews.prototype, 'update');
        dispatch(setCellAttrs(cell, { background })(state.tr));
        expect(updateSpy).toHaveReturnedWith(true);
        const cellDomNode = document.querySelector('td')!;
        expect(rgbToHex(cellDomNode.style.backgroundColor!)).toEqual(
          background,
        );
      });

      it('preserves correct rowspan and colspan after merge cells and undo', () => {
        jest.spyOn(domHelpers, 'getTop').mockImplementation(() => 0);

        const originalDoc = doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(th()(p('{<cell}')), thEmpty, thEmpty),
            tr(td()(p('{cell>}')), tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        );
        const { editorView } = editor(originalDoc, {
          stickyHeaders: true,
          tableCellOptimization: true,
        });
        const { state, dispatch } = editorView;

        dispatch(mergeCells(state.tr));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(th({ rowspan: 2 })(p('')), thEmpty, thEmpty),
              tr(tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );

        sendKeyToPm(editorView, 'Mod-z');
        validateUnmergedDomCells();
        expect(editorView.state.doc).toEqualDocument(originalDoc);
      });

      // make sure all colspan/rowspan attributes are removed from cells
      function validateUnmergedDomCells() {
        const cells = document.querySelectorAll('table td, table th');
        Array.from(cells).forEach((cell) => {
          expect(cell.getAttribute('rowspan')).toBeFalsy();
          expect(cell.getAttribute('colspan')).toBeFalsy();
        });
      }
    });
  });
});
