import { p, table, tr, td } from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
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
});
