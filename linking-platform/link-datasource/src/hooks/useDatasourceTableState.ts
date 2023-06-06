import { useCallback, useEffect, useState } from 'react';

import { useDatasourceClientExtension } from '@atlaskit/link-client-extension';
import {
  DatasourceDataRequest,
  DatasourceDataResponseItem,
  DatasourceParameters,
  DatasourceResponseSchemaProperty,
  DatasourceTableStatusType,
} from '@atlaskit/linking-types';

export interface onNextPageProps {
  isSchemaFromData?: boolean;
  shouldRequestFirstPage?: boolean;
}

export type NextPageType = (requestInfo?: onNextPageProps) => void;

export interface DatasourceTableState {
  status: DatasourceTableStatusType;
  onNextPage: NextPageType;
  // Resets state of the hook to be as if it is a first time it is being called.
  reset: () => void;
  loadDatasourceDetails: () => void;
  responseItems: DatasourceDataResponseItem[];
  hasNextPage: boolean;
  columns: DatasourceResponseSchemaProperty[];
  defaultVisibleColumnKeys: string[];
  totalCount?: number;
}

export interface DatasourceTableStateProps {
  datasourceId: string;
  parameters?: DatasourceParameters;
  fieldKeys?: string[];
}

export const useDatasourceTableState = ({
  datasourceId,
  parameters,
  fieldKeys = [],
}: DatasourceTableStateProps): DatasourceTableState => {
  const [defaultVisibleColumnKeys, setDefaultVisibleColumnKeys] = useState<
    DatasourceTableState['defaultVisibleColumnKeys']
  >([]);
  const [lastRequestedFieldKeys, setLastRequestedFieldKeys] = useState<
    string[]
  >([]);
  const [status, setStatus] = useState<DatasourceTableState['status']>('empty');
  const [responseItems, setResponseItems] = useState<
    DatasourceTableState['responseItems']
  >([]);
  const [hasNextPage, setHasNextPage] =
    useState<DatasourceTableState['hasNextPage']>(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [columns, setColumns] = useState<DatasourceTableState['columns']>([]);
  const [totalCount, setTotalCount] =
    useState<DatasourceTableState['totalCount']>(undefined);

  const { getDatasourceData, getDatasourceDetails } =
    useDatasourceClientExtension();

  const loadDatasourceDetails = useCallback(async () => {
    if (!parameters) {
      return;
    }
    const result = await getDatasourceDetails(datasourceId, {
      parameters,
    });

    const isColumnNotPresentInCurrentColumnsList = (
      col: DatasourceResponseSchemaProperty,
    ) => !columns.find(column => column.key === col.key);

    const allColumns = result.schema.properties;
    const newColumns = allColumns.filter(
      isColumnNotPresentInCurrentColumnsList,
    );

    newColumns.length > 0 && setColumns([...columns, ...newColumns]);
  }, [columns, datasourceId, getDatasourceDetails, parameters]);

  const applySchemaProperties = useCallback(
    (properties: DatasourceResponseSchemaProperty[]) => {
      if (columns.length === 0) {
        setColumns(properties);
      }

      const defaultProperties = properties.map(prop => prop.key);

      // when loading for the first time, we will need to set default visible props as /data does not give you that info
      // also, since we dont pass any fields, we will need to set this info as lastRequestedFieldKeys
      if (defaultVisibleColumnKeys.length === 0) {
        setDefaultVisibleColumnKeys(defaultProperties);
      }

      if (lastRequestedFieldKeys.length === 0) {
        setLastRequestedFieldKeys(defaultProperties);
      }
    },
    [
      columns.length,
      defaultVisibleColumnKeys.length,
      lastRequestedFieldKeys?.length,
    ],
  );

  const onNextPage = useCallback(
    async (requestInfo: onNextPageProps = {}) => {
      if (!parameters) {
        return;
      }

      const { isSchemaFromData = true, shouldRequestFirstPage } = requestInfo;

      const datasourceDataRequest: DatasourceDataRequest = {
        parameters,
        pageSize: 20,
        pageCursor: shouldRequestFirstPage ? undefined : nextCursor,
        fields: fieldKeys,
        includeSchema: isSchemaFromData,
      };

      setStatus('loading');

      const { data, nextPageCursor, totalCount, schema } =
        await getDatasourceData(datasourceId, datasourceDataRequest);

      setTotalCount(totalCount);
      setNextCursor(nextPageCursor);

      setResponseItems(currentResponseItems => {
        if (shouldRequestFirstPage) {
          return data;
        }
        return [...currentResponseItems, ...data];
      });

      setStatus('resolved');
      setHasNextPage(Boolean(nextPageCursor));

      if (fieldKeys.length > 0) {
        setLastRequestedFieldKeys(fieldKeys);
      }

      if (isSchemaFromData && schema) {
        applySchemaProperties(schema.properties);
      }
    },
    [
      parameters,
      fieldKeys,
      getDatasourceData,
      datasourceId,
      nextCursor,
      applySchemaProperties,
    ],
  );

  const reset = useCallback(() => {
    setStatus('empty');
    setResponseItems([]);
    setHasNextPage(true);
    setNextCursor(undefined);
    setTotalCount(undefined);
    setLastRequestedFieldKeys([]);
  }, []);

  // this takes care of requesting /data initally
  useEffect(() => {
    const isEmptyState =
      Object.keys(parameters || {}).length > 0 &&
      lastRequestedFieldKeys.length === 0 &&
      status === 'empty';

    if (isEmptyState) {
      void onNextPage();
    }
  }, [
    lastRequestedFieldKeys,
    loadDatasourceDetails,
    onNextPage,
    parameters,
    status,
  ]);

  // this takes care of requesting /data when user selects/unselects a column
  useEffect(() => {
    const canHaveNewColumns =
      fieldKeys.length > 0 && lastRequestedFieldKeys.length > 0;

    if (canHaveNewColumns) {
      const hasNewColumns = fieldKeys.some(
        key => !lastRequestedFieldKeys.includes(key),
      );

      if (!hasNewColumns) {
        return;
      }

      reset();

      void onNextPage({
        isSchemaFromData: false, // since this is not inital load, we will already have schema
        shouldRequestFirstPage: true,
      });
    }
  }, [fieldKeys, lastRequestedFieldKeys, onNextPage, reset]);

  return {
    status,
    onNextPage,
    responseItems,
    reset,
    loadDatasourceDetails,
    hasNextPage,
    columns,
    defaultVisibleColumnKeys,
    totalCount,
  };
};
