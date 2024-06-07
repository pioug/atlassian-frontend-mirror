import React, { Suspense } from 'react';

const LazyDatasourceRenderFailedAnalyticsWrapper = React.lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_linkdatasource-datasourceRenderFailedAnalyticsWrapper" */ './datasourceRenderFailedAnalyticsWrapper'
		),
);

export const LazyLoadedDatasourceRenderFailedAnalyticsWrapper = (props: any) => (
	<Suspense fallback={null}>
		<LazyDatasourceRenderFailedAnalyticsWrapper {...props} />
	</Suspense>
);
