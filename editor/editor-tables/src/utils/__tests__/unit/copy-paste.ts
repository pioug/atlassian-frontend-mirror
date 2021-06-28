import { Fragment, Node as PMNode } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import {
  p,
  RefsNode,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  c,
  c11,
  cAnchor,
  cEmpty,
  createDoc,
  createTable,
  createTd,
  h11,
  hEmpty,
} from '../../../__tests__/__helpers/doc-builder';
import { TableMap } from '../../../table-map';
import { cellAround } from '../../../utils/cells';
import { clipCells, insertCells, pastedCells } from '../../copy-paste';

const cellRef = (ref: string, before: string = '', after: string = '') =>
  td()(p(`${before}{${ref}}${after}`));
const cEmptyNode = createTd({ content: p() });
const c11Node = createTd({});
const c22Node = createTd({ colspan: 2, rowspan: 2 });
const c21Node = createTd({ colspan: 2, rowspan: 1 });

describe('pastedCells', () => {
  function test(
    slice: RefsNode,
    width: number | null,
    height?: number,
    content?: any[],
  ) {
    const result = pastedCells(slice.slice(slice.refs.a, slice.refs.b));
    if (!result || width === null) {
      expect(result).toBeNull();
      return;
    }

    expect(result.rows.length).toEqual(result.height);
    expect(result.width).toEqual(width);
    expect(result.height).toEqual(height);
    if (content) {
      result.rows.forEach((row, i) => {
        const expected = Fragment.from(content[i]);
        expect(row.eq(expected)).toBeTruthy();
      });
    }
  }
  it('returns simple cells', () => {
    const table = createTable(tr('{a}', cEmpty, cEmpty, '{b}'));
    test(table, 2, 1, [[cEmptyNode, cEmptyNode]]);
  });

  it('returns cells wrapped in a row', () => {
    const table = createTable('{a}', tr(cEmpty, cEmpty), '{b}');
    test(table, 2, 1, [[cEmptyNode, cEmptyNode]]);
  });

  it('returns cells when the cursor is inside them', () => {
    const aFoo = cellRef('a', '', 'foo');
    const table = createTable(tr(aFoo, td()(p('{b}bar'))));
    test(table, 2, 1, [[createTd({ content: p('{a}foo') }), cEmptyNode]]);
  });

  it('returns multiple rows', () => {
    const table = createTable(
      tr('{a}', cEmpty, cEmpty),
      tr(cEmpty, c11),
      '{b}',
    );
    test(table, 2, 2, [
      [cEmptyNode, cEmptyNode],
      [cEmptyNode, c11Node],
    ]);
  });

  it('will enter a fully selected table', () => {
    const doc = createDoc('{a}', table()(tr(c11)), '{b}');
    test(doc, 1, 1, [[c11Node]]);
  });

  it('can normalize a partially-selected row', () => {
    const table = createTable(
      tr(td()(p(), '{a}'), cEmpty, c11),
      tr(c11, c11),
      '{b}',
    );

    test(table, 2, 2, [
      [cEmptyNode, c11Node],
      [c11Node, c11Node],
    ]);
  });

  it('will make sure the result is rectangular', () => {
    const table = createTable(
      '{a}',
      tr(c(2, 2), c11),
      tr(cEmpty),
      tr(c11, c11),
      '{b}',
    );

    test(table, 3, 3, [
      [c22Node, c11Node],
      [cEmptyNode],
      [c11Node, c11Node, cEmptyNode],
    ]);
  });

  it('can handle rowspans sticking out', () => {
    const table = createTable('{a}', tr(c(1, 3), c11), '{b}');
    test(table, 2, 3, [
      [createTd({ colspan: 1, rowspan: 3 }), c11Node],
      [cEmptyNode],
      [cEmptyNode],
    ]);
  });

  it('returns null for non-cell selection', () => {
    const doc = createDoc(p('foo{a}bar'), p('baz{b}'));
    test(doc, null);
  });
});

