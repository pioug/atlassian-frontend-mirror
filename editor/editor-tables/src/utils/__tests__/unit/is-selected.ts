import { defaultSchema } from '@atlaskit/adf-schema';
import {
  doc,
  p,
  tr as row,
  table,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { cEmpty } from '../../../__tests__/__helpers/doc-builder';
import { selectionFor } from '../../../__tests__/__helpers/selection-for';
import {
  isColumnSelected,
  isRowSelected,
  isTableSelected,
} from '../../is-selected';

describe('isColumnSelected', () => {
  it('should return `true` if CellSelection spans the entire column', () => {
    const input = doc(
      table()(row(td()(p('{anchor}'))), row(cEmpty), row(td()(p('{head}')))),
    )(defaultSchema);
    const selection = selectionFor(input)!;
    expect(isColumnSelected(0)(selection)).toBe(true);
  });
  it('should return `false` if CellSelection does not span the entire column', () => {
    const input = doc(
      table()(row(td()(p('{anchor}'))), row(td()(p('{head}'))), row(cEmpty)),
    )(defaultSchema);
    const selection = selectionFor(input)!;
    expect(isColumnSelected(0)(selection)).toBe(false);
  });
  describe('when head column is merged', () => {
    it('should return `true` if CellSelection spans the entire column', () => {
      const input = doc(
        table()(
          row(td({ colspan: 2 })(p('{head}')), cEmpty),
          row(td()(p('{anchor}')), cEmpty, cEmpty),
        ),
      )(defaultSchema);
      const selection = selectionFor(input)!;
      expect(isColumnSelected(0)(selection)).toBe(true);
      expect(isColumnSelected(1)(selection)).toBe(true);
      expect(isColumnSelected(2)(selection)).toBe(false);
    });
  });
  describe('when head column is merged and selection is inverted', () => {
    it('should return `true` if CellSelection spans the entire column', () => {
      const input = doc(
        table()(
          row(td()(p('{head}')), cEmpty, cEmpty),
          row(td({ colspan: 2 })(p('{anchor}')), cEmpty),
        ),
      )(defaultSchema);
      const selection = selectionFor(input)!;
      expect(isColumnSelected(0)(selection)).toBe(true);
      expect(isColumnSelected(1)(selection)).toBe(true);
      expect(isColumnSelected(2)(selection)).toBe(false);
    });
  });

  it('should return `true` if CellSelection spans all cells in a column', () => {
    const input = doc(
      table()(
        row(cEmpty, td()(p('{head}')), cEmpty),
        row(td({ colspan: 3 })(p('')), td()(p('{anchor}')), cEmpty),
      ),
    )(defaultSchema);
    const selection = selectionFor(input)!;
    expect(isColumnSelected(1)(selection)).toBe(true);
  });
});

describe('isRowSelected', () => {
  it('should return `true` if CellSelection spans the entire row', () => {
    const input = doc(
      table()(row(td()(p('{anchor}')), cEmpty, td()(p('{head}')))),
    )(defaultSchema);
    const selection = selectionFor(input)!;
    expect(isRowSelected(0)(selection)).toBe(true);
  });
  it('should return `false` if CellSelection does not span the entire row', () => {
    const input = doc(
      table()(row(td()(p('{anchor}')), td()(p('{head}')), cEmpty)),
    )(defaultSchema);
    const selection = selectionFor(input)!;
    expect(isRowSelected(0)(selection)).toBe(false);
  });
  describe('when head row is merged', () => {
    it('should return `true` if CellSelection spans the entire row', () => {
      const input = doc(
        table()(
          row(td({ rowspan: 2 })(p('{head}')), td()(p('{anchor}'))),
          row(cEmpty),
          row(cEmpty),
        ),
      )(defaultSchema);
      const selection = selectionFor(input)!;
      expect(isRowSelected(0)(selection)).toBe(true);
      expect(isRowSelected(1)(selection)).toBe(true);
      expect(isRowSelected(2)(selection)).toBe(false);
    });
  });
  describe('when head row is merged and selection is inverted', () => {
    it('should return `true` if CellSelection spans the entire row', () => {
      const input = doc(
        table()(
          row(td()(p('{head}')), td({ rowspan: 2 })(p('{anchor}'))),
          row(cEmpty),
          row(cEmpty),
        ),
      )(defaultSchema);
      const selection = selectionFor(input)!;
      expect(isRowSelected(0)(selection)).toBe(true);
      expect(isRowSelected(1)(selection)).toBe(true);
      expect(isRowSelected(2)(selection)).toBe(false);
    });
  });

  it('should return `true` if CellSelection spans all cells in a row', () => {
    const input = doc(
      table()(
        row(td({ rowspan: 2 })(p('')), cEmpty, cEmpty),
        row(td()(p('{head}')), td()(p('{anchor}'))),
      ),
    )(defaultSchema);
    const selection = selectionFor(input)!;
    expect(isRowSelected(1)(selection)).toBe(true);
  });
});

describe('isTableSelected', () => {
  it('should return `true` if CellSelection spans the entire table', () => {
    const input = doc(
      table()(
        row(td()(p('{anchor}')), cEmpty, cEmpty),
        row(cEmpty, cEmpty, td()(p('{head}'))),
      ),
    )(defaultSchema);
    const selection = selectionFor(input)!;
    expect(isTableSelected(selection)).toBe(true);
  });
  it('should return `false` if CellSelection does not span the entire table', () => {
    const input = doc(
      table()(
        row(td()(p('{anchor}')), cEmpty, cEmpty),
        row(td()(p('{head}')), cEmpty, cEmpty),
      ),
    )(defaultSchema);
    const selection = selectionFor(input)!;
    expect(isTableSelected(selection)).toBe(false);
  });
});
