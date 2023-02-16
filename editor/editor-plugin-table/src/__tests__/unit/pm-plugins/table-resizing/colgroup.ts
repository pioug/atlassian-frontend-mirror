import { p, table, tr, td } from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { isMinCellWidthTable } from '../../../../plugins/table/pm-plugins/table-resizing/utils/colgroup';
import { generateColgroup } from '../../../../plugins/table/pm-plugins/table-resizing/utils';

describe('table-resizing/colgroup', () => {
  describe('#generateColgroup', () => {
    describe('creates col with correct widths ', () => {
      it('based on colwidth cell attributes', () => {
        const result = generateColgroup(
          getTable([
            {
              colwidth: [10],
              colspan: 1,
            },
            {
              colwidth: [20],
              colspan: 1,
            },
          ]),
        );

        expect(result).toEqual([
          ['col', { style: 'width: 10px;' }],
          ['col', { style: 'width: 20px;' }],
        ]);
      });

      it('when colwidth is not an array', () => {
        const result = generateColgroup(
          getTable([
            {
              colwidth: 10,
              colspan: 1,
            },
            {
              colwidth: null,
              colspan: 1,
            },
            {
              colwidth: undefined,
              colspan: 1,
            },
          ]),
        );

        expect(result).toEqual([
          ['col', {}],
          ['col', {}],
          ['col', {}],
        ]);
      });

      it('when colwidth has falsy values', () => {
        const result = generateColgroup(
          getTable([
            {
              colwidth: [0],
              colspan: 1,
            },
            {
              colwidth: [null],
              colspan: 1,
            },
            {
              colwidth: [undefined],
              colspan: 1,
            },
          ]),
        );
        expect(result).toEqual([
          ['col', {}],
          ['col', {}],
          ['col', {}],
        ]);
      });

      function getTable(cellAttributes: { [key: string]: any }[]) {
        return table({
          isNumberColumnEnabled: true,
        })(tr(...cellAttributes.map((attrs) => td(attrs)(p('text')))))(
          defaultSchema,
        );
      }
    });
  });

  //isMinCellWidthTable function test
  describe('#isMinCellWidthTable', () => {
    describe('check if a table has all the columns with minimum width', () => {
      it('when input table has all columns in minimum width', () => {
        const result = isMinCellWidthTable(getMinCellWidthTable());

        expect(result).toEqual(true);
      });

      it('when input table has a column that is not minimum width', () => {
        const result = isMinCellWidthTable(getNonMinCellWidthTable());

        expect(result).toEqual(false);
      });

      function getMinCellWidthTable() {
        return table()(
          tr(
            td({ colwidth: [48] })(p('')),
            td({ colwidth: [48] })(p('')),
            td({ colwidth: [48] })(p('')),
          ),
        )(defaultSchema);
      }

      function getNonMinCellWidthTable() {
        return table()(
          tr(
            td({ colwidth: [200] })(p('')),
            td({ colwidth: [200] })(p('')),
            td({ colwidth: [48] })(p('')),
          ),
        )(defaultSchema);
      }
    });
  });
});
