import React from 'react';
import {
  akEditorTableNumberColumnWidth,
  akEditorDefaultLayoutWidth,
  akEditorTableLegacyCellMinWidth as tableCellMinWidth,
} from '@atlaskit/editor-shared-styles';
import { TableLayout } from '@atlaskit/adf-schema';
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { inlineCard, p, table, td, th, tr } from '@atlaskit/adf-utils/builders';
import Table, { TableProcessor } from '../../../../react/nodes/table';
import { TableCell, TableHeader } from '../../../../react/nodes/tableCell';
import TableRow from '../../../../react/nodes/tableRow';
import { Context as SmartCardStorageContext } from '../../../../ui/SmartCardStorage';
import { SortOrder } from '@atlaskit/editor-common/types';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { shadowObserverClassNames } from '@atlaskit/editor-common/ui';

const mountBasicTable = ({
  columnWidths,
  isNumberColumnEnabled = true,
  renderWidth = akEditorDefaultLayoutWidth,
  layout = 'default',
}: {
  columnWidths?: number[];
  isNumberColumnEnabled?: boolean;
  renderWidth?: number;
  layout?: TableLayout;
} = {}) => {
  return mountWithIntl(
    <Table
      layout={layout}
      isNumberColumnEnabled={isNumberColumnEnabled}
      columnWidths={columnWidths}
      renderWidth={renderWidth}
    >
      <TableRow>
        <TableCell />
        <TableCell />
        <TableCell />
      </TableRow>
    </Table>,
  );
};

