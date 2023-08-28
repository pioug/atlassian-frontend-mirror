/** @jsx jsx */
import { useCallback, useEffect, useRef } from 'react';

import { jsx } from '@emotion/react';

import { useDatasourceTableState } from '../../hooks/useDatasourceTableState';
import { AccessRequired } from '../common/error-state/access-required';
import { LoadingError } from '../common/error-state/loading-error';
import { NoResults } from '../common/error-state/no-results';
import { IssueLikeDataTableView } from '../issue-like-table';
import EmptyState from '../issue-like-table/empty-state';
import { TableFooter } from '../table-footer';

import { DatasourceTableViewProps } from './types';

export const DatasourceTableView = ({
  datasourceId,
  parameters,
  visibleColumnKeys,
  onVisibleColumnKeysChange,
}: DatasourceTableViewProps) => {
  const {
    reset,
    status,
    onNextPage,
    responseItems,
    hasNextPage,
    columns,
    defaultVisibleColumnKeys,
    totalCount,
    loadDatasourceDetails,
  } = useDatasourceTableState({
    datasourceId,
    parameters,
    fieldKeys: visibleColumnKeys,
  });

  /*  Need this to make sure that the datasource in the editor gets updated new info if any edits are made in the modal
      But we don't want to call it on initial load. This screws up useDatasourceTableState's internal
      mechanism of initial loading. Use of ref here makes it basically work as a `componentDidUpdate` but not `componentDidMount`
   */
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (!isInitialRender.current) {
      reset();
    }
    isInitialRender.current = false;
  }, [reset, parameters]);

  useEffect(() => {
    if (
      onVisibleColumnKeysChange &&
      (visibleColumnKeys || []).length === 0 &&
      defaultVisibleColumnKeys.length > 0
    ) {
      onVisibleColumnKeysChange(defaultVisibleColumnKeys);
    }
  }, [visibleColumnKeys, defaultVisibleColumnKeys, onVisibleColumnKeysChange]);

  const forcedReset = useCallback(() => {
    reset({ shouldForceRequest: true });
  }, [reset]);

  if (status === 'resolved' && !responseItems.length) {
    return <NoResults onRefresh={reset} />;
  }

  if (status === 'unauthorized') {
    return <AccessRequired />;
  }

  if (status === 'rejected') {
    return <LoadingError onRefresh={reset} />;
  }

  const isDataReady = columns.length > 0;

  return (
    // datasource-table classname is to exclude all children from being commentable - exclude list is in CFE
    <div className="datasource-table">
      {isDataReady ? (
        <IssueLikeDataTableView
          testId={'datasource-table-view'}
          hasNextPage={hasNextPage}
          items={responseItems}
          onNextPage={onNextPage}
          onLoadDatasourceDetails={loadDatasourceDetails}
          status={status}
          columns={columns}
          visibleColumnKeys={visibleColumnKeys || defaultVisibleColumnKeys}
          onVisibleColumnKeysChange={onVisibleColumnKeysChange}
          scrollableContainerHeight={590}
        />
      ) : (
        <EmptyState
          testId="datasource-table-view-skeleton"
          isCompact
          isLoading={!isDataReady || status === 'loading'}
        />
      )}
      <TableFooter
        issueCount={isDataReady ? totalCount : undefined}
        onRefresh={forcedReset}
        isLoading={!isDataReady || status === 'loading'}
      />
    </div>
  );
};
