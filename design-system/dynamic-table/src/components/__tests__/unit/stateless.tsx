import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { StatelessProps } from '../../../types';
import { DynamicTableWithoutAnalytics as StatelessDynamicTable } from '../../stateless';

import { head, rowsWithKeys, secondSortKey, sortKey } from './_data';

const testId = 'dynamic--table--test--id';

const createProps: () => StatelessProps = () => ({
  head,
  rows: rowsWithKeys,
  sortKey,
  sortOrder: 'ASC',
  onSort: jest.fn(),
  onPageRowsUpdate: jest.fn(),
  testId,
});

test('onSort should change to ASC from DESC if table is not rankable', () => {
  const props = createProps();
  render(<StatelessDynamicTable {...props} sortOrder="DESC" />);

  const tableHeadCell = screen.getAllByTestId(`${testId}--head--cell`);
  fireEvent.click(tableHeadCell[0]);

  const item = { key: sortKey, content: 'First name', isSortable: true };

  expect(props.onSort).toHaveBeenCalledTimes(1);
  expect(props.onSort).toHaveBeenLastCalledWith({
    key: sortKey,
    item,
    sortOrder: 'ASC',
  });
});

test('onSort should change to none if table is rankable and sort order was DESC', () => {
  const props = createProps();
  render(<StatelessDynamicTable {...props} sortOrder="DESC" isRankable />);

  const tableHeadCell = screen.getAllByTestId(`${testId}--head--cell`);
  fireEvent.click(tableHeadCell[0]);

  const item = { key: sortKey, content: 'First name', isSortable: true };

  expect(props.onSort).toHaveBeenCalledTimes(1);
  expect(props.onSort).toHaveBeenLastCalledWith({
    key: null,
    item,
    sortOrder: null,
  });
});

test('onSort should change to DESC if table is rankable and sort order was ASC', () => {
  const props = createProps();
  render(<StatelessDynamicTable {...props} sortOrder="ASC" isRankable />);

  const tableHeadCell = screen.getAllByTestId(`${testId}--head--cell`);
  fireEvent.click(tableHeadCell[0]);

  const item = { key: sortKey, content: 'First name', isSortable: true };

  expect(props.onSort).toHaveBeenCalledTimes(1);
  expect(props.onSort).toHaveBeenLastCalledWith({
    key: sortKey,
    item,
    sortOrder: 'DESC',
  });
});

test('onSort should change to ASC if table is rankable and was sorted using on different row', () => {
  const props = createProps();
  render(
    <StatelessDynamicTable
      {...props}
      sortOrder="DESC"
      sortKey={secondSortKey}
      isRankable
    />,
  );

  const tableHeadCell = screen.getAllByTestId(`${testId}--head--cell`);
  fireEvent.click(tableHeadCell[0]);

  const item = { key: sortKey, content: 'First name', isSortable: true };

  expect(props.onSort).toHaveBeenCalledTimes(1);
  expect(props.onSort).toHaveBeenLastCalledWith({
    key: sortKey,
    item,
    sortOrder: 'ASC',
  });
});

test('onPageRowsUpdate should be called on mount and on sorting change', () => {
  const props = createProps();
  const { rerender } = render(<StatelessDynamicTable {...props} />);

  expect(props.onPageRowsUpdate).toHaveBeenCalledTimes(1);
  rerender(<StatelessDynamicTable {...props} sortOrder="DESC" />);
  expect(props.onPageRowsUpdate).toHaveBeenCalledTimes(2);
});

test('totalRows dictate number of pages in pagination', () => {
  const props = createProps();
  render(<StatelessDynamicTable {...props} totalRows={6} rowsPerPage={4} />);

  /**
   * 4 rows of data are present
   * total number of records indicated to be 6
   * Should create 2 pages
   */
  const paginationButtonPattern = new RegExp(
    `${testId}--pagination--(current-)?page-`,
  );
  const paginationButton = screen.getAllByTestId(paginationButtonPattern);
  expect(paginationButton).toHaveLength(2);
});

test('should work without totalRows being explicitly defined', () => {
  const props = createProps();
  render(<StatelessDynamicTable {...props} rowsPerPage={3} />);

  const paginationButtonPattern = new RegExp(
    `${testId}--pagination--(current-)?page-`,
  );
  const paginationButton = screen.getAllByTestId(paginationButtonPattern);
  expect(paginationButton).toHaveLength(2);
});

test('pagination should not show if only one page', () => {
  const props = createProps();
  render(<StatelessDynamicTable {...props} totalRows={6} rowsPerPage={10} />);

  const pagination = screen.queryByTestId(`${testId}--pagination`);
  expect(pagination).not.toBeInTheDocument();
});

test('pagination should move to first page when total number of pages is 1', () => {
  const props = createProps();
  const { rerender } = render(
    <StatelessDynamicTable
      {...props}
      rowsPerPage={3}
      page={2}
      testId="myTable"
    />,
  );

  expect(screen.getByText('Thomas')).toBeTruthy(); // only showing 4th one
  expect(screen.getAllByTestId(/^myTable--row-*/)).toHaveLength(1);

  rerender(
    <StatelessDynamicTable
      {...props}
      rowsPerPage={4}
      page={2}
      testId="myTable"
    />,
  );

  expect(screen.getByText('hillary')).toBeTruthy();
  expect(screen.getAllByTestId(/^myTable--row-*/)).toHaveLength(4); // but we're back on page 1, showing all rows
});

test('pagination should move to last page when selected page is greater than total pages', () => {
  const props = createProps();
  const { rerender, getAllByTestId, getByText } = render(
    <StatelessDynamicTable
      {...props}
      rowsPerPage={1}
      page={4}
      testId="myTable"
    />,
  );

  expect(getByText('Thomas')).toBeTruthy(); // only show 4th one
  expect(getAllByTestId(/^myTable--row-*/)).toHaveLength(1);

  rerender(
    <StatelessDynamicTable
      {...props}
      rowsPerPage={3}
      page={4}
      testId="myTable"
    />,
  );

  expect(getByText('Thomas')).toBeTruthy(); // only show 4th one
  expect(getAllByTestId(/^myTable--row-*/)).toHaveLength(1); // we're on the 2nd page
});
