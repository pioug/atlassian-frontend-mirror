import { EditorState } from 'prosemirror-state';

import { p, RefsNode, td, tr } from '@atlaskit/editor-test-helpers/doc-builder';

import {
  c,
  c11,
  cEmpty,
  createTable,
  createTableWithDoc,
  h11,
  hEmpty,
} from '../../../__tests__/__helpers/doc-builder';
import { fixTables } from '../../../utils/fix-tables';

const cw100 = td({ colwidth: [100] })(p('x'));
const cw200 = td({ colwidth: [200] })(p('x'));

function fix(table: RefsNode) {
  const state = EditorState.create({ doc: table });
  const tr = fixTables(state);
  return tr && tr.doc.firstChild;
}

describe('fixTable', () => {
  it("doesn't touch correct tables", () => {
    const tbl = createTableWithDoc(tr(c11, c11, c(1, 2)), tr(c11, c11));
    expect(fix(tbl)).toBeUndefined();
  });

  it('adds trivially missing cells', () => {
    const fixed = fix(createTableWithDoc(tr(c11, c11, c(1, 2)), tr(c11)))!;
    const expected = createTable(tr(c11, c11, c(1, 2)), tr(c11, cEmpty));
    expect(fixed.eq(expected)).toBeTruthy();
  });

  it('can add to multiple rows', () => {
    const fixed = fix(createTableWithDoc(tr(c11), tr(c11, c11), tr(c(3, 1))))!;
    const expected = createTable(
      tr(c11, cEmpty, cEmpty),
      tr(cEmpty, c11, c11),
      tr(c(3, 1)),
    );
    expect(fixed.eq(expected)).toBeTruthy();
  });

  it('will default to adding at the start of the first row', () => {
    const fixed = fix(createTableWithDoc(tr(c11), tr(c11, c11)))!;
    const expected = createTable(tr(cEmpty, c11), tr(c11, c11));
    expect(fixed.eq(expected)).toBeTruthy();
  });

  it('will default to adding at the end of the non-first row', () => {
    const fixed = fix(createTableWithDoc(tr(c11, c11), tr(c11)))!;
    const expected = createTable(tr(c11, c11), tr(c11, cEmpty));
    expect(fixed.eq(expected)).toBeTruthy();
  });

  it('will fix overlapping cells', () => {
    const fixed = fix(createTableWithDoc(tr(c11, c(1, 2), c11), tr(c(2, 1))))!;
    const expected = createTable(
      tr(c11, c(1, 2), c11),
      tr(c11, cEmpty, cEmpty),
    );
    expect(fixed.eq(expected)).toBeTruthy();
  });

  it('will fix a rowspan that sticks out of the table', () => {
    const fixed = fix(createTableWithDoc(tr(c11, c11), tr(c(1, 2), c11)))!;
    const expected = createTable(tr(c11, c11), tr(c11, c11));
    expect(fixed.eq(expected)).toBeTruthy();
  });

  it('makes sure column widths are coherent', () => {
    const fixed = fix(
      createTableWithDoc(tr(c11, c11, cw200), tr(cw100, c11, c11)),
    )!;
    const expected = createTable(tr(cw100, c11, cw200), tr(cw100, c11, cw200));
    expect(fixed.eq(expected)).toBeTruthy();
  });

  it('can update column widths on colspan cells', () => {
    const emptyTr = tr(c(0, 0));
    const fixed = fix(
      createTableWithDoc(tr(c11, c11, cw200), tr(c(3, 2)), emptyTr),
    )!;
    const expected = createTable(
      tr(c11, c11, cw200),
      tr(td({ colspan: 3, rowspan: 2, colwidth: [0, 0, 200] })(p('x'))),
      emptyTr,
    );

    expect(fixed.eq(expected)).toBeTruthy();
  });

  it('will update the odd one out when column widths disagree', () => {
    const fixed = fix(
      createTableWithDoc(
        tr(cw100, cw100, cw100),
        tr(cw200, cw200, cw100),
        tr(cw100, cw200, cw200),
      ),
    )!;
    const expected = createTable(
      tr(cw100, cw200, cw100),
      tr(cw100, cw200, cw100),
      tr(cw100, cw200, cw100),
    );

    expect(fixed.eq(expected)).toBeTruthy();
  });

  it('respects table role when inserting a cell', () => {
    const fixed = fix(createTableWithDoc(tr(h11), tr(c11, c11), tr(c(3, 1))))!;
    const expected = createTable(
      tr(h11, hEmpty, hEmpty),
      tr(cEmpty, c11, c11),
      tr(c(3, 1)),
    );

    expect(fixed.eq(expected)).toBeTruthy();
  });
});
