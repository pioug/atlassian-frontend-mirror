import React, { lazy, memo, Suspense } from 'react';

import isEqual from 'lodash/isEqual';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { type DatasourceTableViewProps } from './types';

const LazyDatasourceTableView = lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_linkdatasource-tableview" */ './datasourceTableView'
	).then((module) => ({ default: module.DatasourceTableView })),
);

// Equivalent renderer props must not update a Suspense boundary that is still hydrating.
const StableDatasourceTableView = memo(function StableDatasourceTableView(
	props: DatasourceTableViewProps,
) {
	return (
		<Suspense fallback={<div data-testid={'datasource-table-view-suspense'} />}>
			<LazyDatasourceTableView {...props} />
		</Suspense>
	);
}, isEqual);

export const DatasourceTableViewWithWrappers = (
	props: DatasourceTableViewProps,
): React.JSX.Element => {
	if (isExperimentEnabled('platform_datasource_hydration_stability')) {
		return <StableDatasourceTableView {...props} />;
	}

	return (
		<Suspense fallback={<div data-testid={'datasource-table-view-suspense'} />}>
			<LazyDatasourceTableView {...props} />
		</Suspense>
	);
};
