import { defaultSchema as schema } from '@atlaskit/adf-schema';
import {
  p,
  tr as row,
  table,
  td,
  th,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { hasMergedCell } from '../../../utils/table';

describe('@atlaskit/editor-common table utils 2', () => {
  describe('when there is no merged cells', () => {
    const tableNode = table()(
      row(
        th()(p('Header content 1')),
        th()(p('Header content 2')),
        th()(p('Header content 3')),
      ),
      row(
        td()(p('Body content 1')),
        td()(p('Body content 2')),
        td()(p('Body content 3')),
      ),
      row(
        td()(p('Body content 1')),
        td()(p('Body content 2')),
        td()(p('Body content 3')),
      ),
    );

    it('should returns false', () => {
      const defaultTableFromSchema = tableNode(schema);
      const result = hasMergedCell(defaultTableFromSchema);

      expect(result).toBeFalsy();
    });
  });

  describe('when there is merged cols', () => {
    const tableNode = table()(
      row(
        th()(p('Header content 1')),
        th({ colspan: 2 })(p('Header content 2')),
      ),
      row(
        td()(p('Body content 1')),
        td()(p('Body content 2')),
        td()(p('Body content 3')),
      ),
      row(
        td()(p('Body content 1')),
        td()(p('Body content 2')),
        td()(p('Body content 3')),
      ),
    );

    it('should returns true', () => {
      const defaultTableFromSchema = tableNode(schema);
      const result = hasMergedCell(defaultTableFromSchema);

      expect(result).toBeTruthy();
    });
  });

  describe('when there is merged rows', () => {
    const tableNode = table()(
      row(
        th()(p('Header content 1')),
        th({ rowspan: 2 })(p('Header content 2')),
        th()(p('Header content 3')),
      ),
      row(td()(p('Body content 1')), td()(p('Body content 2'))),
      row(
        td()(p('Body content 1')),
        td()(p('Body content 2')),
        td()(p('Body content 3')),
      ),
    );

    it('should returns true', () => {
      const defaultTableFromSchema = tableNode(schema);
      const result = hasMergedCell(defaultTableFromSchema);

      expect(result).toBeTruthy();
    });
  });
});
