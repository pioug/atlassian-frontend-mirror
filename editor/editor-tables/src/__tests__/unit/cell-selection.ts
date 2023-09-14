import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import type {
  Selection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { EditorState, NodeSelection } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, table, td, tr } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';

import { CellSelection } from '../../cell-selection';
import { tableEditing } from '../../pm-plugins/table-editing';
import type { Command } from '../../types';
import {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
} from '../../utils/test-utils';
import {
  c,
  c11,
  cAnchor,
  cEmpty,
  cHead,
  createTable,
  createTableWithDoc,
} from '../__helpers/doc-builder';
import { selectionFor } from '../__helpers/selection-for';

describe('CellSelection', () => {
  const tbl = createTableWithDoc(
    tr(/* 2*/ cEmpty, /* 6*/ cEmpty, /*10*/ cEmpty),
    tr(/*16*/ cEmpty, /*20*/ cEmpty, /*24*/ cEmpty),
    tr(/*30*/ cEmpty, /*34*/ cEmpty, /*36*/ cEmpty),
  );

  function run(anchor: number, head: number, command: Command) {
    let state = EditorState.create({
      doc: tbl,
      selection: CellSelection.create(tbl, anchor, head),
    });
    command(state, (transaction: Transaction) => {
      state = state.apply(transaction);
    });
    return state;
  }

  it('will put its head/anchor around the head cell', () => {
    let s = CellSelection.create(tbl, 2, 24);
    expect(s.anchor).toEqual(25);
    expect(s.head).toEqual(27);
    s = CellSelection.create(tbl, 24, 2);
    expect(s.anchor).toEqual(3);
    expect(s.head).toEqual(5);
    s = CellSelection.create(tbl, 10, 30);
    expect(s.anchor).toEqual(31);
    expect(s.head).toEqual(33);
    s = CellSelection.create(tbl, 30, 10);
    expect(s.anchor).toEqual(11);
    expect(s.head).toEqual(13);
  });

  it('extends a row selection when adding a row', () => {
    let sel = run(34, 6, addRowBefore).selection as CellSelection;
    expect(sel.$anchorCell.pos).toEqual(48);
    expect(sel.$headCell.pos).toEqual(6);
    sel = run(6, 30, addRowAfter).selection as CellSelection;
    expect(sel.$anchorCell.pos).toEqual(6);
    expect(sel.$headCell.pos).toEqual(44);
  });

  it('extends a col selection when adding a column', () => {
    let sel = run(16, 24, addColumnAfter).selection as CellSelection;
    expect(sel.$anchorCell.pos).toEqual(20);
    expect(sel.$headCell.pos).toEqual(32);
    sel = run(24, 30, addColumnBefore).selection as CellSelection;
    expect(sel.$anchorCell.pos).toEqual(32);
    expect(sel.$headCell.pos).toEqual(38);
  });
});

