/** @jsx jsx */
import { useEffect, useMemo, useState } from 'react';

import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import {
  defaultInitialVisibleColumnKeys,
  mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';

import { useDatasourceTableState } from '../src/hooks/useDatasourceTableState';
import { IssueLikeDataTableView } from '../src/ui/issue-like-table';
import { JiraIssueDatasourceParameters } from '../src/ui/jira-issues-modal/types';

import SmartLinkClient from './smartLinkCustomClient';

mockDatasourceFetchRequests();

interface Props {
  isReadonly?: boolean;
}

const TableViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  height: 100%;
`;

const ExampleBody = ({ isReadonly }: Props) => {
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

  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    defaultInitialVisibleColumnKeys,
  );

  useEffect(() => {
    if (visibleColumnKeys.length === 0 && defaultVisibleColumnKeys.length > 0) {
      setVisibleColumnKeys(defaultVisibleColumnKeys);
    }
  }, [visibleColumnKeys, defaultVisibleColumnKeys, setVisibleColumnKeys]);

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
            isReadonly ? undefined : setVisibleColumnKeys
          }
        />
      ) : (
        <span>Loading ...</span>
      )}
    </TableViewWrapper>
  );
};

export const ExampleIssueLikeTable = ({ isReadonly }: Props) => {
  return (
    <IntlProvider locale="en">
      <SmartCardProvider client={new SmartLinkClient()}>
        <ExampleBody isReadonly={isReadonly} />
      </SmartCardProvider>
    </IntlProvider>
  );
};
