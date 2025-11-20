import React, { lazy, Suspense } from 'react';

import { type AssetsConfigModalProps } from './types';

export const ASSETS_LIST_OF_LINKS_DATASOURCE_ID = '361d618a-3c04-40ad-9b27-3c8ea6927020';

const LazyAssetsConfigModal = lazy(() =>
	import(/* webpackChunkName: "@atlaskit-internal_linkdatasource-assetsmodal" */ './modal').then(
		(module) => ({ default: module.AssetsConfigModal }),
	),
);
const AssetsConfigModalWithWrappers = (props: AssetsConfigModalProps): React.JSX.Element => {
	return (
		<Suspense fallback={<div data-testid={'assets-aql-datasource-table-suspense'} />}>
			<LazyAssetsConfigModal {...props} />
		</Suspense>
	);
};
export default AssetsConfigModalWithWrappers;
