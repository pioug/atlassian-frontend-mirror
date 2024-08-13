import { lazy } from 'react';

export const AgentProfileCardLazy = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_lazy-agent-profilecard" */
			'./AgentProfileCard'
		),
);
