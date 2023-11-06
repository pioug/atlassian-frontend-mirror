import React, { useMemo } from 'react';

import {
  DatasourceDataResponseItem,
  DatasourceResponseSchemaProperty,
  DatasourceTableStatusType,
} from '@atlaskit/linking-types';

import { AccessRequired } from '../../../common/error-state/access-required';
import { ModalLoadingError } from '../../../common/error-state/modal-loading-error';
import { NoResults } from '../../../common/error-state/no-results';
import { EmptyState, IssueLikeDataTableView } from '../../../issue-like-table';

import { InitialStateView } from './initial-state-view';

export interface RenderAssetsContentProps {
  status: DatasourceTableStatusType;
  responseItems: DatasourceDataResponseItem[];
  visibleColumnKeys?: string[];
  datasourceId: string;
  aql?: string;
  schemaId?: String;
  onNextPage: () => void;
  hasNextPage: boolean;
  loadDatasourceDetails: () => void;
  columns: DatasourceResponseSchemaProperty[];
  defaultVisibleColumnKeys: string[];
  onVisibleColumnKeysChange: (visibleColumnKeys: string[]) => void;
  modalRenderInstanceId: string;
}

export const RenderAssetsContent = (props: RenderAssetsContentProps) => {
  const {
    status,
    responseItems,
    visibleColumnKeys,
    onNextPage,
    hasNextPage,
    loadDatasourceDetails,
    columns,
    defaultVisibleColumnKeys,
    onVisibleColumnKeysChange,
    modalRenderInstanceId,
  } = props;

  const resolvedWithNoResults = status === 'resolved' && !responseItems.length;

  const issueLikeDataTableView = useMemo(
    () => (
      <IssueLikeDataTableView
        testId="asset-datasource-table"
        status={status}
        columns={columns}
        items={responseItems}
        hasNextPage={hasNextPage}
        visibleColumnKeys={visibleColumnKeys || defaultVisibleColumnKeys}
        onNextPage={onNextPage}
        onLoadDatasourceDetails={loadDatasourceDetails}
        onVisibleColumnKeysChange={onVisibleColumnKeysChange}
        parentContainerRenderInstanceId={modalRenderInstanceId}
      />
    ),
    [
      columns,
      defaultVisibleColumnKeys,
      hasNextPage,
      loadDatasourceDetails,
      onNextPage,
      onVisibleColumnKeysChange,
      responseItems,
      status,
      visibleColumnKeys,
      modalRenderInstanceId,
    ],
  );

  if (status === 'rejected') {
    return <ModalLoadingError />;
  } else if (status === 'unauthorized') {
    return <AccessRequired />;
  } else if (status === 'empty') {
    return <InitialStateView />;
  } else if (resolvedWithNoResults) {
    return <NoResults />;
  } else if (status === 'loading' && !columns.length) {
    return <EmptyState testId="assets-aql-datasource-modal--loading-state" />;
  }

  return issueLikeDataTableView;
};
