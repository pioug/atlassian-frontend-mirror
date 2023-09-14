import React from 'react';

import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { TableFooter, TableFooterProps } from './index';

const mockOnRefresh = jest.fn();

const renderFooter = (
  isLoading: TableFooterProps['isLoading'],
  itemCount: TableFooterProps['itemCount'],
  onRefresh: TableFooterProps['onRefresh'],
) => {
  return render(
    <IntlProvider locale="en">
      <TableFooter
        isLoading={isLoading}
        itemCount={itemCount}
        onRefresh={onRefresh}
      />
    </IntlProvider>,
  );
};

describe('TableFooter', () => {
  it('should show correct last sync time and item count if one is passed in and table is not loading', async () => {
    const { getByTestId } = renderFooter(false, 25, mockOnRefresh);
    const syncText = getByTestId('sync-text');
    const itemCount = getByTestId('item-count');
    expect(syncText).toHaveTextContent('Synced just now');
    expect(itemCount).toHaveTextContent('25 items');
  });

  it('should show correct text if item count is 1', async () => {
    const { getByTestId } = renderFooter(false, 1, mockOnRefresh);
    const syncText = getByTestId('sync-text');
    const itemCount = getByTestId('item-count');
    expect(syncText).toHaveTextContent('Synced just now');
    expect(itemCount).toHaveTextContent('1 item');
  });

  it('should show correct text if item count is a number large enough to contain commas', async () => {
    const { getByTestId } = renderFooter(false, 100123, mockOnRefresh);
    const syncText = getByTestId('sync-text');
    const itemCount = getByTestId('item-count');
    expect(syncText).toHaveTextContent('Synced just now');
    expect(itemCount).toHaveTextContent('100,123 items');
  });

  it('should hide item count if 0 and show Loading text if table is loading', async () => {
    const { getByTestId, queryByTestId } = renderFooter(true, 0, mockOnRefresh);
    const itemCount = queryByTestId('item-count');
    const syncText = getByTestId('sync-text');
    expect(syncText).toHaveTextContent('Loading...');
    expect(itemCount).not.toBeInTheDocument();
  });

  it('should show item count as 0 if item count is 0 and table is not loading', async () => {
    const { getByTestId } = renderFooter(false, 0, mockOnRefresh);
    const itemCount = getByTestId('item-count');
    const syncText = getByTestId('sync-text');
    expect(syncText).toHaveTextContent('Synced just now');
    expect(itemCount).toHaveTextContent('0 items');
  });

  it('should call onRefresh when refresh button is clicked', async () => {
    const { getByTestId } = renderFooter(false, 25, mockOnRefresh);
    const button = getByTestId('refresh-button');
    fireEvent.click(button);
    expect(mockOnRefresh).toBeCalledTimes(1);
  });

  it('should not show item count if not passed in', async () => {
    const { getByTestId, queryByTestId } = renderFooter(
      false,
      undefined,
      mockOnRefresh,
    );
    const itemCount = queryByTestId('item-count');
    expect(itemCount).not.toBeInTheDocument();

    const syncText = getByTestId('sync-text');
    const refreshButton = getByTestId('refresh-button');
    expect(syncText).toHaveTextContent('Synced just now');
    expect(refreshButton).toBeInTheDocument();
  });

  it('should not show refresh button or sync text if onRefresh() not passed in', async () => {
    const { queryByTestId, getByTestId } = renderFooter(false, 25, undefined);
    const itemCount = getByTestId('item-count');
    expect(itemCount).toHaveTextContent('25 items');

    const syncText = queryByTestId('sync-text');
    const refreshButton = queryByTestId('refresh-button');
    expect(syncText).not.toBeInTheDocument();
    expect(refreshButton).not.toBeInTheDocument();
  });

  it('should not show table footer at all if item count and onRefresh() are not passed in', async () => {
    const { queryByTestId } = renderFooter(false, undefined, undefined);
    const footer = queryByTestId('table-footer');
    expect(footer).not.toBeInTheDocument();
  });

  it('should render the footer without the count if the count passed is below 0', async () => {
    const { queryByTestId } = renderFooter(false, -1, mockOnRefresh);
    const footer = queryByTestId('table-footer');
    const itemCount = queryByTestId('item-count');

    expect(itemCount).not.toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });
});
