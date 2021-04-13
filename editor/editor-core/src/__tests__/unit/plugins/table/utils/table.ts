import {
  doc,
  p,
  table,
  td,
  th,
  tr as row,
  tdEmpty,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { getCellsInRow } from '@atlaskit/editor-tables/utils';
import { getMergedCellsPositions } from '../../../../../plugins/table/utils';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';

describe('table utils', () => {
  describe('#getMergedCellsPositions', () => {
    describe('when the table has not merged cells', () => {
      it('should returns an emppty array', () => {
        const { tr } = createEditorState(
          doc(
            table()(
              row(th({})(p('Number{<>}'))),
              row(td({})(p('10{<>}'))),
              row(td({})(p('0'))),
              row(td({})(p('5'))),
            ),
          ),
        );

        expect(getMergedCellsPositions(tr)).toHaveLength(0);
      });
    });

    describe('when the table has merged cells in columns', () => {
      it('should returns the positions', () => {
        const { tr } = createEditorState(
          doc(
            table()(
              row(
                th({})(p('Number{<>}')),
                td({})(p('10{<>}')),
                tdEmpty,
                tdEmpty,
              ),
              row(td({})(p('10{<>}')), td({})(p('10{<>}')), tdEmpty, tdEmpty),
              row(td({ colspan: 2 })(p('0')), td({ colspan: 2 })(p('1'))),
              row(td({})(p('5')), td({})(p('10{<>}')), tdEmpty, tdEmpty),
            ),
          ),
        );
        const cells = getCellsInRow(2)(tr.selection)!;
        const tableStart = 1;

        expect(getMergedCellsPositions(tr)).toEqual([
          cells[0].pos - tableStart,
          cells[1].pos - tableStart,
        ]);
      });
    });

    describe('when the table has merged cells in rows', () => {
      it('should returns the positions', () => {
        const { tr } = createEditorState(
          doc(
            table()(
              row(
                th({})(p('Number{<>}')),
                td({})(p('10{<>}')),
                tdEmpty,
                tdEmpty,
              ),
              row(td({})(p('10{<>}')), td({})(p('10{<>}')), tdEmpty, tdEmpty),
              row(
                td({ rowspan: 2 })(p('0')),
                tdEmpty,
                tdEmpty,
                td({ rowspan: 2 })(p('1')),
              ),
              row(tdEmpty, tdEmpty),
            ),
          ),
        );

        const cells = getCellsInRow(2)(tr.selection)!;
        const tableStart = 1;

        expect(getMergedCellsPositions(tr)).toEqual([
          cells[0].pos - tableStart,
          cells[3].pos - tableStart,
        ]);
      });
    });
  });
});
