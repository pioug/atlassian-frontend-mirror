import { useCallback, useEffect, useState } from 'react';

import { useDatasourceClientExtension } from '@atlaskit/link-client-extension';
import {
  DatasourceDataResponseItem,
  DatasourceResponseSchemaProperty,
  DatasourceTableStatusType,
} from '@atlaskit/linking-types';

export interface DatasourceTableState {
  status: DatasourceTableStatusType;
  onNextPage: () => void;
  // Resets state of the hook to be as if it is a first time it is being called.
  reset: () => void;
  responseItems: DatasourceDataResponseItem[];
  hasNextPage: boolean;
  columns: DatasourceResponseSchemaProperty[];
  defaultVisibleColumnKeys: string[];
  totalIssueCount?: number;
}

export const useDatasourceTableState = (
  datasourceId: string,
  parameters?: object,
  fields?: string[],
): DatasourceTableState => {
  const [defaultVisibleColumnKeys, setDefaultVisibleColumnKeys] = useState<
    DatasourceTableState['defaultVisibleColumnKeys']
  >([]);
  const [status, setStatus] = useState<DatasourceTableState['status']>('empty');
  const [responseItems, setResponseItems] = useState<
    DatasourceTableState['responseItems']
  >([]);
  const [hasNextPage, setHasNextPage] =
    useState<DatasourceTableState['hasNextPage']>(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [columns, setColumns] = useState<DatasourceTableState['columns']>([]);
  const [totalIssueCount, setTotalIssueCount] =
    useState<DatasourceTableState['totalIssueCount']>(undefined);

  const { getDatasourceData, getDatasourceDetails } =
    useDatasourceClientExtension();

  const loadDatasourceDetails = useCallback(
    async (parameters: object) => {
      const result = await getDatasourceDetails(datasourceId, { parameters });
      setColumns(result.schema.properties);
      setDefaultVisibleColumnKeys(result.schema.defaultProperties);
    },
    [datasourceId, getDatasourceDetails],
  );

  useEffect(() => {
    if (parameters) {
      void loadDatasourceDetails(parameters);
    }
  }, [loadDatasourceDetails, parameters]);

  const onNextPage = useCallback(async () => {
    if (!parameters) {
      return;
    }
    setStatus('loading');

    const { data, nextPageCursor, totalIssues } = await getDatasourceData(
      datasourceId,
      {
        parameters,
        pageSize: 10,
        pageCursor: nextCursor,
        fields,
      },
    );
    setTotalIssueCount(totalIssues);
    setNextCursor(nextPageCursor);

    setResponseItems(currentResponseItems => [
      ...currentResponseItems,
      ...data,
    ]);
    setStatus('resolved');
    setHasNextPage(Boolean(nextPageCursor));
  }, [parameters, getDatasourceData, datasourceId, nextCursor, fields]);

  const reset = useCallback(() => {
    setStatus('empty');
    setResponseItems([]);
    setHasNextPage(true);
    setNextCursor(undefined);
    setTotalIssueCount(undefined);
  }, []);

  return {
    status,
    onNextPage,
    responseItems,
    reset,
    hasNextPage,
    columns,
    defaultVisibleColumnKeys,
    totalIssueCount,
  };
};
