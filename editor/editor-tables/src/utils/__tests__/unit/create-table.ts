import {
  createSchema,
  defaultSchema,
  defaultSchemaConfig,
  table as tableSchema,
} from '@atlaskit/adf-schema';
import {
  p,
  tr as row,
  table,
  td,
  th,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { cEmpty, hEmpty } from '../../../__tests__/__helpers/doc-builder';
import { createTable } from '../../create-table';
import { uuid } from '../../uuid';

describe('createTable', () => {
  const TABLE_LOCAL_ID = 'test-table-local-id';
  uuid.setStatic(TABLE_LOCAL_ID);

  afterAll(() => {
    uuid.setStatic(false);
  });

  it('should create a table node of size 3x3 by default', () => {
    const table = createTable({ schema: defaultSchema });
    expect(table.content.childCount).toEqual(3);
    expect(table.content.child(0).childCount).toEqual(3);
    expect(table.content.child(0).child(0).type).toEqual(
      defaultSchema.nodes.tableHeader,
    );
  });

  describe('when rowsCount = 4 and colsCount = 5', () => {
    it('should create a table node of size 4x5', () => {
      const table = createTable({
        schema: defaultSchema,
        rowsCount: 4,
        colsCount: 5,
      });
      expect(table.content.childCount).toEqual(4);
      expect(table.content.child(0).childCount).toEqual(5);
    });
  });

  describe('when withHeaderRow = false', () => {
    it('should create a table node without header rows', () => {
      const table = createTable({
        schema: defaultSchema,
        rowsCount: 3,
        colsCount: 3,
        withHeaderRow: false,
      });
      expect(table.content.child(0).child(0).type).toEqual(
        defaultSchema.nodes.tableCell,
      );
    });
  });

  describe('when cellContent is a node', () => {
    it('should set the content of each cell equal to the given `cellContent` node', () => {
      const tableResult = createTable({
        schema: defaultSchema,
        rowsCount: 3,
        colsCount: 3,
        withHeaderRow: true,
        cellContent: p('random')(defaultSchema),
      });

      const thWithRandomText = th()(p('random'));
      const tdWithRandomText = td()(p('random'));

      expect(tableResult.content.childCount).toEqual(3);

      expect(tableResult).toEqualDocument(
        table({ localId: TABLE_LOCAL_ID })(
          row(thWithRandomText, thWithRandomText, thWithRandomText),
          row(tdWithRandomText, tdWithRandomText, tdWithRandomText),
          row(tdWithRandomText, tdWithRandomText, tdWithRandomText),
        ),
      );
    });
  });

  describe('when cellContent is null', () => {
    it('should adds empty paragraph to all cells', () => {
      const tableResult = createTable({
        schema: defaultSchema,
        rowsCount: 3,
        colsCount: 3,
        withHeaderRow: true,
      });
      expect(tableResult.content.childCount).toEqual(3);
      expect(tableResult).toEqualDocument(
        table({ localId: TABLE_LOCAL_ID })(
          row(hEmpty, hEmpty, hEmpty),
          row(cEmpty, cEmpty, cEmpty),
          row(cEmpty, cEmpty, cEmpty),
        ),
      );
    });
  });

  describe('localId', () => {
    const config = defaultSchemaConfig;
    config.customNodeSpecs = {
      table: tableSchema,
    };
    const schema = createSchema(config);

    it('it should set localId attribute', () => {
      const table = createTable({
        schema,
      });

      expect(table.attrs).toEqual(
        expect.objectContaining({ localId: TABLE_LOCAL_ID }),
      );
    });
  });
});
