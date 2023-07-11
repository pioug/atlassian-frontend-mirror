import React from 'react';

import {
  DatasourceDataResponseItem,
  DatasourceTableStatusType,
} from '@atlaskit/linking-types';

import { ModalLoadingError } from '../../../common/error-state/modal-loading-error';
import { NoResults } from '../../../common/error-state/no-results';
import { EmptyState } from '../../../issue-like-table';

interface RenderAssetsContentProps {
  status: DatasourceTableStatusType;
  responseItems: DatasourceDataResponseItem[];
}

export const RenderAssetsContent = (props: RenderAssetsContentProps) => {
  const { status, responseItems } = props;
  const resolvedWithNoResults = status === 'resolved' && !responseItems.length;

  if (status === 'rejected') {
    return <ModalLoadingError />;
  } else if (resolvedWithNoResults) {
    return <NoResults />;
  } else if (status === 'empty') {
    return <EmptyState testId="assets-aql-datasource-modal--empty-state" />;
  }

  return <p>TODO add IssueLikeDataTableView component.</p>;
};
