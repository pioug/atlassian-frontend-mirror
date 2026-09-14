import React, { lazy, Suspense } from 'react';

import { type AssetsConfigModalProps } from './types';

const LazyAssetsConfigModal = lazy(() =>
	import(/* webpackChunkName: "@atlaskit-internal_linkdatasource-assetsmodal" */ './modal').then(
		(module) => ({ default: module.AssetsConfigModal }),
	),
);

export const AssetsConfigModalWithWrappers = (props: AssetsConfigModalProps): React.JSX.Element => {
	return (
		<Suspense fallback={<div data-testid={'assets-aql-datasource-table-suspense'} />}>
			<LazyAssetsConfigModal {...props} />
		</Suspense>
	);
};
