import React, { ReactNode, useEffect } from 'react';

import { fireEvent, render } from '@testing-library/react';
import { v4 as uuid } from 'uuid';

import DynamicTable from '../../../index';

interface StatefulCellProps {
  children?: ReactNode;
}

const createStatefulCell = ({
  onMount,
  onUnmount,
}: {
  onMount: () => void;
  onUnmount: () => void;
}) => (props: StatefulCellProps) => {
  useEffect(() => {
    onMount();
    return () => onUnmount();
  }, []);

  return <div>{props.children}</div>;
};

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

describe('TableBody', () => {
  const data = [1, 3, 2, 4];

  it('Using uuid as key to avoid re-rendering', () => {
    const onMount = jest.fn();
    const onUnmount = jest.fn();

    const Cell = createStatefulCell({ onMount, onUnmount });
    const rows = data.map((number: number) => ({
      key: uuid(),
      cells: [
        {
          key: number,
          content: <Cell>{number}</Cell>,
        },
      ],
    }));

    const { getByTestId } = render(
      <DynamicTable
        caption={caption}
        head={head}
        rows={rows}
        rowsPerPage={10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={false}
        isFixedSize
        defaultSortKey="number"
        defaultSortOrder="ASC"
        testId="dynamic-table"
      />,
    );

    fireEvent.click(getByTestId('dynamic-table--head--cell'));

    expect(onMount.mock.calls.length).toBe(data.length);
    expect(onUnmount.mock.calls.length).toBe(0);
  });
});
