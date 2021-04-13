import { EditorState } from 'prosemirror-state';

import { p, td, th, tr } from '@atlaskit/editor-test-helpers/doc-builder';

import {
  c,
  c11,
  cAnchor,
  cCursor,
  cEmpty,
  cHead,
  createTable,
  hEmpty,
} from '../../../__tests__/__helpers/doc-builder';
import { testCommand } from '../../../__tests__/__helpers/test-command';
import { Command } from '../../../types';
import { splitCell } from '../../../utils/split-cell';
import { GetCellTypeArgs, splitCellWithType } from '../../split-cell-with-type';

describe('splitCell', () => {
  it('does nothing when cursor is inside of a cell with attributes colspan = 1 and rowspan = 1', () => {
    const input = createTable(tr(cCursor, c11));
    testCommand(input, splitCell, null);
  });

  it('can split when col-spanning cell with cursor', () => {
    const input = createTable(tr(td({ colspan: 2 })(p('foo{cursor}')), c11));
    const result = createTable(tr(td()(p('foo')), cEmpty, c11));
    testCommand(input, splitCell, result);
  });

  it('can split when col-spanning header-cell with cursor', () => {
    const input = createTable(tr(th({ colspan: 2 })(p('foo{cursor}'))));
    const result = createTable(tr(th()(p('foo')), hEmpty));
    testCommand(input, splitCell, result);
  });

  it('does nothing for a multi-cell selection', () => {
    const input = createTable(tr(cAnchor, cHead, c11));
    testCommand(input, splitCell, null);
  });

  it("does nothing when the selected cell doesn't span anything", () => {
    const input = createTable(tr(cAnchor, c11));
    testCommand(input, splitCell, null);
  });

  it('can split a col-spanning cell', () => {
    const input = createTable(tr(td({ colspan: 2 })(p('foo{anchor}')), c11));
    const result = createTable(tr(td()(p('foo')), cEmpty, c11));
    testCommand(input, splitCell, result);
  });

  it('can split a row-spanning cell', () => {
    const input = createTable(
      tr(c11, td({ rowspan: 2 })(p('foo{anchor}')), c11),
      tr(c11, c11),
    );
    const result = createTable(
      tr(c11, td()(p('foo')), c11),
      tr(c11, cEmpty, c11),
    );
    testCommand(input, splitCell, result);
  });

  it('can split a rectangular cell', () => {
    const input = createTable(
      tr(c(4, 1)),
      tr(c11, td({ rowspan: 2, colspan: 2 })(p('foo{anchor}')), c11),
      tr(c11, c11),
    );
    const result = createTable(
      tr(c(4, 1)),
      tr(c11, td()(p('foo')), cEmpty, c11),
      tr(c11, cEmpty, cEmpty, c11),
    );
    testCommand(input, splitCell, result);
  });

  it('distributes column widths', () => {
    const input = createTable(
      tr(td({ colspan: 3, colwidth: [100, 0, 200] })(p('a{anchor}'))),
    );
    const result = createTable(
      tr(td({ colwidth: [100] })(p('a')), cEmpty, td({ colwidth: [200] })(p())),
    );
    testCommand(input, splitCell, result);
  });

  describe('with custom cell type', () => {
    function createGetCellType(state: EditorState) {
      return ({ row }: GetCellTypeArgs) => {
        if (row === 0) {
          return state.schema.nodes.tableHeader;
        }
        return state.schema.nodes.tableCell;
      };
    }

    const splitCellWithOnlyHeaderInColumnZero: Command = (state, dispatch) =>
      splitCellWithType(createGetCellType(state))(state, dispatch);

    it('can split a row-spanning header cell into a header and normal cell ', () => {
      const input = createTable(
        tr(c11, td({ rowspan: 2 })(p('foo{anchor}')), c11),
        tr(c11, c11),
      );
      const result = createTable(
        tr(c11, th()(p('foo')), c11),
        tr(c11, cEmpty, c11),
      );
      testCommand(input, splitCellWithOnlyHeaderInColumnZero, result);
    });
  });
});
