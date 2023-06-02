import React, { lazy, Suspense } from 'react';

import { DatasourceTableViewProps } from './types';

const LazyDatasourceTableView = lazy(() =>
  import(
    /* webpackChunkName: "@atlaskit-internal_linkdatasource-tableview" */ './datasourceTableView'
  ).then(module => ({ default: module.DatasourceTableView })),
);

const DatasourceTableViewWithWrappers = (props: DatasourceTableViewProps) => {
  return (
    <Suspense fallback={<div data-testid={'datasource-table-view-suspense'} />}>
      <LazyDatasourceTableView {...props} />
    </Suspense>
  );
};

export default DatasourceTableViewWithWrappers;
