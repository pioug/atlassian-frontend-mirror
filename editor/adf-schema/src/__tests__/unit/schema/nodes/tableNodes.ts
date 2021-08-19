import { uuid } from '../../../../utils';
import { createSchema } from '../../../../schema/create-schema';
import {
  table,
  TableAttributes,
  CellAttributes,
} from '../../../../schema/nodes/tableNodes';
import { fromHTML, toHTML } from '../../../../../test-helpers';
import { name } from '../../../../version.json';
import {
  ATTRIBUTES_PARSE_DEFAULTS,
  ATTRIBUTES_PARSE_NUMBERED_COLUMNS,
  ATTRIBUTES_PARSE_WIDE_LAYOUT,
  ATTRIBUTES_PARSE_FULLWIDTH_LAYOUT,
  HTML_PARSE_EDITOR_2x2,
  HTML_PARSE_EDITOR_2x2_WITH_HEADER_COLUMN,
  HTML_PARSE_EDITOR_2x1_ONLY_HEADERS,
  HTML_PARSE_EDITOR_2x1_PARTIAL_CELL_SELECTION,
  HTML_PARSE_EDITOR_1x2_PARTIAL_HEADER_CELL,
  HTML_PARSE_EDITOR_P_TABLE_P_RANGE,
  HTML_PARSE_EDITOR_P_PARTIAL_TABLE,
  HTML_PARSE_RENDERER_FULL_TABLE_2x2_NO_HEADERS,
  HTML_PARSE_RENDERER_FULL_TABLE_2x2_HEADER_COLUMN,
  HTML_PARSE_RENDERER_FULL_TABLE_2x2_HEADER_ROW,
  HTML_PARSE_RENDERER_FULL_2x1_TABLE_ONLY_HEADERS,
  HTML_PARSE_RENDERER_PARTIAL_TABLE_2x1_CELL_SELECTION,
  HTML_PARSE_RENDERER_PARTIAL_TABLE_2x1_HEADER_CELL_SELECTION,
  HTML_PARSE_RENDERER_P_TABLE_P_SELECTION_RANGE,
  HTML_PARSE_RENDERER_P_PARTIAL_TABLE_SELECTION_RANGE,
  HTML_PARSE_GOOGLE_SHEETS_DATA_CELLS,
} from './_consts';

const makeSchema = () =>
  createSchema({
    nodes: [
      'doc',
      'paragraph',
      'text',
      'table',
      'tableRow',
      'tableCell',
      'tableHeader',
    ],
    marks: ['unsupportedMark', 'unsupportedNodeAttribute'],
  });

const TABLE_LOCAL_ID = 'test-table-local-id';

