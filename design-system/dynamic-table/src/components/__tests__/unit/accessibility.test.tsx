import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import DynamicTable, {
  DynamicTableStateless as StatelessDynamicTable,
} from '../../../index';
import { StatelessProps } from '../../../types';
import LoadingContainer from '../../loading-container';
import { RankableTableCell } from '../../rankable/table-cell';

import {
  cellWithKey as cell,
  head,
  rows,
  rowsWithKeys,
  sortKey,
} from './_data';

describe('Dynamic Table Accessibility', () => {
  describe('Stateful table', () => {
    it('default stateful should pass basic aXe audit', async () => {
      const { container } = render(
        <DynamicTable
          rowsPerPage={2}
          defaultPage={2}
          head={head}
          rows={rows}
        />,
      );

      await axe(container);
    });

    it('stateful with pagination should pass basic aXe audit', async () => {
      const { container } = render(
        <DynamicTable
          rowsPerPage={2}
          defaultPage={2}
          head={head}
          rows={rows}
        />,
      );

      await axe(container);
    });
  });

  describe('Stateless table', () => {
    const createStatelessProps: () => StatelessProps = () => ({
      head,
      rows: rowsWithKeys,
      sortKey,
      sortOrder: 'ASC',
      onSort: jest.fn(),
      onPageRowsUpdate: jest.fn(),
    });

    it('default stateless should pass basic aXe audit', async () => {
      const props = createStatelessProps();
      const { container } = render(<StatelessDynamicTable {...props} />);

      await axe(container);
    });

    it('when changed from ASC to DESC, should pass basic aXe audit', async () => {
      const props = createStatelessProps();
      const { container } = render(
        <StatelessDynamicTable {...props} sortOrder="DESC" />,
      );

      const sortButtons = screen.getAllByRole('button');
      fireEvent.click(sortButtons[0]);

      await axe(container);
    });

    it('with pagination, should pass basic aXe audit', async () => {
      const props = createStatelessProps();
      const { container } = render(
        <StatelessDynamicTable {...props} totalRows={25} rowsPerPage={10} />,
      );

      await axe(container);
    });
  });

  describe('With Loading Container', () => {
    it('should pass basic aXe audit', async () => {
      const { container } = render(
        <LoadingContainer>
          <div>Contents</div>
        </LoadingContainer>,
      );

      await axe(container);
    });
  });

  describe('With Rankable Table Cell', () => {
    const createRankableProps = () => ({
      cell,
      head: head.cells[0],
      isRanking: false,
      innerRef: jest.fn(),
      refWidth: -1,
      refHeight: -1,
      isFixedSize: false,
    });

    it('should pass basic aXe audit', async () => {
      const props = createRankableProps();
      const testId = 'dynamic-table';
      const trKeyDownPropagation = jest.fn();
      const { container } = render(
        <table>
          <tbody>
            <tr data-testid={`${testId}--tr`} onKeyDown={trKeyDownPropagation}>
              <RankableTableCell testId={testId} {...props} />
            </tr>
          </tbody>
        </table>,
      );

      const cell = screen.getByTestId(`${testId}--rankable--table--body--cell`);
      fireEvent.keyDown(cell);

      await axe(container);
    });
  });
});
