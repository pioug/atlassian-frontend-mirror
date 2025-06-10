/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { NavigationSkeleton } from '@atlaskit/atlassian-navigation/skeleton';

const InteractiveSkeletonExample = () => {
	return (
		<NavigationSkeleton primaryItemsCount={2} secondaryItemsCount={1} shouldShowSearch={true} />
	);
};

export default InteractiveSkeletonExample;
