import React from 'react';

import { fireEvent, render } from '@testing-library/react';

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

  it('should cycle between aria-sort values when sorting by a column if isRankable is false', () => {
    const { getByRole } = render(
      <DynamicTable caption={caption} head={head} rows={rows} />,
    );

    const header = getByRole('columnheader');

    expect(header).not.toHaveAttribute('aria-sort');

    fireEvent.click(header);
    expect(header).toHaveAttribute('aria-sort', 'ascending');

    fireEvent.click(header);
    expect(header).toHaveAttribute('aria-sort', 'descending');

    fireEvent.click(header);
    // Because not `isRankable`, cycles back to ascending sort
    expect(header).toHaveAttribute('aria-sort', 'ascending');
  });

  it('should cycle back to no aria-sort attribute after "descending" sort order if isRankable is true', () => {
    const { getByRole } = render(
      <DynamicTable caption={caption} head={head} rows={rows} isRankable />,
    );

    // I have to get the header repeatedly because they are being recreated
    // when the sorting changes
    const headerNoSort = getByRole('columnheader');
    expect(headerNoSort).not.toHaveAttribute('aria-sort');

    fireEvent.click(headerNoSort);
    const headerSortAsc = getByRole('columnheader');
    expect(headerSortAsc).toHaveAttribute('aria-sort', 'ascending');

    fireEvent.click(headerSortAsc);
    const headerSortDesc = getByRole('columnheader');
    expect(headerSortDesc).toHaveAttribute('aria-sort', 'descending');

    fireEvent.click(headerSortDesc);
    // Because `isRankable` is true, cycles back to no aria-sort value
    expect(getByRole('columnheader')).not.toHaveAttribute('aria-sort');
  });
});
