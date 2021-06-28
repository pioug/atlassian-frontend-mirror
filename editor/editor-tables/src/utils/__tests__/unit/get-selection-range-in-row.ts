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
import { getSelectionRangeInRow } from '../../get-selection-range-in-row';

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

describe('getSelectionRangeInRow', () => {
  describe('when rows are merged', () => {
    describe('1st combination of rowspans', () => {
      it(`rowIndex: 0`, () => {
        const input = doc(
          table()(
            row(td()(p('{headCell}')), cEmpty, td()(p('{anchorCell}'))),
            row(td({ rowspan: 2 })(p('')), cEmpty, cEmpty),
            row(td({ rowspan: 2 })(p('')), cEmpty),
            row(cEmpty, td({ rowspan: 2 })(p(''))),
            row(cEmpty, cEmpty),
            row(cEmpty, cEmpty, cEmpty),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInRow(0)(tr)!;
        expect(range.indexes).toEqual([0]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });

      Array.from(Array(4).keys()).forEach((rowIndex) => {
        it(`rowIndex: ${rowIndex + 1}`, () => {
          const input = doc(
            table()(
              row(cEmpty, cEmpty, cEmpty),
              row(td({ rowspan: 2 })(p('')), cEmpty, td()(p('{anchorCell}'))),
              row(td({ rowspan: 2 })(p('')), cEmpty),
              row(cEmpty, td({ rowspan: 2 })(p(''))),
              row(td()(p('{headCell}')), cEmpty),
              row(cEmpty, cEmpty, cEmpty),
            ),
          );
          const { tr, anchorCell, headCell } = init(input);

          const range = getSelectionRangeInRow(rowIndex + 1)(tr)!;
          expect(range.indexes).toEqual([1, 2, 3, 4]);
          expect(range.$anchor.pos).toEqual(anchorCell - 2);
          expect(range.$head.pos).toEqual(headCell - 2);
        });
      });

      it(`rowIndex: 5`, () => {
        const input = doc(
          table()(
            row(cEmpty, cEmpty, cEmpty),
            row(td({ rowspan: 2 })(p('')), cEmpty, cEmpty),
            row(td({ rowspan: 2 })(p('')), cEmpty),
            row(cEmpty, td({ rowspan: 2 })(p(''))),
            row(cEmpty, cEmpty),
            row(td()(p('{headCell}')), cEmpty, td()(p('{anchorCell}'))),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInRow(5)(tr)!;
        expect(range.indexes).toEqual([5]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });
    });

    describe('2nd combination of rowspans', () => {
      it(`rowIndex: 0`, () => {
        const input = doc(
          table()(
            row(td()(p('{headCell}')), cEmpty, td()(p('{anchorCell}'))),
            row(cEmpty, cEmpty, td({ rowspan: 2 })(p(''))),
            row(cEmpty, td({ rowspan: 2 })(p(''))),
            row(td({ rowspan: 2 })(p('')), cEmpty),
            row(cEmpty, cEmpty),
            row(cEmpty, cEmpty, cEmpty),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInRow(0)(tr)!;
        expect(range.indexes).toEqual([0]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });

      Array.from(Array(4).keys()).forEach((rowIndex) => {
        it(`rowIndex: ${rowIndex + 1}`, () => {
          const input = doc(
            table()(
              row(cEmpty, cEmpty, cEmpty),
              row(cEmpty, cEmpty, td({ rowspan: 2 })(p('{anchorCell}'))),
              row(cEmpty, td({ rowspan: 2 })(p(''))),
              row(td({ rowspan: 2 })(p('{headCell}')), cEmpty),
              row(cEmpty, cEmpty),
              row(cEmpty, cEmpty, cEmpty),
            ),
          );
          const { tr, anchorCell, headCell } = init(input);

          const range = getSelectionRangeInRow(rowIndex + 1)(tr)!;
          expect(range.indexes).toEqual([1, 2, 3, 4]);
          expect(range.$anchor.pos).toEqual(anchorCell - 2);
          expect(range.$head.pos).toEqual(headCell - 2);
        });
      });

      it(`rowIndex: 5`, () => {
        const input = doc(
          table()(
            row(cEmpty, cEmpty, cEmpty),
            row(cEmpty, cEmpty, td({ rowspan: 2 })(p(''))),
            row(cEmpty, td({ rowspan: 2 })(p(''))),
            row(td({ rowspan: 2 })(p('')), cEmpty),
            row(cEmpty, cEmpty),
            row(td()(p('{headCell}')), cEmpty, td()(p('{anchorCell}'))),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInRow(5)(tr)!;
        expect(range.indexes).toEqual([5]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });
    });
  });

  describe('when rows and columns are merged', () => {
    describe('1st combination of colspans and rowspans', () => {
      it(`rowIndex: 0`, () => {
        const input = doc(
          table()(
            row(td()(p('{headCell}')), cEmpty, td()(p('{anchorCell}'))),
            row(td({ rowspan: 2 })(p('')), td({ colspan: 2 })(p(''))),
            row(td({ rowspan: 2 })(p('')), cEmpty),
            row(cEmpty, td({ rowspan: 2 })(p(''))),
            row(td({ colspan: 2 })(p(''))),
            row(cEmpty, cEmpty, cEmpty),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInRow(0)(tr)!;
        expect(range.indexes).toEqual([0]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });

      Array.from(Array(4).keys()).forEach((rowIndex) => {
        it(`rowIndex: ${rowIndex + 1}`, () => {
          const input = doc(
            table()(
              row(cEmpty, cEmpty, cEmpty),
              row(
                td({ rowspan: 2 })(p('')),
                td({ colspan: 2 })(p('{anchorCell}')),
              ),
              row(td({ rowspan: 2 })(p('')), cEmpty),
              row(cEmpty, td({ rowspan: 2 })(p(''))),
              row(td({ colspan: 2 })(p('{headCell}'))),
              row(cEmpty, cEmpty, cEmpty),
            ),
          );
          const { tr, anchorCell, headCell } = init(input);

          const range = getSelectionRangeInRow(rowIndex + 1)(tr)!;
          expect(range.indexes).toEqual([1, 2, 3, 4]);
          expect(range.$anchor.pos).toEqual(anchorCell - 2);
          expect(range.$head.pos).toEqual(headCell - 2);
        });
      });

      it(`rowIndex: 5`, () => {
        const input = doc(
          table()(
            row(cEmpty, cEmpty, cEmpty),
            row(td({ rowspan: 2 })(p('')), td({ colspan: 2 })(p(''))),
            row(td({ rowspan: 2 })(p('')), cEmpty),
            row(cEmpty, td({ rowspan: 2 })(p(''))),
            row(td({ colspan: 2 })(p(''))),
            row(td()(p('{headCell}')), cEmpty, td()(p('{anchorCell}'))),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInRow(5)(tr)!;
        expect(range.indexes).toEqual([5]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });
    });

    describe('2nd combination of colspans and rowspans', () => {
      it(`rowIndex: 0`, () => {
        const input = doc(
          table()(
            row(td()(p('{headCell}')), cEmpty, td()(p('{anchorCell}'))),
            row(td({ colspan: 2 })(p('')), td({ rowspan: 2 })(p(''))),
            row(cEmpty, td({ rowspan: 2 })(p(''))),
            row(td({ rowspan: 2 })(p('')), cEmpty),
            row(td({ colspan: 2 })(p(''))),
            row(cEmpty, cEmpty, cEmpty),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInRow(0)(tr)!;
        expect(range.indexes).toEqual([0]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });

      Array.from(Array(4).keys()).forEach((rowIndex) => {
        it(`rowIndex: ${rowIndex + 1}`, () => {
          const input = doc(
            table()(
              row(cEmpty, cEmpty, cEmpty),
              row(
                td({ colspan: 2 })(p('')),
                td({ rowspan: 2 })(p('{anchorCell}')),
              ),
              row(cEmpty, td({ rowspan: 2 })(p(''))),
              row(td({ rowspan: 2 })(p('{headCell}')), cEmpty),
              row(td({ colspan: 2 })(p(''))),
              row(cEmpty, cEmpty, cEmpty),
            ),
          );
          const { tr, anchorCell, headCell } = init(input);

          const range = getSelectionRangeInRow(rowIndex + 1)(tr)!;
          expect(range.indexes).toEqual([1, 2, 3, 4]);
          expect(range.$anchor.pos).toEqual(anchorCell - 2);
          expect(range.$head.pos).toEqual(headCell - 2);
        });
      });

      it(`rowIndex: 5`, () => {
        const input = doc(
          table()(
            row(cEmpty, cEmpty, cEmpty),
            row(td({ colspan: 2 })(p('')), td({ rowspan: 2 })(p(''))),
            row(cEmpty, td({ rowspan: 2 })(p(''))),
            row(td({ rowspan: 2 })(p('')), cEmpty),
            row(td({ colspan: 2 })(p(''))),
            row(td()(p('{headCell}')), cEmpty, td()(p('{anchorCell}'))),
          ),
        );
        const { tr, anchorCell, headCell } = init(input);

        const range = getSelectionRangeInRow(5)(tr)!;
        expect(range.indexes).toEqual([5]);
        expect(range.$anchor.pos).toEqual(anchorCell - 2);
        expect(range.$head.pos).toEqual(headCell - 2);
      });
    });
  });
});
