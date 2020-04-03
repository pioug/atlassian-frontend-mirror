import React from 'react';
import { shallow, mount } from 'enzyme';
import { SortOrder } from '@atlaskit/editor-common';
import TableRow from '../../../../react/nodes/tableRow';

describe('Renderer - React/Nodes/TableRow', () => {
  const tableRow = shallow(<TableRow />);

  it('should create a <tr>-tag', () => {
    expect(tableRow.name()).toEqual('tr');
  });

  describe('with allowColumnSorting', () => {
    const FakeCell = () => (
      <th>
        <p>1</p>
      </th>
    );
    const onSorting = jest.fn();
    const tableOrderStatus = {
      columnIndex: 1,
      order: SortOrder.ASC,
    };

    it('should clone childrens and pass down the props', () => {
      const wrapper = mount(
        <TableRow
          onSorting={onSorting}
          tableOrderStatus={tableOrderStatus}
          allowColumnSorting={true}
        >
          <FakeCell />
          <FakeCell />
          <FakeCell />
        </TableRow>,
        { attachTo: document.createElement('tbody') },
      );

      wrapper.find(FakeCell).forEach((node, index) => {
        expect(node.prop('columnIndex')).toBe(index);
        expect(node.prop('onSorting')).toBe(onSorting);
      });
    });

    describe('#isHeaderRow', () => {
      it('should return true when rowIndex is 0', () => {
        const wrapper = mount(
          <TableRow
            onSorting={onSorting}
            tableOrderStatus={tableOrderStatus}
            allowColumnSorting={true}
            index={0}
          >
            <FakeCell />
            <FakeCell />
            <FakeCell />
          </TableRow>,
          { attachTo: document.createElement('tbody') },
        );

        wrapper.find(FakeCell).forEach((node, index) => {
          expect(node.prop('isHeaderRow')).toBeTruthy();
        });
      });

      it('should return true when rowIndex is empty', () => {
        const wrapper = mount(
          <TableRow
            onSorting={onSorting}
            tableOrderStatus={tableOrderStatus}
            allowColumnSorting={true}
          >
            <FakeCell />
            <FakeCell />
            <FakeCell />
          </TableRow>,
          { attachTo: document.createElement('tbody') },
        );

        wrapper.find(FakeCell).forEach((node, index) => {
          expect(node.prop('isHeaderRow')).toBeTruthy();
        });
      });

      it('should return false when rowIndex is greater than zero', () => {
        const wrapper = mount(
          <TableRow
            onSorting={onSorting}
            tableOrderStatus={tableOrderStatus}
            allowColumnSorting={true}
            index={1}
          >
            <FakeCell />
            <FakeCell />
            <FakeCell />
          </TableRow>,
          { attachTo: document.createElement('tbody') },
        );

        wrapper.find(FakeCell).forEach((node, index) => {
          expect(node.prop('isHeaderRow')).toBeFalsy();
        });
      });
    });

    describe('with tableOrderStatus', () => {
      it('should return the specific order status to the columnIndex set', () => {
        const wrapper = mount(
          <TableRow
            onSorting={onSorting}
            tableOrderStatus={tableOrderStatus}
            allowColumnSorting={true}
          >
            <FakeCell />
            <FakeCell />
            <FakeCell />
          </TableRow>,
          { attachTo: document.createElement('tbody') },
        );

        const child = wrapper.find(FakeCell).at(1);
        expect(child.prop('sortOrdered')).toBe(tableOrderStatus.order);
      });

      it('should return NO_ORDER for other columns', () => {
        const wrapper = mount(
          <TableRow
            onSorting={onSorting}
            tableOrderStatus={tableOrderStatus}
            allowColumnSorting={true}
          >
            <FakeCell />
            <FakeCell />
            <FakeCell />
          </TableRow>,
          { attachTo: document.createElement('tbody') },
        );

        const firstChild = wrapper.find(FakeCell).at(0);
        expect(firstChild.prop('sortOrdered')).toBe(SortOrder.NO_ORDER);

        const lastChild = wrapper.find(FakeCell).at(2);
        expect(lastChild.prop('sortOrdered')).toBe(SortOrder.NO_ORDER);
      });
    });
  });
});
