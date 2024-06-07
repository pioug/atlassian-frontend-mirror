import React from 'react';

const AsyncExternalUserOption = React.lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_@atlassian/user-picker/external-user-option" */ './main'
	).then((module) => {
		return {
			default: module.ExternalUserOption,
		};
	}),
);

export default AsyncExternalUserOption;
