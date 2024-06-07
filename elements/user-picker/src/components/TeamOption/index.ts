import React from 'react';

const AsyncTeamOption = React.lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_@atlassian/user-picker/team-option" */ './main'
	).then((module) => {
		return {
			default: module.TeamOption,
		};
	}),
);

export default AsyncTeamOption;
