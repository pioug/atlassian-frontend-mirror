import {
  doc,
  p,
  tr as row,
  table,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  cEmpty,
  createEditorState,
} from '../../../__tests__/__helpers/doc-builder';
import { removeTable } from '../../remove-table';

describe('removeTable', () => {
  it('should return an original transaction that removes a table if cursor is not inside of it', () => {
    const input = doc(p('{cursor}'), table()(row(td()(p('1')), td()(p('2')))));
    const { tr } = createEditorState(input);
    const newTr = removeTable(tr);
    expect(tr).toBe(newTr);
  });

  it('should return a new transaction that removes a table if cursor is inside', () => {
    const input = doc(
      table()(row(td()(p('1{cursor}')), cEmpty), row(cEmpty, cEmpty)),
    );
    const { tr } = createEditorState(input);
    const newTr = removeTable(tr);
    expect(newTr).not.toBe(tr);
    expect(newTr.doc).toEqualDocument(doc(p('')));
  });
});
