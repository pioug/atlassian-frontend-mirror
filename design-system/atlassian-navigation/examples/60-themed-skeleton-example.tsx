import React, { Fragment } from 'react';

import { NavigationSkeleton } from '@atlaskit/atlassian-navigation/skeleton';

import { themes } from './shared/themes';

const primary = 4;
const secondary = 4;

const ThemedSkeletonExample = () => (
	<div>
		{themes.map((theme, i) => (
			<Fragment key={i}>
				<NavigationSkeleton
					primaryItemsCount={primary}
					secondaryItemsCount={secondary}
					showSiteName
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					theme={theme}
					testId={`themed-skeleton-${i}`}
				/>
				{i < themes.length - 1 && <br />}
			</Fragment>
		))}
	</div>
);

export default ThemedSkeletonExample;
