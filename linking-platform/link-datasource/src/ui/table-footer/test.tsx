import React from 'react';

import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { TableFooter, TableFooterProps } from './index';

const mockOnRefresh = jest.fn();

const renderFooter = (
  isLoading: TableFooterProps['isLoading'],
  issueCount: TableFooterProps['issueCount'],
  onRefresh: TableFooterProps['onRefresh'],
) => {
  return render(
    <IntlProvider locale="en">
      <TableFooter
        isLoading={isLoading}
        issueCount={issueCount}
        onRefresh={onRefresh}
      />
    </IntlProvider>,
  );
};

describe('TableFooter', () => {
  it('should show correct last sync time and issue count if one is passed in and table is not loading', async () => {
    const { getByTestId } = renderFooter(false, 25, mockOnRefresh);
    const syncText = getByTestId('sync-text');
    const issueCount = getByTestId('issue-count');
    expect(syncText).toHaveTextContent('Synced just now');
    expect(issueCount).toHaveTextContent('25 issues');
  });

  it('should show correct text if issue count is 1', async () => {
    const { getByTestId } = renderFooter(false, 1, mockOnRefresh);
    const syncText = getByTestId('sync-text');
    const issueCount = getByTestId('issue-count');
    expect(syncText).toHaveTextContent('Synced just now');
    expect(issueCount).toHaveTextContent('1 issue');
  });

  it('should show correct text if issue count is a number large enough to contain commas', async () => {
    const { getByTestId } = renderFooter(false, 100123, mockOnRefresh);
    const syncText = getByTestId('sync-text');
    const issueCount = getByTestId('issue-count');
    expect(syncText).toHaveTextContent('Synced just now');
    expect(issueCount).toHaveTextContent('100,123 issues');
  });

  it('should hide issue count if 0 and show Loading text if table is loading', async () => {
    const { getByTestId, queryByTestId } = renderFooter(true, 0, mockOnRefresh);
    const issueCount = queryByTestId('issue-count');
    const syncText = getByTestId('sync-text');
    expect(syncText).toHaveTextContent('Loading...');
    expect(issueCount).not.toBeInTheDocument();
  });

  it('should show issue count as 0 if issue count is 0 and table is not loading', async () => {
    const { getByTestId } = renderFooter(false, 0, mockOnRefresh);
    const issueCount = getByTestId('issue-count');
    const syncText = getByTestId('sync-text');
    expect(syncText).toHaveTextContent('Synced just now');
    expect(issueCount).toHaveTextContent('0 issues');
  });

  it('should call onRefresh when refresh button is clicked', async () => {
    const { getByTestId } = renderFooter(false, 25, mockOnRefresh);
    const button = getByTestId('refresh-button');
    fireEvent.click(button);
    expect(mockOnRefresh).toBeCalledTimes(1);
  });

  it('should not show issue count if not passed in', async () => {
    const { getByTestId, queryByTestId } = renderFooter(
      false,
      undefined,
      mockOnRefresh,
    );
    const issueCount = queryByTestId('issue-count');
    expect(issueCount).not.toBeInTheDocument();

    const syncText = getByTestId('sync-text');
    const refreshButton = getByTestId('refresh-button');
    expect(syncText).toHaveTextContent('Synced just now');
    expect(refreshButton).toBeInTheDocument();
  });

  it('should not show refresh button or sync text if onRefresh() not passed in', async () => {
    const { queryByTestId, getByTestId } = renderFooter(false, 25, undefined);
    const issueCount = getByTestId('issue-count');
    expect(issueCount).toHaveTextContent('25 issues');

    const syncText = queryByTestId('sync-text');
    const refreshButton = queryByTestId('refresh-button');
    expect(syncText).not.toBeInTheDocument();
    expect(refreshButton).not.toBeInTheDocument();
  });

  it('should not show table footer at all if issue count and onRefresh() are not passed in', async () => {
    const { queryByTestId } = renderFooter(false, undefined, undefined);
    const footer = queryByTestId('table-footer');
    expect(footer).not.toBeInTheDocument();
  });

  it('should render the footer without the count if the count passed is below 0', async () => {
    const { queryByTestId } = renderFooter(false, -1, mockOnRefresh);
    const footer = queryByTestId('table-footer');
    const issueCount = queryByTestId('issue-count');

    expect(issueCount).not.toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });
});
