/** @jsx jsx */
import { useEffect, useMemo } from 'react';

import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import { useDatasourceTableState } from '../src/hooks/useDatasourceTableState';
import { IssueLikeDataTableView } from '../src/ui/issue-like-table';
import { JiraIssueDatasourceParameters } from '../src/ui/jira-issues-modal/types';

import SmartLinkClient from './smartLinkCustomClient';
import { useCommonTableProps } from './useCommonTableProps';

mockDatasourceFetchRequests();

interface Props {
  isReadonly?: boolean;
  canResizeColumns?: boolean;
  canControlWrapping?: boolean;
}

const TableViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  height: 100%;
`;

const ExampleBody = ({
  isReadonly,
  canResizeColumns = true,
  canControlWrapping = true,
}: Props) => {
  const parameters = useMemo<JiraIssueDatasourceParameters>(
    () => ({
      cloudId: 'some-cloud-id',
      jql: 'some-jql',
    }),
    [],
  );

  const {
    status,
    onNextPage,
    responseItems,
    hasNextPage,
    defaultVisibleColumnKeys,
    columns,
    loadDatasourceDetails,
  } = useDatasourceTableState({
    datasourceId: 'some-datasource-id',
    parameters,
  });

  const {
    visibleColumnKeys,
    onVisibleColumnKeysChange,
    columnCustomSizes,
    onColumnResize,
    wrappedColumnKeys,
    onWrappedColumnChange,
  } = useCommonTableProps();

  useEffect(() => {
    if (visibleColumnKeys.length === 0 && defaultVisibleColumnKeys.length > 0) {
      onVisibleColumnKeysChange(defaultVisibleColumnKeys);
    }
  }, [visibleColumnKeys, defaultVisibleColumnKeys, onVisibleColumnKeysChange]);

  return (
    <TableViewWrapper>
      {visibleColumnKeys.length > 0 && columns.length > 0 ? (
        <IssueLikeDataTableView
          testId="link-datasource"
          items={responseItems}
          onNextPage={onNextPage}
          onLoadDatasourceDetails={loadDatasourceDetails}
          hasNextPage={hasNextPage}
          status={status}
          columns={columns}
          visibleColumnKeys={visibleColumnKeys}
          onVisibleColumnKeysChange={
            isReadonly ? undefined : onVisibleColumnKeysChange
          }
          onColumnResize={
            isReadonly || !canResizeColumns ? undefined : onColumnResize
          }
          columnCustomSizes={columnCustomSizes}
          onWrappedColumnChange={
            canControlWrapping ? onWrappedColumnChange : undefined
          }
          wrappedColumnKeys={wrappedColumnKeys}
        />
      ) : (
        <span>Loading ...</span>
      )}
    </TableViewWrapper>
  );
};

export const ExampleIssueLikeTable = ({
  isReadonly,
  canResizeColumns,
  canControlWrapping,
}: Props) => {
  return (
    <IntlProvider locale="en">
      <SmartCardProvider client={new SmartLinkClient()}>
        <ExampleBody
          isReadonly={isReadonly}
          canResizeColumns={canResizeColumns}
          canControlWrapping={canControlWrapping}
        />
      </SmartCardProvider>
    </IntlProvider>
  );
};
