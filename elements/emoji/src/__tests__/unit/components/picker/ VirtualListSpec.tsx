import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import {
  VirtualList,
  virtualListScrollContainerTestId,
} from '../../../../components/picker/VirtualList';

const onRowsRendered = jest.fn();

const renderList = () => {
  return render(
    <VirtualList
      overscanRowCount={3}
      rowHeight={() => 40}
      rowRenderer={(virtualRow) => <div>{virtualRow.index}</div>}
      onRowsRendered={onRowsRendered}
      rowCount={40}
      scrollToAlignment={'start'}
      width={200}
      height={400}
    />,
  );
};

describe('VirtualList', () => {
  it('renders', async () => {
    const { container } = renderList();
    expect(container).toBeDefined();
  });

  it('renders the correct list when scrolled', async () => {
    const { container } = renderList();
    expect(container).toBeDefined();
    fireEvent.scroll(screen.getByTestId(virtualListScrollContainerTestId), {
      target: { scrollTop: 1000 },
    });
    await waitFor(() => {
      expect(screen.queryByText('22')).toBeInTheDocument();
      expect(onRowsRendered).toHaveBeenCalledTimes(1);
    });
  });
});
