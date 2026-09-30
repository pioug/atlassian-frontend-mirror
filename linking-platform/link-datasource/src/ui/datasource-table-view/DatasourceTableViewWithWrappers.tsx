import React, { lazy, memo, Suspense } from 'react';

import isEqual from 'lodash/isEqual';

import { type DatasourceTableViewProps } from './types';

const LazyDatasourceTableView = lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_linkdatasource-tableview" */ './datasourceTableView'
	).then((module) => ({ default: module.DatasourceTableView })),
);

// Equivalent renderer props must not update a Suspense boundary that is still hydrating.
export const DatasourceTableViewWithWrappers: React.MemoExoticComponent<
	(props: DatasourceTableViewProps) => React.JSX.Element
> = memo(function DatasourceTableViewWithWrappers(props: DatasourceTableViewProps) {
	return (
		<Suspense fallback={<div data-testid={'datasource-table-view-suspense'} />}>
			<LazyDatasourceTableView {...props} />
		</Suspense>
	);
}, isEqual);
