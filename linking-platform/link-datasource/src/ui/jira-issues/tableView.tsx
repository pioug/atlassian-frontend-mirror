/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/react';

import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import { useDatasourceTableState } from '../../hooks/useDatasourceTableState';
import { IssueLikeDataTableView } from '../issue-like-table';

import { TableFooter } from './table-footer';
import { JiraIssuesTableViewProps } from './types';

const TableViewWrapperStyles = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  position: 'relative',
  padding: token('space.200', '16px'),
  paddingBottom: 0,
  boxSizing: 'border-box',
});

export const JiraIssuesTableView = ({
  datasourceId,
  parameters,
  visibleColumnKeys,
  onVisibleColumnKeysChange,
}: JiraIssuesTableViewProps) => {
  const {
    reset,
    status,
    onNextPage,
    responseItems,
    hasNextPage,
    columns,
    defaultVisibleColumnKeys,
    totalIssueCount,
  } = useDatasourceTableState(datasourceId, parameters);

  useEffect(() => {
    if (
      onVisibleColumnKeysChange &&
      (visibleColumnKeys || []).length === 0 &&
      defaultVisibleColumnKeys.length > 0
    ) {
      onVisibleColumnKeysChange(defaultVisibleColumnKeys);
    }
  }, [visibleColumnKeys, defaultVisibleColumnKeys, onVisibleColumnKeysChange]);

  return columns.length > 0 ? (
    <div css={TableViewWrapperStyles}>
      <IssueLikeDataTableView
        testId={'jira-issues-table-view'}
        hasNextPage={hasNextPage}
        items={responseItems}
        onNextPage={onNextPage}
        status={status}
        columns={columns}
        visibleColumnKeys={visibleColumnKeys || defaultVisibleColumnKeys}
        onVisibleColumnKeysChange={onVisibleColumnKeysChange}
      />
      <TableFooter
        issueCount={totalIssueCount}
        onRefresh={reset}
        isLoading={status === 'loading'}
      />
    </div>
  ) : (
    <Spinner testId={'jira-issues-table-view-spinner'} />
  );
};
