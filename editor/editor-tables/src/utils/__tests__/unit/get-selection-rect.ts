import { defaultSchema } from '@atlaskit/adf-schema';
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
import { selectionFor } from '../../../__tests__/__helpers/selection-for';
import { getSelectionRect } from '../../get-selection-rect';

describe('getSelectionRect', () => {
  it('should return `undefined` if there selection is not a CellSelection', () => {
    const input = doc(p('one'));
    const { selection } = createEditorState(input);
    const rect = getSelectionRect(selection);
    expect(rect).toBeUndefined();
  });

  it('should return selection rect if selection is a CellSelection', () => {
    const input = doc(
      table()(
        row(td()(p('{anchor}')), cEmpty, cEmpty),
        row(cEmpty, cEmpty, cEmpty),
        row(cEmpty, td()(p('{head}')), cEmpty),
      ),
    )(defaultSchema);
    const selection = selectionFor(input)!;
    const rect = getSelectionRect(selection)!;

    expect(rect.top).toEqual(0);
    expect(rect.bottom).toEqual(3);
    expect(rect.left).toEqual(0);
    expect(rect.right).toEqual(2);
  });
});
