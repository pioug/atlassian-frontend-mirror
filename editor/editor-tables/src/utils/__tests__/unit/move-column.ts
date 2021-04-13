import { EditorState } from 'prosemirror-state';

import {
  p,
  tr as row,
  td,
  th,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  c,
  cCursor,
  cEmpty,
  createTableWithDoc,
  h,
  hEmpty,
} from '../../../__tests__/__helpers/doc-builder';
import { moveColumn } from '../../move-column';

describe('table__moveColumn', () => {
  describe('on a simple table', () => {
    it('should move column right-to-left', () => {
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(td()(p('1')), cCursor, cEmpty),
          row(td()(p('2')), cEmpty, cEmpty),
          row(td()(p('3')), cEmpty, cEmpty),
        ),
      });

      const newTr = moveColumn(2, 0)(tr);
      expect(newTr.doc).toEqualDocument(
        createTableWithDoc(
          row(cEmpty, td()(p('1')), cCursor),
          row(cEmpty, td()(p('2')), cEmpty),
          row(cEmpty, td()(p('3')), cEmpty),
        ),
      );
    });

    it('should move column left-to-right', () => {
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(td()(p('1')), cEmpty, cEmpty),
          row(td()(p('2')), td()(p('x')), cEmpty),
          row(td()(p('3')), cEmpty, cEmpty),
        ),
      });

      const newTr = moveColumn(1, 2)(tr);
      expect(newTr.doc).toEqualDocument(
        createTableWithDoc(
          row(td()(p('1')), cEmpty, cEmpty),
          row(td()(p('2')), cEmpty, td()(p('x'))),
          row(td()(p('3')), cEmpty, cEmpty),
        ),
      );
    });
  });

  describe('on a table with merged cells', () => {
    it('should move columns merged at first line', () => {
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(td()(p('1')), c(2, 1, p('merged cell'))),
          row(td()(p('2')), cCursor, cEmpty),
          row(td()(p('3')), cEmpty, cEmpty),
        ),
      });

      const newTr = moveColumn(1, 0)(tr);
      expect(newTr.doc).toEqualDocument(
        createTableWithDoc(
          row(c(2, 1, p('merged cell')), td()(p('1'))),
          row(cCursor, cEmpty, td()(p('2'))),
          row(cEmpty, cEmpty, td()(p('3'))),
        ),
      );
    });

    it('should move columns merged at middle line', () => {
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(td()(p('1')), cCursor, cEmpty),
          row(td()(p('2')), c(2, 1, p('merged cell'))),
          row(td()(p('3')), cEmpty, cEmpty),
        ),
      });

      const newTr = moveColumn(1, 0)(tr);
      expect(newTr.doc).toEqualDocument(
        createTableWithDoc(
          row(cCursor, cEmpty, td()(p('1'))),
          row(c(2, 1, p('merged cell')), td()(p('2'))),
          row(cEmpty, cEmpty, td()(p('3'))),
        ),
      );
    });

    it('should move columns merged at last line', () => {
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(td()(p('1')), cCursor, cEmpty),
          row(td()(p('2')), cEmpty, cEmpty),
          row(td()(p('3')), c(2, 1, p('merged cell'))),
        ),
      });

      const newTr = moveColumn(1, 0)(tr);
      expect(newTr.doc).toEqualDocument(
        createTableWithDoc(
          row(cCursor, cEmpty, td()(p('1'))),
          row(cEmpty, cEmpty, td()(p('2'))),
          row(c(2, 1, p('merged cell')), td()(p('3'))),
        ),
      );
    });

    it('should move and keep table headers', () => {
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(h(2, 1, p('merged cell')), hEmpty),
          row(cEmpty, cEmpty, cEmpty),
          row(cEmpty, cEmpty, cEmpty),
        ),
      });

      const newTr = moveColumn(0, 2)(tr);
      expect(newTr.doc).toEqualDocument(
        createTableWithDoc(
          row(hEmpty, h(2, 1, p('merged cell'))),
          row(cEmpty, cEmpty, cEmpty),
          row(cEmpty, cEmpty, cEmpty),
        ),
      );
    });

    it('should move and keep columns headers', () => {
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(hEmpty, hEmpty, hEmpty),
          row(th()(p('b1')), cEmpty, td()(p('b2'))),
          row(hEmpty, cEmpty, cEmpty),
        ),
      });

      const newTr = moveColumn(2, 0)(tr);
      expect(newTr.doc).toEqualDocument(
        createTableWithDoc(
          row(hEmpty, hEmpty, hEmpty),
          row(th()(p('b2')), td()(p('b1')), cEmpty),
          row(hEmpty, cEmpty, cEmpty),
        ),
      );
    });
  });

  describe('on a table with merged rows', () => {
    it('should move columns', () => {
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(c(1, 2, p('---merged-row----')), td()(p('a0')), td()(p('a1'))),
          row(td()(p('b1')), td()(p('b2'))),
          row(td()(p('c1')), td()(p('c2')), td()(p('c3'))),
        ),
      });

      const newTr = moveColumn(1, 2)(tr);
      expect(newTr.doc).toEqualDocument(
        createTableWithDoc(
          row(c(1, 2, p('---merged-row----')), td()(p('a1')), td()(p('a0'))),
          row(td()(p('b2')), td()(p('b1'))),
          row(td()(p('c1')), td()(p('c3')), td()(p('c2'))),
        ),
      );
    });

    it('should move columns for multi rows merged', () => {
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(c(1, 2, p('a1')), td()(p('a1')), td()(p('a2'))),
          row(td()(p('b1')), c(1, 2, p('b2'))),
          row(td()(p('c1')), td()(p('c2'))),
        ),
      });

      const newTr = moveColumn(1, 2)(tr);
      expect(newTr.doc).toEqualDocument(
        createTableWithDoc(
          row(c(1, 2, p('a1')), td()(p('a2')), td()(p('a1'))),
          row(c(1, 2, p('b2')), td()(p('b1'))),
          row(td()(p('c1')), td()(p('c2'))),
        ),
      );
    });

    it('should move columns between two merged rows', () => {
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(c(1, 2, p('a1')), td()(p('a2')), td()(p('a3'))),
          row(td()(p('b1')), c(1, 2, p('b2'))),
          row(td()(p('c1')), td()(p('c2'))),
        ),
      });

      const newTr = moveColumn(0, 2)(tr);
      expect(newTr.doc).toEqualDocument(
        createTableWithDoc(
          row(td()(p('a2')), td()(p('a3')), c(1, 2, p('a1'))),
          row(td()(p('b1')), c(1, 2, p('b2'))),
          row(td()(p('c2')), td()(p('c1'))),
        ),
      );
    });
  });

  describe('on a complex table with merged cells and rows', () => {
    it('keep the merged content columns order', () => {
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(cEmpty, td()(p('a1')), td()(p('a2'))),
          row(cEmpty, c(2, 1, p('b1'))),
          row(cEmpty, td()(p('c1')), td()(p('c2'))),
        ),
      });

      const newTr = moveColumn(1, 0)(tr);
      expect(newTr.doc).toEqualDocument(
        createTableWithDoc(
          row(td()(p('a1')), td()(p('a2')), cEmpty),
          row(c(2, 1, p('b1')), cEmpty),
          row(td()(p('c1')), td()(p('c2')), cEmpty),
        ),
      );
    });

    describe('when the first line all columns are merged', () => {
      it('should not move columns', () => {
        const { tr } = EditorState.create({
          doc: createTableWithDoc(
            row(c(3, 1, p('a1'))),
            row(td()(p('b1')), cCursor, cEmpty),
            row(td()(p('c1')), cEmpty, cEmpty),
          ),
        });

        const newTr = moveColumn(1, 0)(tr);
        expect(newTr.doc).toEqualDocument(
          createTableWithDoc(
            row(c(3, 1, p('a1'))),
            row(td()(p('b1')), cCursor, cEmpty),
            row(td()(p('c1')), cEmpty, cEmpty),
          ),
        );
      });
    });

    describe('table 3x5', () => {
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(
            c(1, 2, p('a0')),
            td()(p('a1')),
            td()(p('a2')),
            td()(p('a3')),
            td()(p('a4')),
          ),
          row(c(2, 1, p('b1')), c(2, 2, p('b2'))),
          row(td()(p('c1')), td()(p('c2')), td()(p('c3'))),
        ),
      });

      const expectedResult = createTableWithDoc(
        row(
          c(1, 2, p('a0')),
          td()(p('a3')),
          td()(p('a4')),
          td()(p('a1')),
          td()(p('a2')),
        ),
        row(c(2, 2, p('b2')), c(2, 1, p('b1'))),
        row(td()(p('c1')), td()(p('c2')), td()(p('c3'))),
      );

      describe('with tryToFit false', () => {
        it('should throw exception on move column 1 to 3', () => {
          expect(() => moveColumn(1, 3)(tr)).toThrow(
            "Target position is invalid, you can't move the column 1 to 3, the target can't be split. You could use tryToFit option.",
          );
        });

        it('should throw exception on move column 2 to 3', () => {
          expect(() => moveColumn(2, 3)(tr)).toThrow(
            "Target position is invalid, you can't move the column 2 to 3, the target can't be split. You could use tryToFit option.",
          );
        });

        it('should throw exception on move column 3 to 2', () => {
          expect(() => moveColumn(3, 2)(tr)).toThrow();
        });

        it('should move column 3 to 1', () => {
          let newTr = moveColumn(3, 1)(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });

        it('should move column 4 to 1', () => {
          let newTr = moveColumn(4, 1)(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });
      });

      describe('with tryToFit true', () => {
        it('should move column 1 to 3', () => {
          let newTr = moveColumn(1, 3, { tryToFit: true, direction: 0 })(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });

        it('should move column 2 to 3', () => {
          let newTr = moveColumn(2, 3, { tryToFit: true, direction: 0 })(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });

        it('should move column 2 to 4', () => {
          let newTr = moveColumn(2, 4, { tryToFit: true, direction: 0 })(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });

        it('should move column 3 to 1', () => {
          let newTr = moveColumn(3, 1, { tryToFit: true, direction: 0 })(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });

        it('should move column 3 to 2', () => {
          let newTr = moveColumn(3, 2, { tryToFit: true, direction: 0 })(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });

        it('should move column 4 to 1', () => {
          let newTr = moveColumn(4, 1, { tryToFit: true, direction: 0 })(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });

        it('should move column 4 to 2', () => {
          let newTr = moveColumn(4, 2, { tryToFit: true, direction: 0 })(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });
      });
    });

    describe('table 3x4', () => {
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(c(1, 2, p('a1')), td()(p('a2')), td()(p('a3')), td()(p('a4'))),
          row(c(2, 1, p('b1')), c(1, 2, p('b2'))),
          row(td()(p('c1')), td()(p('c2')), td()(p('c3'))),
        ),
      });

      const expectedResult = createTableWithDoc(
        row(td()(p('a2')), td()(p('a3')), c(1, 2, p('a1')), td()(p('a4'))),
        row(c(2, 1, p('b1')), c(1, 2, p('b2'))),
        row(td()(p('c2')), td()(p('c3')), td()(p('c1'))),
      );

      describe('with tryToFit false', () => {
        it('should throw exception on move column 0 to 1', () => {
          expect(() => moveColumn(0, 1)(tr)).toThrow();
        });

        it('should move column 0 to 2', () => {
          let newTr = moveColumn(0, 2)(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });

        it('should move column 2 to 0', () => {
          let newTr = moveColumn(2, 0)(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });

        it('should move column 1 to 0', () => {
          let newTr = moveColumn(1, 0)(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });
      });

      describe('with tryToFit true', () => {
        it('should move column 0 to 2', () => {
          let newTr = moveColumn(0, 2, { tryToFit: true, direction: 0 })(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });

        it('should move column 0 to 1', () => {
          let newTr = moveColumn(0, 1, { tryToFit: true, direction: 0 })(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });

        it('should move column 2 to 0', () => {
          let newTr = moveColumn(2, 0, { tryToFit: true, direction: 0 })(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });

        it('should move column 1 to 0', () => {
          let newTr = moveColumn(1, 0, { tryToFit: true, direction: 0 })(tr);
          expect(newTr.doc).toEqualDocument(expectedResult);
        });
      });
    });
  });

  describe('table 5x3', () => {
    const { tr } = EditorState.create({
      doc: createTableWithDoc(
        row(
          th()(p('a1')),
          th()(p('a2')),
          th()(p('a3')),
          th()(p('a4')),
          th()(p('a5')),
        ),
        row(c(2, 1, p('b1')), td()(p('b2')), td()(p('b3')), td()(p('b4'))),
        row(td()(p('c1')), td()(p('c2')), td()(p('c3')), c(2, 1, p('c4'))),
      ),
    });

    const expectedResult = createTableWithDoc(
      row(
        th()(p('a3')),
        th()(p('a1')),
        th()(p('a2')),
        th()(p('a4')),
        th()(p('a5')),
      ),
      row(td()(p('b2')), c(2, 1, p('b1')), td()(p('b3')), td()(p('b4'))),
      row(td()(p('c3')), td()(p('c1')), td()(p('c2')), c(2, 1, p('c4'))),
    );

    it('should move column 2 to 0', () => {
      let newTr = moveColumn(2, 0)(tr);
      expect(newTr.doc).toEqualDocument(expectedResult);
    });

    it('should move column 0 to 2', () => {
      let newTr = moveColumn(0, 2)(tr);
      expect(newTr.doc).toEqualDocument(expectedResult);
    });
  });

  describe('with tryToFit true', () => {
    describe('overide the direction when move right-to-left', () => {
      // Original table
      //
      //     0      1       2     3      4      5       6
      //   _________________________________________________
      //  |      |             |      |             |      |
      //  |  A1  |     B1      |  E1  |     F1      |  G1  |
      //  |______|______ ______|______|______ ______|______|
      //  |             |      |             |      |      |
      //  |     A2      |      |     D2      |      |  G2  |
      //  |______ ______|      |______ ______|      |______|
      //  |      |      |  C2  |      |      |  F2  |      |
      //  |  A3  |  B3  |      |  D3  |  E3  |      |  G3  |
      //  |______|______|______|______|______|______|______|
      //
      const { tr } = EditorState.create({
        doc: createTableWithDoc(
          row(
            td()(p('A1')),
            c(2, 1, p('B1')),
            td()(p('E1')),
            c(2, 1, p('F1')),
            td()(p('G1')),
          ),
          row(
            c(2, 1, p('A2')),
            c(1, 2, p('C2')),
            c(2, 1, p('D2')),
            c(1, 2, p('F2')),
            td()(p('G2')),
          ),
          row(
            td()(p('A3')),
            td()(p('B3')),
            td()(p('D3')),
            td()(p('E3')),
            td()(p('G3')),
          ),
        ),
      });

      // Expected table after move column 6 to position 2 with default direction
      //
      //     0      1       2     3      4      5       6
      //   _________________________________________________
      //  |      |      |             |      |             |
      //  |  G1  |  A1  |     B1      |  E1  |     F1      |
      //  |______|______|______ ______|______|______ ______|
      //  |      |             |      |             |      |
      //  |  G2  |     A2      |      |     D2      |      |
      //  |______|______ ______|      |______ ______|      |
      //  |      |      |      |  C2  |      |      |  F2  |
      //  |  G3  |  A3  |  B3  |      |  D3  |  E3  |      |
      //  |______|______|______|______|______|______|______|
      //

      // Expected table after move column 6 to position 2 with direction 1
      //
      //     0      1       2     3      4      5       6
      //   _________________________________________________
      //  |      |             |      |      |             |
      //  |  A1  |     B1      |  G1  |  E1  |     F1      |
      //  |______|______ ______|______|______|______ ______|
      //  |             |      |      |             |      |
      //  |     A2      |      |  G2  |     D2      |      |
      //  |______ ______|      |______|______ ______|      |
      //  |      |      |  C2  |      |      |      |  F2  |
      //  |  A3  |  B3  |      |  G3  |  D3  |  E3  |      |
      //  |______|______|______|______|______|______|______|
      //
      const expectedResultMinusOneDirection = createTableWithDoc(
        row(
          td()(p('A1')),
          c(2, 1, p('B1')),
          td()(p('G1')),
          td()(p('E1')),
          c(2, 1, p('F1')),
        ),
        row(
          c(2, 1, p('A2')),
          c(1, 2, p('C2')),
          td()(p('G2')),
          c(2, 1, p('D2')),
          c(1, 2, p('F2')),
        ),
        row(
          td()(p('A3')),
          td()(p('B3')),
          td()(p('G3')),
          td()(p('D3')),
          td()(p('E3')),
        ),
      );

      it('should move row 6 to position 2 with direction 1', () => {
        let newTr = moveColumn(6, 2, { tryToFit: true, direction: 1 })(tr);
        expect(newTr.doc).toEqualDocument(expectedResultMinusOneDirection);
      });
    });
  });
});