describe('CellSelection.content', () => {
  function slice(doc: PMNode) {
    return new Slice(doc.content, 1, 1);
  }

  it('contains only the selected cells', () => {
    const tbl = createTable(
      tr(c11, cAnchor, cEmpty),
      tr(c11, cEmpty, cHead),
      tr(c11, c11, c11),
    );
    const a = selectionFor(tbl)!.content();
    const b = slice(
      table()(tr(cAnchor, cEmpty), tr(cEmpty, cHead))(defaultSchema),
    );

    expect(a.eq(b)).toEqual(true);
  });

  it('understands spanning cells', () => {
    const tbl = createTable(
      tr(cAnchor, c(2, 2), c11, c11),
      tr(c11, cHead, c11, c11),
    );
    const a = selectionFor(tbl)!.content();
    const b = slice(createTable(tr(cAnchor, c(2, 2), c11), tr(c11, cHead)));

    expect(a.eq(b)).toEqual(true);
  });

  it('cuts off cells sticking out horizontally', () => {
    const tbl = createTable(
      tr(c11, cAnchor, c(2, 1)),
      tr(c(4, 1)),
      tr(c(2, 1), cHead, c11),
    );
    const a = selectionFor(tbl)!.content();
    const b = slice(
      createTable(
        tr(cAnchor, c11),
        tr(td({ colspan: 2 })(p())),
        tr(cEmpty, cHead),
      ),
    );

    expect(a.eq(b)).toEqual(true);
  });

  it('cuts off cells sticking out vertically', () => {
    const tbl = createTable(
      tr(c11, c(1, 4), c(1, 2)),
      tr(cAnchor),
      tr(c(1, 2), cHead),
      tr(c11),
    );
    const a = selectionFor(tbl)!.content();
    const b = slice(
      createTable(tr(cAnchor, td({ rowspan: 2 })(p()), cEmpty), tr(c11, cHead)),
    );

    expect(a.eq(b)).toEqual(true);
  });

  it('preserves column widths', () => {
    const tbl = createTable(
      tr(c11, cAnchor, c11),
      tr(td({ colspan: 3, colwidth: [100, 200, 300] })(p('x'))),
      tr(c11, cHead, c11),
    );
    const a = selectionFor(tbl)!.content();
    const b = slice(
      createTable(tr(cAnchor), tr(td({ colwidth: [200] })(p())), tr(cHead)),
    );

    expect(a.eq(b)).toEqual(true);
  });
});

describe('normalizeSelection', () => {
  const tbl = createTableWithDoc(
    tr(/* 2*/ c11, /* 7*/ c11, /*12*/ c11),
    tr(/*19*/ c11, /*24*/ c11, /*29*/ c11),
    tr(/*36*/ c11, /*41*/ c11, /*46*/ c11),
  );

  function normalize(
    selection: Selection,
    { allowTableNodeSelection = false } = {},
  ) {
    const state = EditorState.create({
      doc: tbl,
      selection,
      plugins: [tableEditing({ allowTableNodeSelection })],
    });
    return state.apply(state.tr).selection;
  }

  it('converts a table node selection into a selection of all cells in the table', () => {
    const a = normalize(NodeSelection.create(tbl, 0));
    const b = CellSelection.create(tbl, 2, 46);
    expect(a.eq(b)).toEqual(true);
  });

  it('retains a table node selection if the allowTableNodeSelection option is true', () => {
    const a = normalize(NodeSelection.create(tbl, 0), {
      allowTableNodeSelection: true,
    });
    const b = NodeSelection.create(tbl, 0);
    expect(a.eq(b)).toEqual(true);
  });

  it('converts a row node selection into a cell selection', () => {
    const a = normalize(NodeSelection.create(tbl, 1));
    const b = CellSelection.create(tbl, 2, 12);
    expect(a.eq(b)).toEqual(true);
  });

  it('converts a cell node selection into a cell selection', () => {
    const a = normalize(NodeSelection.create(tbl, 2));
    const b = CellSelection.create(tbl, 2, 2);
    expect(a.eq(b)).toEqual(true);
  });
});

