/** @jsx jsx */
import { useMemo } from 'react';

import { css, jsx } from '@emotion/react';

import {
  DatasourceDataResponseItem,
  DatasourceResponseSchemaProperty,
  DatasourceTableStatusType,
} from '@atlaskit/linking-types';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { AccessRequired } from '../../../common/error-state/access-required';
import { ModalLoadingError } from '../../../common/error-state/modal-loading-error';
import { NoResults } from '../../../common/error-state/no-results';
import { EmptyState, IssueLikeDataTableView } from '../../../issue-like-table';

import { InitialStateView } from './initial-state-view';

export interface RenderAssetsContentProps {
  isFetchingInitialData: boolean;
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

// This is to prevent y scrollbar when initially fetching data
const emptyStateOverrideStyles = css({
  height: '420px',
  overflow: 'hidden',
});

const tableBordersStyles = css({
  border: `1px solid ${token('color.border', N40)}`,
  borderTopLeftRadius: token('border.radius.200', '8px'),
  borderTopRightRadius: token('border.radius.200', '8px'),
});

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
    isFetchingInitialData,
  } = props;

  const resolvedWithNoResults = status === 'resolved' && !responseItems.length;

  const issueLikeDataTableView = useMemo(
    () => (
      <div css={tableBordersStyles}>
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
      </div>
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

  if (isFetchingInitialData) {
    // Placing this check first as it's a priority before all others
    return (
      <div css={[tableBordersStyles, emptyStateOverrideStyles]}>
        <EmptyState testId="assets-aql-datasource-modal--loading-state" />
      </div>
    );
  } else if (status === 'rejected') {
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
