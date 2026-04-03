import { lazy, type LazyExoticComponent } from 'react';

import type { ProfilecardProps, AnalyticsProps } from '../../types';

export const ProfileCardLazy: LazyExoticComponent<(props: ProfilecardProps & AnalyticsProps) => React.JSX.Element | null> = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_lazy-profilecard" */
			'./ProfileCard'
		),
);