describe(`${name}/schema table node`, () => {
  beforeAll(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
  });

  afterAll(() => {
    uuid.setStatic(false);
  });

  const schema = makeSchema();

  it('should have isolating property to be true', () => {
    expect(schema.nodes.table.spec.isolating).toEqual(true);
  });
  it('should have selectable property to be false', () => {
    expect(schema.nodes.table.spec.selectable).toEqual(false);
  });

  describe('parse attributes', () => {
    it('should parse with defaults if missing', () => {
      const doc = fromHTML(ATTRIBUTES_PARSE_DEFAULTS, schema);

      const parsedTable = doc.firstChild!;
      expect(parsedTable.type.spec).toEqual(table);
      expect(parsedTable.attrs).toEqual({
        __autoSize: false,
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: TABLE_LOCAL_ID,
      });
    });

    it('should parse numbered columns', () => {
      const doc = fromHTML(ATTRIBUTES_PARSE_NUMBERED_COLUMNS, schema);

      const parsedTable = doc.firstChild!;
      expect(parsedTable.type.spec).toEqual(table);
      expect(parsedTable.attrs).toEqual({
        __autoSize: false,
        isNumberColumnEnabled: true,
        layout: 'default',
        localId: TABLE_LOCAL_ID,
      });
    });

    it('should parse wide layout', () => {
      const doc = fromHTML(ATTRIBUTES_PARSE_WIDE_LAYOUT, schema);

      const parsedTable = doc.firstChild!;
      expect(parsedTable.type.spec).toEqual(table);
      expect(parsedTable.attrs).toEqual({
        __autoSize: false,
        isNumberColumnEnabled: false,
        layout: 'wide',
        localId: TABLE_LOCAL_ID,
      });
    });

    it('should parse full-width layout', () => {
      const doc = fromHTML(ATTRIBUTES_PARSE_FULLWIDTH_LAYOUT, schema);

      const parsedTable = doc.firstChild!;
      expect(parsedTable.type.spec).toEqual(table);
      expect(parsedTable.attrs).toEqual({
        __autoSize: false,
        isNumberColumnEnabled: false,
        layout: 'full-width',
        localId: TABLE_LOCAL_ID,
      });
    });
  });

  describe('parse from HTML/clipboard', () => {
    describe('parse from editor encoded HTML', () => {
      it('should parse from 2x2 table selection', () => {
        const doc = fromHTML(HTML_PARSE_EDITOR_2x2, schema);

        const parsedTable = doc.firstChild!;
        // type
        expect(parsedTable.type.spec).toEqual(table);
        // structure
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableHeader(paragraph("A")), tableHeader(paragraph("B"))), tableRow(tableCell(paragraph("1")), tableCell(paragraph("2"))))',
        );
        // attributes
        expect(parsedTable.attrs).toEqual({
          __autoSize: false,
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: TABLE_LOCAL_ID,
        });
      });

      it('should parse from 2x2 table selection with header column', () => {
        const doc = fromHTML(HTML_PARSE_EDITOR_2x2_WITH_HEADER_COLUMN, schema);

        const parsedTable = doc.firstChild!;
        expect(parsedTable.type.spec).toEqual(table);
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableHeader(paragraph("A")), tableCell(paragraph("B"))), tableRow(tableHeader(paragraph("1")), tableCell(paragraph("2"))))',
        );
      });

      it('should parse partial selection from 2x1 table header selection', () => {
        const doc = fromHTML(HTML_PARSE_EDITOR_2x1_ONLY_HEADERS, schema);

        const parsedTable = doc.firstChild!;
        expect(parsedTable.type.spec).toEqual(table);
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableHeader(paragraph("A")), tableHeader(paragraph("B"))))',
        );
      });

      it('should parse partial selection from 2x1 table cell selection', () => {
        const doc = fromHTML(
          HTML_PARSE_EDITOR_2x1_PARTIAL_CELL_SELECTION,
          schema,
        );

        const parsedTable = doc.firstChild!;
        expect(parsedTable.type.spec).toEqual(table);
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableCell(paragraph("1")), tableCell(paragraph("2"))))',
        );
      });

      it('should parse partial selection from 1x2 table header/cell selection', () => {
        const doc = fromHTML(HTML_PARSE_EDITOR_1x2_PARTIAL_HEADER_CELL, schema);

        const parsedTable = doc.firstChild!;
        expect(parsedTable.type.spec).toEqual(table);
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableHeader(paragraph("B"))), tableRow(tableCell(paragraph("2"))))',
        );
      });

      it('should parse paragraph/table/paragraph from range selection', () => {
        const doc = fromHTML(HTML_PARSE_EDITOR_P_TABLE_P_RANGE, schema);

        const parsedTable = doc.child(1)!;
        expect(parsedTable.type.spec).toEqual(table);
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableHeader(paragraph("A")), tableHeader(paragraph("B"))), tableRow(tableCell(paragraph("1")), tableCell(paragraph("2"))))',
        );
      });

      it('should parse paragraph and partial table selection from range selection', () => {
        const doc = fromHTML(HTML_PARSE_EDITOR_P_PARTIAL_TABLE, schema);

        const parsedTable = doc.child(1)!;
        expect(parsedTable.type.spec).toEqual(table);
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableHeader(paragraph("A")), tableHeader(paragraph("B"))), tableRow(tableCell(paragraph("1"))))',
        );
        expect(parsedTable.attrs).toEqual({
          __autoSize: false,
          isNumberColumnEnabled: false,
          layout: 'full-width',
          localId: TABLE_LOCAL_ID,
        });
      });
    });

    /*
     * Scenarios
     * - a full 2x2 table selection (no headers)
     * - a full 2x2 table selection (with column headers)
     * - a full 2x2 table selection (with row headers)
     * - a full 2x1 table selection (only headers)
     * - a partial 2x1 cell selection
     * - a partial 2x1 header/cell selection
     * - a paragraph/full table/p selection range
     * - a paragraph/partial table selection range
     */
    describe('parse from renderer encoded HTML', () => {
      it('should parse a full 2x2 table selection (no headers)', () => {
        const doc = fromHTML(
          HTML_PARSE_RENDERER_FULL_TABLE_2x2_NO_HEADERS,
          schema,
        );

        const parsedTable = doc.firstChild!;
        // type
        expect(parsedTable.type.spec).toEqual(table);
        // structure
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableCell(paragraph("A")), tableCell(paragraph("B"))), tableRow(tableCell(paragraph("C")), tableCell(paragraph("D"))))',
        );
        // attributes
        expect(parsedTable.attrs).toEqual({
          __autoSize: false,
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: TABLE_LOCAL_ID,
        });
      });

      it('should parse a full 2x2 table selection (with header column)', () => {
        const doc = fromHTML(
          HTML_PARSE_RENDERER_FULL_TABLE_2x2_HEADER_COLUMN,
          schema,
        );

        const parsedTable = doc.firstChild!;
        // type
        expect(parsedTable.type.spec).toEqual(table);
        // structure
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableHeader(paragraph("A")), tableCell(paragraph("B"))), tableRow(tableHeader(paragraph("C")), tableCell(paragraph("D"))))',
        );
        // attributes
        expect(parsedTable.attrs).toEqual({
          __autoSize: false,
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: TABLE_LOCAL_ID,
        });
      });

      it('should parse a full 2x2 table selection (with header row)', () => {
        const doc = fromHTML(
          HTML_PARSE_RENDERER_FULL_TABLE_2x2_HEADER_ROW,
          schema,
        );

        const parsedTable = doc.firstChild!;
        // type
        expect(parsedTable.type.spec).toEqual(table);
        // structure
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableHeader(paragraph("A")), tableHeader(paragraph("B"))), tableRow(tableCell(paragraph("C")), tableCell(paragraph("D"))))',
        );
        // attributes
        expect(parsedTable.attrs).toEqual({
          __autoSize: false,
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: TABLE_LOCAL_ID,
        });
      });
      it('should parse a full 2x1 table selection (only headers)', () => {
        const doc = fromHTML(
          HTML_PARSE_RENDERER_FULL_2x1_TABLE_ONLY_HEADERS,
          schema,
        );

        const parsedTable = doc.firstChild!;
        // type
        expect(parsedTable.type.spec).toEqual(table);
        // structure
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableHeader(paragraph("A")), tableHeader(paragraph("B"))), tableRow(tableHeader(paragraph("C")), tableHeader(paragraph("D"))))',
        );
        // attributes
        expect(parsedTable.attrs).toEqual({
          __autoSize: false,
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: TABLE_LOCAL_ID,
        });
      });
      it('should parse a partial 2x1 cell selection', () => {
        const doc = fromHTML(
          HTML_PARSE_RENDERER_PARTIAL_TABLE_2x1_CELL_SELECTION,
          schema,
        );

        const parsedTable = doc.firstChild!;
        // type
        expect(parsedTable.type.spec).toEqual(table);
        // structure
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableCell(paragraph("A")), tableCell(paragraph("B"))))',
        );
        // attributes
        expect(parsedTable.attrs).toEqual({
          __autoSize: false,
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: TABLE_LOCAL_ID,
        });
      });
      it('should parse a partial 2x1 header/cell selection', () => {
        const doc = fromHTML(
          HTML_PARSE_RENDERER_PARTIAL_TABLE_2x1_HEADER_CELL_SELECTION,
          schema,
        );

        const parsedTable = doc.firstChild!;
        // type
        expect(parsedTable.type.spec).toEqual(table);
        // structure
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableHeader(paragraph("A")), tableCell(paragraph("B"))))',
        );
        // attributes
        expect(parsedTable.attrs).toEqual({
          __autoSize: false,
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: TABLE_LOCAL_ID,
        });
      });
      it('should parse a paragraph/full table/p selection range', () => {
        const doc = fromHTML(
          HTML_PARSE_RENDERER_P_TABLE_P_SELECTION_RANGE,
          schema,
        );

        const parsedTable = doc.child(1)!;
        // type
        expect(parsedTable.type.spec).toEqual(table);
        // structure
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableHeader(paragraph("A")), tableHeader(paragraph("B"))), tableRow(tableCell(paragraph("C")), tableCell(paragraph("D"))))',
        );
        // attributes
        expect(parsedTable.attrs).toEqual({
          __autoSize: false,
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: TABLE_LOCAL_ID,
        });
      });
      it('should parse a paragraph/partial table selection range', () => {
        const doc = fromHTML(
          HTML_PARSE_RENDERER_P_PARTIAL_TABLE_SELECTION_RANGE,
          schema,
        );

        const parsedTable = doc.child(1)!;
        // type
        expect(parsedTable.type.spec).toEqual(table);
        // structure
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableHeader(paragraph("A")), tableHeader(paragraph("B"))), tableRow(tableCell(paragraph("C"))))',
        );
        // attributes
        expect(parsedTable.attrs).toEqual({
          __autoSize: false,
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: TABLE_LOCAL_ID,
        });
      });
    });

    describe('parse from Google sheets encoded HTML', () => {
      it('should parse selected cells', () => {
        const doc = fromHTML(HTML_PARSE_GOOGLE_SHEETS_DATA_CELLS, schema);

        const parsedTable = doc.firstChild!;
        // type
        expect(parsedTable.type.spec).toEqual(table);
        // structure
        expect(parsedTable.toString()).toEqual(
          'table(tableRow(tableCell(paragraph), tableCell(paragraph("Team members"))), tableRow(tableCell(paragraph("1")), tableCell(paragraph("Han"))), tableRow(tableCell(paragraph("2")), tableCell(paragraph("Kristina"))), tableRow(tableCell(paragraph("3")), tableCell(paragraph("Lucy"))), tableRow(tableCell(paragraph("4")), tableCell(paragraph("Mario"))), tableRow(tableCell(paragraph("5")), tableCell(paragraph("Pavlo"))), tableRow(tableCell(paragraph("6")), tableCell(paragraph("Sam"))), tableRow(tableCell(paragraph("7")), tableCell(paragraph("Twig"))), tableRow(tableCell(paragraph("8")), tableCell(paragraph("Wing"))))',
        );
        // attributes
        expect(parsedTable.attrs).toEqual({
          __autoSize: false,
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: TABLE_LOCAL_ID,
        });
      });
    });
  });

  /*
   * scenarios
   * - table - default attributes
   * - table - change each individual attribute (number col, layout, autosize)
   * - cells - default attributes
   * - cells - change each individual attribute (colspan, rowspan, style, colorname, colwidth, class
   * - header - default attributes
   * - header - change each individual attribute colspan, rowspan, style, colorname, colwidth, class)
   */
  describe('convert to HTML', () => {
    const schema = makeSchema();

    describe('table node', () => {
      it('should convert default table', () => {
        const table = schema.nodes.table.create();
        expect(toHTML(table, schema)).toEqual(
          '<table data-number-column="false" data-layout="default" data-autosize="false" data-table-local-id=""><tbody></tbody></table>',
        );
      });

      it('should convert table with layout attribute', () => {
        const attrs = { layout: 'full-width' } as TableAttributes;
        const table = schema.nodes.table.create(attrs);
        expect(toHTML(table, schema)).toEqual(
          '<table data-number-column="false" data-layout="full-width" data-autosize="false" data-table-local-id=""><tbody></tbody></table>',
        );
      });

      it('should convert table with isNumberColumnEnabled attribute', () => {
        const attrs = { isNumberColumnEnabled: true } as TableAttributes;
        const table = schema.nodes.table.create(attrs);
        expect(toHTML(table, schema)).toEqual(
          '<table data-number-column="true" data-layout="default" data-autosize="false" data-table-local-id=""><tbody></tbody></table>',
        );
      });

      it('should convert table with __autoSize attribute', () => {
        const attrs = { __autoSize: true } as TableAttributes;
        const table = schema.nodes.table.create(attrs);
        expect(toHTML(table, schema)).toEqual(
          '<table data-number-column="false" data-layout="default" data-autosize="true" data-table-local-id=""><tbody></tbody></table>',
        );
      });
    });

    describe('cell node', () => {
      it('should convert default cell', () => {
        const cell = schema.nodes.tableCell.create();
        expect(toHTML(cell, schema)).toEqual(
          '<td class="pm-table-cell-content-wrap"></td>',
        );
      });
      it('should convert default cell with colspan attribute', () => {
        const attrs = { colspan: 2 } as CellAttributes;
        const cell = schema.nodes.tableCell.create(attrs);
        expect(toHTML(cell, schema)).toEqual(
          '<td colspan="2" class="pm-table-cell-content-wrap"></td>',
        );
      });
      it('should convert default cell with rowspan attribute', () => {
        const attrs = { rowspan: 2 } as CellAttributes;
        const cell = schema.nodes.tableCell.create(attrs);
        expect(toHTML(cell, schema)).toEqual(
          '<td rowspan="2" class="pm-table-cell-content-wrap"></td>',
        );
      });
      it('should convert default cell with colwidth attribute', () => {
        const attrs = { colwidth: [200, 300] } as CellAttributes;
        const cell = schema.nodes.tableCell.create(attrs);
        expect(toHTML(cell, schema)).toEqual(
          '<td data-colwidth="200,300" class="pm-table-cell-content-wrap"></td>',
        );
      });
      it('should convert default cell with background attribute', () => {
        const attrs = { background: '#ff0000' } as CellAttributes;
        const cell = schema.nodes.tableCell.create(attrs);
        expect(toHTML(cell, schema)).toEqual(
          '<td style="background-color: #ff0000;" class="pm-table-cell-content-wrap"></td>',
        );
      });
    });

    describe('header node', () => {
      it('should convert default header', () => {
        const header = schema.nodes.tableHeader.create();
        expect(toHTML(header, schema)).toEqual(
          '<th class="pm-table-header-content-wrap"></th>',
        );
      });
      it('should convert default header with colspan attribute', () => {
        const attrs = { colspan: 2 } as CellAttributes;
        const cell = schema.nodes.tableHeader.create(attrs);
        expect(toHTML(cell, schema)).toEqual(
          '<th colspan="2" class="pm-table-header-content-wrap"></th>',
        );
      });
      it('should convert default header with rowspan attribute', () => {
        const attrs = { rowspan: 2 } as CellAttributes;
        const cell = schema.nodes.tableHeader.create(attrs);
        expect(toHTML(cell, schema)).toEqual(
          '<th rowspan="2" class="pm-table-header-content-wrap"></th>',
        );
      });
      it('should convert default header with colwidth attribute', () => {
        const attrs = { colwidth: [200, 300] } as CellAttributes;
        const cell = schema.nodes.tableHeader.create(attrs);
        expect(toHTML(cell, schema)).toEqual(
          '<th data-colwidth="200,300" class="pm-table-header-content-wrap"></th>',
        );
      });
      it('should convert default header with background attribute', () => {
        const attrs = { background: '#ff0000' } as CellAttributes;
        const cell = schema.nodes.tableHeader.create(attrs);
        expect(toHTML(cell, schema)).toEqual(
          '<th style="background-color: #ff0000;" class="pm-table-header-content-wrap"></th>',
        );
      });
    });

    describe('row node', () => {
      it('should convert table row', () => {
        const row = schema.nodes.tableRow.create();
        expect(toHTML(row, schema)).toEqual('<tr></tr>');
      });
    });
  });
});
