import React from 'react';
import { mount } from 'enzyme';
import { SortOrder } from '@atlaskit/editor-common';
import {
  akEditorTableNumberColumnWidth,
  akEditorDefaultLayoutWidth,
  akEditorTableLegacyCellMinWidth as tableCellMinWidth,
} from '@atlaskit/editor-shared-styles';
import { defaultSchema as schema } from '@atlaskit/adf-schema';
import { table, tr, th, td, p, inlineCard } from '@atlaskit/adf-utils';
import Table, { TableProcessor } from '../../../../react/nodes/table';
import { calcScalePercent } from '../../../../react/nodes/table/colgroup';
import { TableCell, TableHeader } from '../../../../react/nodes/tableCell';
import TableRow from '../../../../react/nodes/tableRow';
import { Context as SmartCardStorageContext } from '../../../../ui/SmartCardStorage';

describe('Renderer - React/Nodes/Table', () => {
  const renderWidth = akEditorDefaultLayoutWidth;

  it('should render table DOM with all attributes', () => {
    const table = mount(
      <Table
        layout="full-width"
        isNumberColumnEnabled={true}
        renderWidth={renderWidth}
      >
        <TableRow>
          <TableCell />
        </TableRow>
      </Table>,
    );
    expect(table.find('table')).toHaveLength(1);
    expect(table.find('div[data-layout="full-width"]')).toHaveLength(1);
    expect(table.find('table').prop('data-number-column')).toEqual(true);
  });

  it('should render table props', () => {
    const columnWidths = [100, 110, 120];

    const table = mount(
      <Table
        layout="default"
        isNumberColumnEnabled={true}
        columnWidths={columnWidths}
        renderWidth={renderWidth}
      >
        <TableRow>
          <TableCell />
        </TableRow>
      </Table>,
    );

    expect(table.prop('layout')).toEqual('default');
    expect(table.prop('isNumberColumnEnabled')).toEqual(true);
    expect(table.prop('columnWidths')).toEqual(columnWidths);
    expect(table.find(TableRow).prop('isNumberColumnEnabled')).toEqual(true);
  });

  it('should NOT render a colgroup when columnWidths is an empty array', () => {
    const columnWidths: Array<number> = [];

    const table = mount(
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
        </TableRow>
      </Table>,
    );

    expect(table.find('colgroup')).toHaveLength(0);
  });

  it('should NOT render a colgroup when columnWidths is an array of zeros', () => {
    const columnWidths: Array<number> = [0, 0, 0];

    const table = mount(
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
        </TableRow>
      </Table>,
    );

    expect(table.find('colgroup')).toHaveLength(0);
  });

  it('should render children', () => {
    const table = mount(
      <Table
        layout="default"
        isNumberColumnEnabled={true}
        renderWidth={renderWidth}
      >
        <TableRow>
          <TableCell />
          <TableCell />
        </TableRow>
      </Table>,
    );

    expect(table.prop('layout')).toEqual('default');
    expect(table.prop('isNumberColumnEnabled')).toEqual(true);
    expect(table.find(TableRow)).toHaveLength(1);
    expect(table.find(TableCell)).toHaveLength(2);
  });

  describe('When number column is enabled', () => {
    describe('When header row is enabled', () => {
      it('should start numbers from the second row', () => {
        const table = mount(
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
        const table = mount(
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
      const table = mount(
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
      const table = mount(
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

        const table = mount(
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

        const table = mount(
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

  describe('when renderWidth is 10% lower than table width', () => {
    it('should scale down columns widths by 10%', () => {
      const columnWidths = [200, 200, 280];

      const table = mount(
        <Table
          layout="default"
          isNumberColumnEnabled={false}
          columnWidths={columnWidths}
          renderWidth={612}
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

      expect(table.find('col')).toHaveLength(3);
      table.find('col').forEach((col, index) => {
        const width = columnWidths[index] - columnWidths[index] * 0.1;
        expect(col.prop('style')!.width).toEqual(`${width}px`);
      });
    });
  });

  describe('when renderWidth is 20% lower than table width', () => {
    it('should scale down columns widths by 15% and then overflow', () => {
      const columnWidths = [200, 200, 280];

      const table = mount(
        <Table
          layout="default"
          isNumberColumnEnabled={false}
          columnWidths={columnWidths}
          renderWidth={578}
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

      expect(table.find('col')).toHaveLength(3);
      table.find('col').forEach((col, index) => {
        const width = columnWidths[index] - columnWidths[index] * 0.15;
        expect(col.prop('style')!.width).toEqual(`${width}px`);
      });
    });
  });

  describe('tables created when dynamic text sizing is enabled', () => {
    it('should scale down columns widths that were created at a large breakpoint.', () => {
      const columnWidths = [81, 425, 253];

      const table = mount(
        <Table
          layout="default"
          isNumberColumnEnabled={false}
          columnWidths={columnWidths}
          allowDynamicTextSizing={true}
          renderWidth={847}
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

      expect(table.find('col')).toHaveLength(3);
      // Render width is 680 here since the layout is default, we use that over the actual render width for calculations.
      const scale = calcScalePercent({
        renderWidth: 680,
        tableWidth: 759,
        maxScale: 0.15,
      });
      table.find('col').forEach((col, index) => {
        const width = Math.floor(
          columnWidths[index] - columnWidths[index] * scale,
        );
        expect(col.prop('style')!.width).toEqual(`${width}px`);
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

      const wrap = mount(
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

        const wrap = mount(
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

        const wrap = mount(
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
        const wrap = mount(
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

          const wrap = mount(
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
    const tableDoc = {
      ...table(
        tr([th()(p('Header')), th()(p('Header'))]),
        tr([td()(p('B')), td()(p('B'))]),
        tr([td()(p('C')), td()(p('C'))]),
        tr([td()(p('A')), td()(p('A'))]),
        tr([td()(p('D')), td()(p('D'))]),
      ),
      attrs: { isNumberColumnEnabled: false },
    };
    const FakeCellA = () => (
      <td>
        <p>A</p>
      </td>
    );
    const FakeCellB = () => (
      <td>
        <p>B</p>
      </td>
    );
    const FakeCellC = () => (
      <td>
        <p>C</p>
      </td>
    );
    const FakeCellD = () => (
      <td>
        <p>D</p>
      </td>
    );
    const tableFromSchema = schema.nodeFromJSON(tableDoc);

    const wrap = mount(
      <Table
        layout="default"
        renderWidth={renderWidth}
        allowColumnSorting={true}
        isNumberColumnEnabled={false}
        tableNode={tableFromSchema}
      >
        <TableRow>
          <TableHeader />
          <TableHeader />
        </TableRow>
        <TableRow>
          <FakeCellB />
          <FakeCellB />
        </TableRow>
        <TableRow>
          <FakeCellC />
          <FakeCellC />
        </TableRow>
        <TableRow>
          <FakeCellA />
          <FakeCellA />
        </TableRow>
        <TableRow>
          <FakeCellD />
          <FakeCellD />
        </TableRow>
      </Table>,
    );
    it('should sort table by column A to Z', () => {
      const tableRowProps = wrap.find(TableRow).first().props();
      tableRowProps.onSorting!(0, SortOrder.ASC);
      wrap.update();

      const firstCellFromSecondRow = wrap.find(TableRow).at(1).find('td').at(0);
      expect(firstCellFromSecondRow.text()).toEqual('A');
    });
    it('should sort table by column Z to A', () => {
      const tableRowProps = wrap.find(TableRow).first().props();
      tableRowProps.onSorting!(0, SortOrder.DESC);
      wrap.update();

      const firstCellFromSecondRow = wrap.find(TableRow).at(1).find('td').at(0);

      expect(firstCellFromSecondRow.text()).toEqual('D');
    });
    it('should clear table order', () => {
      const tableRowProps = wrap.find(TableRow).first().props();
      tableRowProps.onSorting!(0, SortOrder.NO_ORDER);
      wrap.update();

      const firstCellFromSecondRow = wrap.find(TableRow).at(1).find('td').at(0);

      expect(firstCellFromSecondRow.text()).toEqual('B');
    });
  });
});
