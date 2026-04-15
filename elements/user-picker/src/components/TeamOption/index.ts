import React from 'react';
import type { TeamOptionProps } from './main';

const AsyncTeamOption = React.lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_@atlassian/user-picker/team-option" */ './main'
	).then((module) => {
		return {
			default: module.TeamOption,
		};
	}),
) as React.LazyExoticComponent<React.ComponentType<TeamOptionProps>>;

export default AsyncTeamOption;
