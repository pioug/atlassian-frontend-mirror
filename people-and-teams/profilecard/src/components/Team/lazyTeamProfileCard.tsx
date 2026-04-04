import { lazy, type LazyExoticComponent } from 'react';

import type { TeamProfilecardProps } from '../../types';

export const TeamProfileCardLazy: LazyExoticComponent<
	(props: TeamProfilecardProps) => React.JSX.Element | null
> = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_lazy-team-profilecard" */
			'./TeamProfileCard'
		),
);
