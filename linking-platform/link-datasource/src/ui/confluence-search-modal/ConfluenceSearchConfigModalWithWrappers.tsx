import React, { lazy, Suspense } from 'react';

import { type ConfluenceSearchConfigModalProps } from './types';

const LazyConfluenceSearchConfigModal = lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_linkdatasource-confluencesearchmodal" */ './modal/ConfluenceSearchConfigModal'
	).then((module) => ({ default: module.ConfluenceSearchConfigModal })),
);

export const ConfluenceSearchConfigModalWithWrappers = (
	props: ConfluenceSearchConfigModalProps,
): React.JSX.Element => {
	return (
		<Suspense fallback={<div data-testid={'confluence-search-datasource-table-suspense'} />}>
			<LazyConfluenceSearchConfigModal {...props} />
		</Suspense>
	);
};