describe('isRowSelection', () => {
  describe('when there is a merged cell in the first column', () => {
    const tbl = createTableWithDoc(
      tr(/* 2*/ cEmpty, /* 6*/ cEmpty, /*10*/ cEmpty),
      tr(/*16*/ c(1, 2), /*20*/ cEmpty, /*24*/ cEmpty),
      tr(
        /* empty */ /* selection starts here */ cAnchor,
        /* selection ends here */ cHead,
      ),
      tr(cEmpty, cEmpty, cEmpty),
    );

    it('should return TRUE if select rest of cells in a row', () => {
      const selection = selectionFor(tbl);

      expect(selection).toBeInstanceOf(CellSelection);
      expect((selection as CellSelection).isRowSelection()).toBe(true);
    });
  });

  describe('when there is a merged cell in the last column', () => {
    const tbl = createTableWithDoc(
      tr(/* 2*/ cEmpty, /* 6*/ cEmpty, /*10*/ cEmpty),
      tr(/*16*/ cEmpty, /*20*/ cEmpty, /*24*/ c(1, 2)),
      tr(/* selection starts here */ cAnchor, /* selection ends here */ cHead),
      tr(cEmpty, cEmpty, cEmpty),
    );

    it('should return TRUE if select rest of cells in a row', () => {
      const selection = selectionFor(tbl);

      expect(selection).toBeInstanceOf(CellSelection);
      expect((selection as CellSelection).isRowSelection()).toBe(true);
    });
  });

  describe('when there is a merged cell in the middle column', () => {
    const tbl = createTableWithDoc(
      tr(/* 2*/ cEmpty, /* 6*/ cEmpty, /*10*/ cEmpty),
      tr(/*16*/ cEmpty, /*20*/ c(1, 2), /*24*/ cEmpty),
      tr(/* selection starts here */ cAnchor, /* selection ends here */ cHead),
      tr(cEmpty, cEmpty, cEmpty),
    );

    it('should return TRUE if select rest of cells in a row', () => {
      const selection = selectionFor(tbl);

      expect(selection).toBeInstanceOf(CellSelection);
      expect((selection as CellSelection).isRowSelection()).toBe(true);
    });
  });

  describe('when there no merged cell in the table', () => {
    const tbl = createTableWithDoc(
      tr(/* 2*/ cEmpty, /* 6*/ cEmpty, /*10*/ cEmpty),
      tr(/*16*/ cEmpty, /*20*/ cEmpty, /*24*/ cEmpty),
      tr(/*30*/ cEmpty, /*34*/ cEmpty, /*36*/ cEmpty),
    );

    it('should be FALSE if select part of row', () => {
      const selection = CellSelection.create(tbl, 2, 6);
      expect(selection).toBeInstanceOf(CellSelection);
      expect((selection as CellSelection).isRowSelection()).toBe(false);
    });

    it('should be FALSE if select part of row', () => {
      const selection = CellSelection.create(tbl, 20, 34);
      expect(selection).toBeInstanceOf(CellSelection);
      expect((selection as CellSelection).isRowSelection()).toBe(false);
    });

    it('should be TRUE if select a row', () => {
      const selection = CellSelection.create(tbl, 2, 10);
      expect(selection).toBeInstanceOf(CellSelection);
      expect((selection as CellSelection).isRowSelection()).toBe(true);
    });

    it('should be TRUE if select two rows', () => {
      const selection = CellSelection.create(tbl, 2, 24);
      expect(selection).toBeInstanceOf(CellSelection);
      expect((selection as CellSelection).isRowSelection()).toBe(true);
    });
  });

  describe('when there is a merged cell been selected', () => {
    it('should return FALSE if select merged cell in middle', () => {
      const tbl = createTableWithDoc(
        tr(/* 2*/ cEmpty, /* 6*/ cEmpty, /*10*/ cEmpty),
        tr(/*16*/ cEmpty, /*20*/ c(1, 2), /*24*/ cEmpty),
        tr(/*30*/ cEmpty, /*20 merged*/ /*34*/ cEmpty),
      );

      const selection = CellSelection.create(tbl, 20, 31);

      expect(selection).toBeInstanceOf(CellSelection);
      expect((selection as CellSelection).isRowSelection()).toBe(false);
    });

    it('should return TRUE if select merged cell in last column and first column', () => {
      const tbl = createTableWithDoc(
        tr(/* 2*/ cEmpty, /* 6*/ cEmpty, /*10*/ cEmpty),
        tr(/*16*/ cEmpty, /*20*/ cEmpty, /*24*/ c(1, 2)),
        tr(/*30*/ cEmpty, /*34*/ cEmpty),
      );

      const selection = CellSelection.create(tbl, 24, 31);

      expect(selection).toBeInstanceOf(CellSelection);
      expect((selection as CellSelection).isRowSelection()).toBe(true);
    });
  });
});
