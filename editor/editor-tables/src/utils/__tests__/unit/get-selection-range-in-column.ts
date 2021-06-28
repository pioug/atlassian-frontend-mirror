import { EditorState } from 'prosemirror-state';

import { defaultSchema } from '@atlaskit/adf-schema';
import {
  doc,
  DocBuilder,
  p,
  tr as row,
  table,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { cEmpty } from '../../../__tests__/__helpers/doc-builder';
import { getSelectionRangeInColumn } from '../../get-selection-range-in-column';

const init = (docBuilder: DocBuilder) => {
  const docNode = docBuilder(defaultSchema);
  const state = EditorState.create({
    doc: docNode,
  });
  const { tr } = state;
  const {
    refs: { anchorCell, headCell },
  } = docNode;

  return {
    tr,
    anchorCell,
    headCell,
  };
};

describe('getSelectionRangeInColumn', () => {
  describe('when columns are merged', () => {
    describe('1st combination of colspans', () => {
      it(`columnIndex: 0`, () => {
        const input = doc(
          table()(
            row(
              td()(p('{headCell}')),
              cEmpty,
              td({ colspan: 2 })(p('')),
              cEmpty,
              cEmpty,
            ),
            row(cEmpty, cEmpty, td({ colspan: 2 })(p('')), cEmpty, cEmpty),
            row(
              td()(p('{anchorCell}')),
              cEmpty,
              cEmpty,
              cEmpty,
              td({ colspan: 2 })(p('')),
            ),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInColumn(0)(tr)!;
        expect(range.indexes).toEqual([0]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });

      Array.from(Array(4).keys()).forEach((columnIndex) => {
        it(`columnIndex: ${columnIndex + 1}`, () => {
          const input = doc(
            table()(
              row(
                cEmpty,
                td({ colspan: 2 })(p('')),
                cEmpty,
                td()(p('{headCell}')),
                cEmpty,
              ),
              row(cEmpty, cEmpty, td({ colspan: 2 })(p('')), cEmpty, cEmpty),
              row(
                cEmpty,
                td()(p('{anchorCell}')),
                cEmpty,
                td({ colspan: 2 })(p('')),
                cEmpty,
              ),
            ),
          );
          const { tr, anchorCell, headCell } = init(input);

          const range = getSelectionRangeInColumn(columnIndex + 1)(tr)!;
          expect(range.indexes).toEqual([1, 2, 3, 4]);
          expect(range.$anchor.pos).toEqual(anchorCell - 2);
          expect(range.$head.pos).toEqual(headCell - 2);
        });
      });

      it(`columnIndex: 5`, () => {
        const input = doc(
          table()(
            row(
              cEmpty,
              td({ colspan: 2 })(p('')),
              cEmpty,
              cEmpty,
              td()(p('{headCell}')),
            ),
            row(cEmpty, cEmpty, td({ colspan: 2 })(p('')), cEmpty, cEmpty),
            row(
              cEmpty,
              cEmpty,
              cEmpty,
              td({ colspan: 2 })(p('')),
              td()(p('{anchorCell}')),
            ),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInColumn(5)(tr)!;
        expect(range.indexes).toEqual([5]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });
    });

    describe('2nd combination of colspans', () => {
      it(`columnIndex: 0`, () => {
        const input = doc(
          table()(
            row(
              td()(p('{headCell}')),
              cEmpty,
              cEmpty,
              cEmpty,
              td({ colspan: 2 })(p('')),
            ),
            row(cEmpty, cEmpty, td({ colspan: 2 })(p('')), cEmpty, cEmpty),
            row(
              td()(p('{anchorCell}')),
              cEmpty,
              td({ colspan: 2 })(p('')),
              cEmpty,
              cEmpty,
            ),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInColumn(0)(tr)!;
        expect(range.indexes).toEqual([0]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });

      Array.from(Array(4).keys()).forEach((columnIndex) => {
        it(`columnIndex: ${columnIndex + 1}`, () => {
          const input = doc(
            table()(
              row(
                cEmpty,
                cEmpty,
                cEmpty,
                td({ colspan: 2 })(p('{headCell}')),
                cEmpty,
              ),
              row(cEmpty, cEmpty, td({ colspan: 2 })(p('')), cEmpty, cEmpty),
              row(
                cEmpty,
                td({ colspan: 2 })(p('{anchorCell}')),
                cEmpty,
                cEmpty,
                cEmpty,
              ),
            ),
          );
          const { tr, anchorCell, headCell } = init(input);

          const range = getSelectionRangeInColumn(columnIndex + 1)(tr)!;
          expect(range.indexes).toEqual([1, 2, 3, 4]);
          expect(range.$anchor.pos).toEqual(anchorCell - 2);
          expect(range.$head.pos).toEqual(headCell - 2);
        });
      });

      it(`columnIndex: 5`, () => {
        const input = doc(
          table()(
            row(
              cEmpty,
              cEmpty,
              cEmpty,
              td({ colspan: 2 })(p('')),
              td()(p('{headCell}')),
            ),
            row(cEmpty, cEmpty, td({ colspan: 2 })(p('')), cEmpty, cEmpty),
            row(
              cEmpty,
              td({ colspan: 2 })(p('')),
              cEmpty,
              cEmpty,
              td()(p('{anchorCell}')),
            ),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInColumn(5)(tr)!;
        expect(range.indexes).toEqual([5]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });
    });
  });

  describe('when columns and rows are merged', () => {
    describe('1st combination of colspans and rowspans', () => {
      it(`columnIndex: 0`, () => {
        const input = doc(
          table()(
            row(
              td()(p('{headCell}')),
              td({ rowspan: 2 })(p('')),
              cEmpty,
              cEmpty,
              cEmpty,
            ),
            row(cEmpty, td({ colspan: 2 })(p('')), cEmpty),
            row(
              cEmpty,
              td({ colspan: 2 })(p('')),
              td({ rowspan: 2 })(p('')),
              cEmpty,
            ),
            row(td()(p('{anchorCell}')), cEmpty, cEmpty, cEmpty),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInColumn(0)(tr)!;
        expect(range.indexes).toEqual([0]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });

      Array.from(Array(3).keys()).forEach((columnIndex) => {
        it(`columnIndex: ${columnIndex + 1}`, () => {
          const input = doc(
            table()(
              row(
                cEmpty,
                td({ rowspan: 2 })(p('')),
                cEmpty,
                td()(p('{headCell}')),
                cEmpty,
              ),
              row(cEmpty, td({ colspan: 2 })(p('')), cEmpty),
              row(
                cEmpty,
                td({ colspan: 2 })(p('')),
                td({ rowspan: 2 })(p('')),
                cEmpty,
              ),
              row(cEmpty, td()(p('{anchorCell}')), cEmpty, cEmpty),
            ),
          );
          const { tr, anchorCell, headCell } = init(input);

          const range = getSelectionRangeInColumn(columnIndex + 1)(tr)!;
          expect(range.indexes).toEqual([1, 2, 3]);
          expect(range.$anchor.pos).toEqual(anchorCell - 2);
          expect(range.$head.pos).toEqual(headCell - 2);
        });
      });

      it(`columnIndex: 4`, () => {
        const input = doc(
          table()(
            row(
              cEmpty,
              td({ rowspan: 2 })(p('')),
              cEmpty,
              cEmpty,
              td()(p('{headCell}')),
            ),
            row(cEmpty, td({ colspan: 2 })(p('')), cEmpty),
            row(
              cEmpty,
              td({ colspan: 2 })(p('')),
              td({ rowspan: 2 })(p('')),
              cEmpty,
            ),
            row(cEmpty, cEmpty, cEmpty, td()(p('{anchorCell}'))),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInColumn(4)(tr)!;
        expect(range.indexes).toEqual([4]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });
    });

    describe('2st combination of colspans and rowspans', () => {
      it(`columnIndex: 0`, () => {
        const input = doc(
          table()(
            row(
              td()(p('{headCell}')),
              cEmpty,
              cEmpty,
              td({ rowspan: 2 })(p('')),
              cEmpty,
            ),
            row(cEmpty, td({ colspan: 2 })(p('')), cEmpty),
            row(
              cEmpty,
              td({ rowspan: 2 })(p('')),
              td({ colspan: 2 })(p('')),
              cEmpty,
            ),
            row(td()(p('{anchorCell}')), cEmpty, cEmpty, cEmpty),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInColumn(0)(tr)!;
        expect(range.indexes).toEqual([0]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });

      Array.from(Array(3).keys()).forEach((columnIndex) => {
        it(`columnIndex: ${columnIndex + 1}`, () => {
          const input = doc(
            table()(
              row(
                cEmpty,
                cEmpty,
                cEmpty,
                td({ rowspan: 2 })(p('{headCell}')),
                cEmpty,
              ),
              row(cEmpty, td({ colspan: 2 })(p('')), cEmpty),
              row(
                cEmpty,
                td({ rowspan: 2 })(p('{anchorCell}')),
                td({ colspan: 2 })(p('')),
                cEmpty,
              ),
              row(cEmpty, cEmpty, cEmpty, cEmpty),
            ),
          );
          const { tr, anchorCell, headCell } = init(input);

          const range = getSelectionRangeInColumn(columnIndex + 1)(tr)!;
          expect(range.indexes).toEqual([1, 2, 3]);
          expect(range.$anchor.pos).toEqual(anchorCell - 2);
          expect(range.$head.pos).toEqual(headCell - 2);
        });
      });

      it(`columnIndex: 4`, () => {
        const input = doc(
          table()(
            row(
              cEmpty,
              cEmpty,
              td({ rowspan: 2 })(p('')),
              cEmpty,
              td()(p('{headCell}')),
            ),
            row(cEmpty, td({ colspan: 2 })(p('')), cEmpty),
            row(
              cEmpty,
              td({ rowspan: 2 })(p('')),
              td({ colspan: 2 })(p('')),
              cEmpty,
            ),
            row(cEmpty, cEmpty, cEmpty, td()(p('{anchorCell}'))),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInColumn(4)(tr)!;
        expect(range.indexes).toEqual([4]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });
    });
  });
});
