/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Skeleton } from '@atlaskit/linking-common';

export const AssetsAqlSearchInputSkeleton = () => (
	<Skeleton
		width="100%"
		height="40px"
		testId="assets-datasource-modal--aql-search-input-skeleton"
	/>
);
