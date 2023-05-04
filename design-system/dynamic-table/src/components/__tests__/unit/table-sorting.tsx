import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DynamicTable from '../../../index';

const caption = 'Example issue with DynamicTable';
const head = {
  cells: [
    {
      key: 'number',
      content: 'Number',
      isSortable: true,
    },
  ],
};
const headNotSortable = {
  cells: [
    {
      key: 'number',
      content: 'Number',
      isSortable: false,
    },
  ],
};

describe('Sorting', () => {
  const data = [1, 3, 2, 4];
  const rows = data.map((number: number) => ({
    key: number.toString(),
    cells: [
      {
        key: number,
        content: <div>{number}</div>,
      },
    ],
  }));

  it('should render a button in table head cell if column is sortable', () => {
    const { getByRole } = render(
      <DynamicTable caption={caption} head={head} rows={rows} />,
    );

    const sortableHeader = getByRole('columnheader');
    const sortableHeaderButton = getByRole('button');

    expect(sortableHeader).toContainElement(sortableHeaderButton);
  });

  it('should render a button with a role description for assistive technologies', () => {
    const { getByRole } = render(
      <DynamicTable caption={caption} head={head} rows={rows} />,
    );

    const sortableHeaderButton = getByRole('button');

    expect(sortableHeaderButton).toHaveAttribute('aria-roledescription');
  });

  it('should not render a button in table head cell if column is not sortable', () => {
    const { getByRole, queryByRole } = render(
      <DynamicTable caption={caption} head={headNotSortable} rows={rows} />,
    );

    const sortableHeader = getByRole('columnheader');
    const sortableHeaderButton = queryByRole('button');

    expect(sortableHeader).toBeInTheDocument();
    expect(sortableHeaderButton).toBeNull();
  });

  it('should cycle between aria-sort values when sorting by a column if isRankable is false', () => {
    const { getByRole } = render(
      <DynamicTable caption={caption} head={head} rows={rows} />,
    );

    const header = getByRole('columnheader');
    const sortButton = getByRole('button');

    expect(header).not.toHaveAttribute('aria-sort');

    fireEvent.click(sortButton);
    expect(header).toHaveAttribute('aria-sort', 'ascending');

    fireEvent.click(sortButton);
    expect(header).toHaveAttribute('aria-sort', 'descending');

    fireEvent.click(sortButton);
    // When `isRankable={false}`, cycles back to ascending sort
    expect(header).toHaveAttribute('aria-sort', 'ascending');
  });

  it('should cycle back to no aria-sort attribute after "descending" sort order if isRankable is true', () => {
    const { getByRole } = render(
      <DynamicTable caption={caption} head={head} rows={rows} isRankable />,
    );

    const header = getByRole('columnheader');
    const sortButton = getByRole('button');

    expect(header).not.toHaveAttribute('aria-sort');

    fireEvent.click(sortButton);
    expect(header).toHaveAttribute('aria-sort', 'ascending');

    fireEvent.click(sortButton);
    expect(header).toHaveAttribute('aria-sort', 'descending');

    fireEvent.click(sortButton);
    // Because `isRankable` is true, cycles back to no aria-sort value
    expect(header).not.toHaveAttribute('aria-sort');
  });

  it('should keep focus on sort button when using keyboard to cycle through all sorting states', async () => {
    const { getByRole } = render(
      <DynamicTable caption={caption} head={head} rows={rows} isRankable />,
    );

    const header = getByRole('columnheader');
    const sortButton = getByRole('button');
    expect(header).not.toHaveAttribute('aria-sort');
    sortButton.focus();

    await userEvent.type(sortButton, '{space}');
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(sortButton).toHaveFocus();

    await userEvent.type(sortButton, '{space}');
    expect(header).toHaveAttribute('aria-sort', 'descending');
    expect(sortButton).toHaveFocus();

    await userEvent.type(sortButton, '{space}');
    expect(header).not.toHaveAttribute('aria-sort');
    expect(sortButton).toHaveFocus();
  });
});
