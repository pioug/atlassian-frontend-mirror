import React from 'react';

import { Skeleton } from '@atlaskit/linking-common';

export const AssetsObjectSchemaSelectSkeleton = (): React.JSX.Element => (
	<Skeleton
		width="100%"
		height="40px"
		testId="assets-datasource-modal--object-schema-select-skeleton"
	/>
);
