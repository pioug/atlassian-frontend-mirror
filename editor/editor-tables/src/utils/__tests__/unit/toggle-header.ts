import { defaultSchema } from '@atlaskit/adf-schema';
import { doc, p, table, tr } from '@atlaskit/editor-test-helpers/doc-builder';

import {
  c,
  c11,
  cCursor,
  h,
  h11,
  hCursor,
} from '../../../__tests__/__helpers/doc-builder';
import { testCommand } from '../../../__tests__/__helpers/test-command';
import { toggleHeader } from '../../toggle-header';

describe('toggleHeader', () => {
  it('turns a header row with colspan and rowspan into a regular cell', () => {
    const input = doc(
      p('x'),
      table()(tr(h(2, 1), h(1, 2)), tr(cCursor, c11), tr(c11, c11, c11)),
    )(defaultSchema);

    const result = doc(
      p('x'),
      table()(tr(c(2, 1), c(1, 2)), tr(cCursor, c11), tr(c11, c11, c11)),
    )(defaultSchema);

    testCommand(input, toggleHeader('row'), result);
  });

  it('turns a header column with colspan and rowspan into a regular cell', () => {
    const input = doc(
      p('x'),
      table()(tr(h(2, 1), h(1, 2)), tr(cCursor, c11), tr(c11, c11, c11)),
    )(defaultSchema);

    const result = doc(
      p('x'),
      table()(tr(h(2, 1), h(1, 2)), tr(h11, c11), tr(h11, c11, c11)),
    )(defaultSchema);

    testCommand(input, toggleHeader('column'), result);
  });

  it('should keep first cell as header when the column header is enabled', () => {
    const input = doc(
      p('x'),
      table()(tr(h11, c11), tr(hCursor, c11), tr(h11, c11)),
    )(defaultSchema);

    const result = doc(
      p('x'),
      table()(tr(h11, h11), tr(h11, c11), tr(h11, c11)),
    )(defaultSchema);

    testCommand(input, toggleHeader('row'), result);
  });

  describe('new behavior', () => {
    it('turns a header column into regular cells without override header row', () => {
      const input = doc(table()(tr(hCursor, h11), tr(h11, c11)))(defaultSchema);

      const result = doc(table()(tr(hCursor, h11), tr(c11, c11)))(
        defaultSchema,
      );

      testCommand(input, toggleHeader('column'), result);
    });
  });
});
