import { lazy } from 'react';

export const ProfileCardLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_lazy-profilecard" */
			'./ProfileCard'
		),
);