describe('Renderer - React/Nodes/Table', () => {
  const renderWidth = akEditorDefaultLayoutWidth;

  it('should render table DOM with all attributes', () => {
    const table = mountBasicTable({ renderWidth, layout: 'full-width' });
    expect(table.find('table')).toHaveLength(1);
    expect(table.find('div[data-layout="full-width"]')).toHaveLength(1);
    expect(table.find('table').prop('data-number-column')).toEqual(true);
  });

  it('should render table props', () => {
    const columnWidths = [100, 110, 120];
    const table = mountBasicTable({ columnWidths, renderWidth });
    expect(table.prop('layout')).toEqual('default');
    expect(table.prop('isNumberColumnEnabled')).toEqual(true);
    expect(table.prop('columnWidths')).toEqual(columnWidths);
    expect(table.find(TableRow).prop('isNumberColumnEnabled')).toEqual(true);
  });

  it('should NOT render a colgroup when columnWidths is an empty array', () => {
    const columnWidths: Array<number> = [];
    const table = mountBasicTable({ columnWidths, renderWidth });
    expect(table.find('colgroup')).toHaveLength(0);
  });

  it('should NOT render a colgroup when columnWidths is an array of zeros', () => {
    const table = mountBasicTable({ columnWidths: [0, 0, 0] });
    expect(table.find('colgroup')).toHaveLength(0);
  });

  it('should render children', () => {
    const table = mountBasicTable({ renderWidth });
    expect(table.prop('layout')).toEqual('default');
    expect(table.prop('isNumberColumnEnabled')).toEqual(true);
    expect(table.find(TableRow)).toHaveLength(1);
    expect(table.find(TableCell)).toHaveLength(3);
  });

  describe('When number column is enabled', () => {
    describe('When header row is enabled', () => {
      it('should start numbers from the second row', () => {
        const table = mountWithIntl(
          <Table
            layout="default"
            isNumberColumnEnabled={true}
            renderWidth={renderWidth}
          >
            <TableRow>
              <TableHeader />
              <TableHeader />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );

        table.find('tr').forEach((row, index) => {
          expect(row.find('td').at(0).text()).toEqual(
            index === 0 ? '' : `${index}`,
          );
        });
      });
    });
    describe('When header row is disabled', () => {
      it('should start numbers from the first row', () => {
        const table = mountWithIntl(
          <Table
            layout="default"
            isNumberColumnEnabled={true}
            renderWidth={renderWidth}
          >
            <TableRow>
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );

        table.find('tr').forEach((row, index) => {
          expect(row.find('td').at(0).text()).toEqual(`${index + 1}`);
        });
      });
    });
    it('should add an extra <col> node for number column', () => {
      const columnWidths = [300, 380];
      const resultingColumnWidths = [299, 379];
      const table = mountWithIntl(
        <Table
          layout="default"
          isNumberColumnEnabled={true}
          columnWidths={columnWidths}
          renderWidth={renderWidth}
        >
          <TableRow>
            <TableCell />
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell />
          </TableRow>
        </Table>,
      );
      expect(table.find('col')).toHaveLength(3);

      table.find('col').forEach((col, index) => {
        if (index === 0) {
          expect(col.prop('style')!.width).toEqual(
            akEditorTableNumberColumnWidth,
          );
        } else {
          expect(col.prop('style')!.width).toEqual(
            `${resultingColumnWidths[index - 1]}px`,
          );
        }
      });
    });
  });

  describe('When number column is disabled', () => {
    it('should not add an extra <col> node for number column', () => {
      const columnWidths = [300, 380];
      const table = mountWithIntl(
        <Table
          layout="default"
          isNumberColumnEnabled={false}
          columnWidths={columnWidths}
          renderWidth={renderWidth}
        >
          <TableRow>
            <TableCell />
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell />
          </TableRow>
        </Table>,
      );
      expect(table.find('col')).toHaveLength(2);

      table.find('col').forEach((col, index) => {
        expect(col.prop('style')!.width).toEqual(
          `${columnWidths[index] - 1}px`,
        );
      });
    });
  });

  describe('When multiple columns do not have width', () => {
    describe('when renderWidth is smaller than table minimum allowed width', () => {
      it('should add minWidth to zero width columns', () => {
        const columnWidths = [260, 260, 0, 0];

        const table = mountWithIntl(
          <Table
            layout="default"
            isNumberColumnEnabled={true}
            columnWidths={columnWidths}
            renderWidth={renderWidth}
          >
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );
        table.setProps({ isNumberColumnEnabled: false });

        expect(table.find('col')).toHaveLength(4);

        table.find('col').forEach((col, index) => {
          if (index < 2) {
            expect(col.prop('style')!.width).toEqual(
              `${columnWidths[index] - 1}px`,
            );
          } else {
            expect(col.prop('style')!.width).toEqual(`${tableCellMinWidth}px`);
          }
        });
      });
    });
    describe('when renderWidth is greater than table minimum allowed width', () => {
      it('should not add minWidth to zero width columns', () => {
        const columnWidths = [200, 200, 0, 0];

        const table = mountWithIntl(
          <Table
            layout="default"
            isNumberColumnEnabled={true}
            columnWidths={columnWidths}
            renderWidth={renderWidth}
          >
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );
        table.setProps({ isNumberColumnEnabled: false });

        expect(table.find('col')).toHaveLength(4);

        table.find('col').forEach((col, index) => {
          if (index < 2) {
            expect(col.prop('style')!.width).toEqual(
              `${columnWidths[index] - 1}px`,
            );
          } else {
            expect(typeof col.prop('style')!.width).toEqual('undefined');
          }
        });
      });
    });
  });

  describe('tables created when allowColumnSorting is enabled', () => {
    const tableDoc = {
      ...table(
        tr([
          th()(p('Header content 1')),
          th()(p('Header content 2')),
          th()(p('Header content 3')),
        ]),
        tr([
          td()(p('Body content 1')),
          td()(p('Body content 2')),
          td()(p('Body content 3')),
        ]),
      ),
      attrs: { isNumberColumnEnabled: true },
    };

    const tableDocWithMergedCell = {
      ...table(
        tr([
          th()(p('Header content 1')),
          th()(p('Header content 2')),
          th()(p('Header content 3')),
        ]),
        tr([
          td()(p('Body content 1')),
          td({ colspan: 2 })(p('Body content 2')),
        ]),
      ),
      attrs: { isNumberColumnEnabled: true },
    };

    it('should add sortable props to first table row', () => {
      const tableFromSchema = schema.nodeFromJSON(tableDoc);

      const wrap = mountWithIntl(
        <Table
          layout="default"
          renderWidth={renderWidth}
          allowColumnSorting={true}
          tableNode={tableFromSchema}
          isNumberColumnEnabled={false}
        >
          <TableRow>
            <TableHeader />
            <TableHeader />
            <TableHeader />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </Table>,
      );

      const container = wrap.find(TableProcessor).instance();

      container.setState({
        tableOrderStatus: { columnIndex: 0, sortOrdered: SortOrder.ASC },
      });
      wrap.update();

      const firstRowProps = wrap.find(TableRow).first().props();
      expect(firstRowProps.tableOrderStatus).toEqual({
        columnIndex: 0,
        sortOrdered: SortOrder.ASC,
      });
      expect(typeof firstRowProps.onSorting).toBe('function');
    });

    describe('when header row is not enabled', () => {
      it('should not add sortable props to the first table row', () => {
        const tableFromSchema = schema.nodeFromJSON(tableDoc);

        const wrap = mountWithIntl(
          <Table
            layout="default"
            renderWidth={renderWidth}
            allowColumnSorting={true}
            tableNode={tableFromSchema}
            isNumberColumnEnabled={false}
          >
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );

        const container = wrap.find(TableProcessor).instance();

        container.setState({
          tableOrderStatus: { columnIndex: 0, sortOrdered: SortOrder.ASC },
        });
        wrap.update();

        const firstRowProps = wrap.find(TableRow).first().props();
        expect(firstRowProps.tableOrderStatus).toBeUndefined();
        expect(firstRowProps.onSorting).toBeUndefined();
      });
    });

    describe('when there is merged cell on table', () => {
      it('should not add sortable props to the first table row', () => {
        const tableFromSchema = schema.nodeFromJSON(tableDocWithMergedCell);

        const wrap = mountWithIntl(
          <Table
            layout="default"
            renderWidth={renderWidth}
            allowColumnSorting={true}
            tableNode={tableFromSchema}
            isNumberColumnEnabled={false}
          >
            <TableRow>
              <TableHeader />
              <TableHeader />
              <TableHeader />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );

        const container = wrap.find(TableProcessor).instance();

        container.setState({
          tableOrderStatus: { columnIndex: 0, sortOrdered: SortOrder.ASC },
        });
        wrap.update();

        const firstRowProps = wrap.find(TableRow).first().props();
        expect(firstRowProps.tableOrderStatus).toBeUndefined();
        expect(firstRowProps.onSorting).toBeUndefined();
      });
    });

    describe('when there is no tableNode', () => {
      it('should not add sortable props to the first table row', () => {
        const wrap = mountWithIntl(
          <Table
            layout="default"
            renderWidth={renderWidth}
            allowColumnSorting={true}
            isNumberColumnEnabled={false}
          >
            <TableRow>
              <TableHeader />
              <TableHeader />
              <TableHeader />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );

        const container = wrap.find(TableProcessor).instance();

        container.setState({
          tableOrderStatus: { columnIndex: 0, sortOrdered: SortOrder.ASC },
        });
        wrap.update();

        const firstRowProps = wrap.find(TableRow).first().props();
        expect(firstRowProps.tableOrderStatus).toBeUndefined();
        expect(firstRowProps.onSorting).toBeUndefined();
      });
    });

    describe('when table has inlineCards', () => {
      const atlassianUrl = 'http://atlassian.com';
      const bitbucketUrl = 'http://bitbucket.com';
      const trelloUrl = 'http://trello.com';

      const tableWithInlineCardsDoc = {
        ...table(
          tr([th()(p('Header content'))]),
          tr([
            td()(
              p(
                inlineCard({
                  url: trelloUrl,
                }),
              ),
            ),
          ]),
          tr([
            td()(
              p(
                inlineCard({
                  url: atlassianUrl,
                }),
              ),
            ),
          ]),
          tr([
            td()(
              p(
                inlineCard({
                  url: bitbucketUrl,
                }),
              ),
            ),
          ]),
        ),
        attrs: { isNumberColumnEnabled: true },
      };
      const TableRowWithOriginalPos: React.FunctionComponent<
        React.ComponentProps<typeof TableRow> & { originalIndex: number }
      > = ({ originalIndex, ...tableRowProps }) => {
        return <TableRow {...tableRowProps} />;
      };

      test.each<[Map<string, string>, number[]]>([
        [
          new Map([
            [trelloUrl, 'a'],
            [atlassianUrl, 'c'],
            [bitbucketUrl, 'b'],
          ]),
          [1, 2, 4, 3],
        ],
        [
          new Map([
            [trelloUrl, 'c'],
            [atlassianUrl, 'a'],
            [bitbucketUrl, 'b'],
          ]),
          [1, 3, 4, 2],
        ],
      ])(
        'should sort using %p to resolve inlineCard titles',
        (storage, expected) => {
          const tableFromSchema = schema.nodeFromJSON(tableWithInlineCardsDoc);

          const wrap = mountWithIntl(
            <SmartCardStorageContext.Provider value={storage}>
              <Table
                layout="default"
                renderWidth={renderWidth}
                allowColumnSorting={true}
                tableNode={tableFromSchema}
                isNumberColumnEnabled={false}
              >
                <TableRowWithOriginalPos originalIndex={1}>
                  <TableHeader />
                  <TableHeader />
                </TableRowWithOriginalPos>
                <TableRowWithOriginalPos originalIndex={2}>
                  <TableCell />
                </TableRowWithOriginalPos>
                <TableRowWithOriginalPos originalIndex={3}>
                  <TableCell />
                </TableRowWithOriginalPos>
                <TableRowWithOriginalPos originalIndex={4}>
                  <TableCell />
                </TableRowWithOriginalPos>
              </Table>
            </SmartCardStorageContext.Provider>,
          );
          const tableRowProps = wrap.find(TableRow).first().props();

          tableRowProps.onSorting!(0, SortOrder.ASC);

          wrap.update();

          const sortPosition = wrap
            .find(TableRowWithOriginalPos)
            .map(
              (tableRowWithOriginalPos) =>
                tableRowWithOriginalPos.props().originalIndex,
            );

          expect(sortPosition).toEqual(expected);
        },
      );
    });
  });

  describe('sort table by column', () => {
    const initialTableState = [
      ['Header', 'Header'],
      ['Bbb', 'A'],
      ['bBBB', 'B'],
      ['BBb', ' '],
      [' C', 'C'],
      ['1a', '@yolo'],
      ['a1', 'be@ns'],
      ['!c', 'A nEw world'],
      ['C', 'A nEw world!'],
    ];
    const getRows = () => {
      return initialTableState.map((row, index) => {
        if (index === 0) {
          const cells = row.map((val) => th()(p(val)));

          return tr(cells);
        }
        return tr(row.map((val) => td()(p(val))));
      });
    };
    const tableDoc = {
      ...table(...getRows()),
      attrs: { isNumberColumnEnabled: false },
    };
    const Cell = ({ text }: { text: string }) => (
      <td>
        <p>{text}</p>
      </td>
    );
    const tableFromSchema = schema.nodeFromJSON(tableDoc);
    const wrap = mountWithIntl(
      <Table
        layout="default"
        renderWidth={renderWidth}
        allowColumnSorting={true}
        isNumberColumnEnabled={false}
        tableNode={tableFromSchema}
      >
        {initialTableState.map((row, rowIndex) => {
          if (rowIndex === 0) {
            return (
              <TableRow key={rowIndex}>
                {row.map((_, headerIndex) => (
                  <TableHeader key={headerIndex} />
                ))}
              </TableRow>
            );
          }

          return (
            <TableRow key={rowIndex}>
              {row.map((cellVal, cellIndex) => (
                <Cell key={cellIndex} text={cellVal} />
              ))}
            </TableRow>
          );
        })}
      </Table>,
    );
    const expectTableOrder = (expectedValues: string[][]) => {
      for (let i = 0; i < expectedValues.length; i++) {
        for (let j = 0; j < expectedValues[0].length; j++) {
          const cell = wrap
            .find(TableRow)
            .at(i + 1)
            .find('td')
            .at(j);
          const actualValue = cell.text();
          const expectedValue = expectedValues[i][j];

          expect(actualValue).toEqual(expectedValue);
        }
      }
    };

    describe('when sorting on the first column', () => {
      it('should sort table by column A to Z', () => {
        const tableRowProps = wrap.find(TableRow).first().props();
        tableRowProps.onSorting!(0, SortOrder.ASC);
        wrap.update();

        const tableState = [
          [' C', 'C'],
          ['!c', 'A nEw world'],
          ['1a', '@yolo'],
          ['a1', 'be@ns'],
          ['BBb', ' '],
          ['Bbb', 'A'],
          ['bBBB', 'B'],
          ['C', 'A nEw world!'],
        ];

        expectTableOrder(tableState);
      });

      it('should sort table by column Z to A', () => {
        const tableRowProps = wrap.find(TableRow).first().props();
        tableRowProps.onSorting!(0, SortOrder.DESC);
        wrap.update();

        const tableState = [
          [' C', 'C'],
          ['!c', 'A nEw world'],
          ['1a', '@yolo'],
          ['a1', 'be@ns'],
          ['BBb', ' '],
          ['Bbb', 'A'],
          ['bBBB', 'B'],
          ['C', 'A nEw world!'],
        ].reverse();

        expectTableOrder(tableState);
      });

      it('should clear table order', () => {
        const tableRowProps = wrap.find(TableRow).first().props();
        tableRowProps.onSorting!(0, SortOrder.NO_ORDER);
        wrap.update();

        const tableState = [
          ['Bbb', 'A'],
          ['bBBB', 'B'],
          ['BBb', ' '],
          [' C', 'C'],
          ['1a', '@yolo'],
          ['a1', 'be@ns'],
          ['!c', 'A nEw world'],
          ['C', 'A nEw world!'],
        ];

        expectTableOrder(tableState);
      });
    });

    describe('when sorting on the second column', () => {
      it('should sort table by column A to Z', () => {
        const tableRowProps = wrap.find(TableRow).first().props();
        tableRowProps.onSorting!(1, SortOrder.ASC);
        wrap.update();

        const tableState = [
          ['BBb', ' '],
          ['1a', '@yolo'],
          ['Bbb', 'A'],
          ['!c', 'A nEw world'],
          ['C', 'A nEw world!'],
          ['bBBB', 'B'],
          ['a1', 'be@ns'],
          [' C', 'C'],
        ];

        expectTableOrder(tableState);
      });

      it('should sort table by column Z to A', () => {
        const tableRowProps = wrap.find(TableRow).first().props();
        tableRowProps.onSorting!(1, SortOrder.DESC);
        wrap.update();

        const tableState = [
          ['BBb', ' '],
          ['1a', '@yolo'],
          ['C', 'A nEw world!'],
          ['!c', 'A nEw world'],
          ['Bbb', 'A'],
          ['bBBB', 'B'],
          ['a1', 'be@ns'],
          [' C', 'C'],
        ].reverse();

        expectTableOrder(tableState);
      });

      it('should clear table order', () => {
        const tableRowProps = wrap.find(TableRow).first().props();
        tableRowProps.onSorting!(1, SortOrder.NO_ORDER);
        wrap.update();

        const tableState = [
          ['Bbb', 'A'],
          ['bBBB', 'B'],
          ['BBb', ' '],
          [' C', 'C'],
          ['1a', '@yolo'],
          ['a1', 'be@ns'],
          ['!c', 'A nEw world'],
          ['C', 'A nEw world!'],
        ];

        expectTableOrder(tableState);
      });
    });
  });

  describe('table with overflow shadows', () => {
    it('when columnWidths are not set, should not render shadows', () => {
      const table = mountBasicTable({ columnWidths: [0, 0, 0] });
      expect(
        table.html().includes(shadowObserverClassNames.SENTINEL_LEFT),
      ).toBeFalsy();
      expect(
        table.html().includes(shadowObserverClassNames.SENTINEL_RIGHT),
      ).toBeFalsy();
    });

    it('when columnWidths are set should render shadows', () => {
      const table = mountBasicTable({ columnWidths: [100, 100, 100] });
      expect(
        table.html().includes(shadowObserverClassNames.SENTINEL_LEFT),
      ).toBeTruthy();
      expect(
        table.html().includes(shadowObserverClassNames.SENTINEL_RIGHT),
      ).toBeTruthy();
    });
  });
});