describe('clipCells', () => {
  function test(
    slice: RefsNode,
    width: number,
    height: number,
    content: any[],
  ) {
    const pasted = pastedCells(slice.slice(slice.refs.a, slice.refs.b));
    if (pasted) {
      const result = clipCells(pasted, width, height);
      expect(result.rows.length).toEqual(result.height);
      expect(result.width).toEqual(width);
      expect(result.height).toEqual(height);
      if (content) {
        result.rows.forEach((row, i) => {
          const expected = Fragment.from(content[i]);
          expect(row.eq(expected)).toBeTruthy();
        });
      }
    }
  }

  it('can clip off excess cells', () => {
    const table = createTable('{a}', tr(cEmpty, c11), tr(c11, c11), '{b}');
    test(table, 1, 1, [[cEmptyNode]]);
  });

  it('will pad by repeating cells', () => {
    const table = createTable('{a}', tr(cEmpty, c11), tr(c11, cEmpty), '{b}');

    test(table, 4, 4, [
      [cEmptyNode, c11Node, cEmptyNode, c11Node],
      [c11Node, cEmptyNode, c11Node, cEmptyNode],
      [cEmptyNode, c11Node, cEmptyNode, c11Node],
      [c11Node, cEmptyNode, c11Node, cEmptyNode],
    ]);
  });

  it('takes rowspan into account when counting width', () => {
    const table = createTable('{a}', tr(c(2, 2), c11), tr(c11), '{b}');

    test(table, 6, 2, [
      [c22Node, c11Node, c22Node, c11Node],
      [c11Node, c11Node],
    ]);
  });

  it('clips off excess colspan', () => {
    const table = createTable('{a}', tr(c(2, 2), c11), tr(c11), '{b}');
    test(table, 4, 2, [
      [c22Node, c11Node, createTd({ colspan: 1, rowspan: 2 })],
      [c11Node],
    ]);
  });

  it('clips off excess rowspan', () => {
    const table = createTable('{a}', tr(c(2, 2), c11), tr(c11), '{b}');
    test(table, 2, 3, [[c22Node], [], [c21Node]]);
  });

  it('clips off excess rowspan when new table height is bigger than the current table height', () => {
    const table = createTable('{a}', tr(c(1, 2), c(2, 1)), tr(c11, c11), '{b}');
    test(table, 3, 1, [[c11Node, c21Node]]);
  });
});

describe('insertCells', () => {
  function test(table: RefsNode, cells: RefsNode, result: PMNode) {
    let state = EditorState.create({ doc: table });
    const $cell = cellAround(table.resolve(table.refs.anchor))!;
    const map = TableMap.get(table);
    insertCells(
      state,
      (tr) => (state = state.apply(tr)),
      0,
      map.findCell($cell.pos),
      pastedCells(cells.slice(cells.refs.a, cells.refs.b))!,
    );
    expect(state.doc.eq(result)).toBeTruthy();
  }

  it('keeps the original cells', () => {
    const aFoo = cellRef('a', '', 'foo');
    const table = createTable(tr(cAnchor, c11, c11), tr(c11, c11, c11));
    const paste = createTable(tr(aFoo, cEmpty), tr(c(2, 1), '{b}'));
    const result = createTable(tr(aFoo, cEmpty, c11), tr(c(2, 1), c11));

    test(table, paste, result);
  });

  it('makes sure the table is big enough', () => {
    const aFoo = cellRef('a', '', 'foo');
    const table = createTable(tr(cAnchor));
    const paste = createTable(tr(aFoo, cEmpty), tr(c(2, 1), '{b}'));
    const result = createTable(tr(aFoo, cEmpty), tr(c(2, 1)));

    test(table, paste, result);
  });

  it('preserves headers while growing a table', () => {
    const aFoo = cellRef('a', '', 'foo');
    const table = createTable(
      tr(h11, h11, h11),
      tr(h11, c11, c11),
      tr(h11, c11, cAnchor),
    );
    const paste = createTable(tr(aFoo, cEmpty), tr(c11, c11, '{b}'));
    const result = createTable(
      tr(h11, h11, h11, hEmpty),
      tr(h11, c11, c11, cEmpty),
      tr(h11, c11, aFoo, cEmpty),
      tr(hEmpty, cEmpty, c11, c11),
    );
    test(table, paste, result);
  });

  it('will split interfering rowspan cells', () => {
    const table = createTable(
      tr(c11, c(1, 4), c11),
      tr(cAnchor, c11),
      tr(c11, c11),
      tr(c11, c11),
    );
    const paste = createTable(tr('{a}', cEmpty, cEmpty, cEmpty, '{b}'));
    const result = createTable(
      tr(c11, c11, c11),
      tr(cEmpty, cEmpty, cEmpty),
      tr(c11, td({ rowspan: 2 })(p()), c11),
      tr(c11, c11),
    );

    test(table, paste, result);
  });

  it('will split interfering colspan cells', () => {
    const table = createTable(
      tr(c11, cAnchor, c11),
      tr(c(2, 1), c11),
      tr(c11, c(2, 1)),
    );
    const paste = createTable('{a}', tr(cEmpty), tr(cEmpty), tr(cEmpty), '{b}');
    const result = createTable(
      tr(c11, cEmpty, c11),
      tr(c11, cEmpty, c11),
      tr(c11, cEmpty, cEmpty),
    );

    test(table, paste, result);
  });

  it('preserves widths when splitting', () => {
    const table = createTable(
      tr(c11, cAnchor, c11),
      tr(td({ colspan: 3, colwidth: [100, 200, 300] })(p('x'))),
    );
    const paste = createTable('{a}', tr(cEmpty), tr(cEmpty), '{b}');

    const expected = createTable(
      tr(c11, cEmpty, c11),
      tr(td({ colwidth: [100] })(p('x')), cEmpty, td({ colwidth: [300] })(p())),
    );
    test(table, paste, expected);
  });
});
