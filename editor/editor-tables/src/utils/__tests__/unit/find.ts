import { defaultSchema } from '@atlaskit/adf-schema';
import {
  doc,
  p,
  tr as row,
  table,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  cCursor,
  cEmpty,
  createEditorState,
} from '../../../__tests__/__helpers/doc-builder';
import { selectionFor } from '../../../__tests__/__helpers/selection-for';
import {
  findCellClosestToPos,
  findCellRectClosestToPos,
  findTable,
} from '../../find';

describe('findTable', () => {
  it('should find table node if cursor is inside of a table cell', () => {
    const input = doc(table()(row(cCursor)))(defaultSchema);
    const selection = selectionFor(input)!;
    const { node } = findTable(selection)!;
    expect(node.type.name).toEqual('table');
  });

  it('should return `undefined` if there is no table parent node', () => {
    const input = doc(p('{cursor}'))(defaultSchema);
    const selection = selectionFor(input)!;
    const result = findTable(selection);
    expect(result).toBeUndefined();
  });
});

describe('findCellClosestToPos', () => {
  it('should return a cell object closest to a given `$pos`', () => {
    const input = doc(
      table()(row(td()(p('one one')), cEmpty), row(td()(p('two two')), cEmpty)),
    );
    const { tr } = createEditorState(input);
    const cell = findCellClosestToPos(tr.doc.resolve(4))!;
    expect(cell.node.type.name).toEqual('tableCell');
    expect(cell.pos).toEqual(2);
  });

  it('should return `undefined` if there is no cell close to a given `$pos`', () => {
    const { tr } = createEditorState(doc(p('one')));
    const cell = findCellClosestToPos(tr.doc.resolve(4));
    expect(cell).toBeUndefined();
  });
});

describe('findCellRectClosestToPos', () => {
  it('should return `undefined` if there is no cell close to a given `$pos`', () => {
    const { tr } = createEditorState(doc(p('one')));
    const rect = findCellRectClosestToPos(tr.doc.resolve(4));
    expect(rect).toBeUndefined();
  });

  it('should return a cell object closest to a given `$pos`', () => {
    const input = doc(
      table()(
        row(cEmpty, cEmpty, cEmpty),
        row(cEmpty, cEmpty, cCursor),
        row(cEmpty, cEmpty, cEmpty),
      ),
    )(defaultSchema);
    const selection = selectionFor(input)!;
    const rect = findCellRectClosestToPos(selection.$from)!;
    expect(rect.top).toEqual(1);
    expect(rect.bottom).toEqual(2);
    expect(rect.left).toEqual(2);
    expect(rect.right).toEqual(3);
  });
});
