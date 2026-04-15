import React from 'react';
import type { GroupOptionProps } from './main';

const AsyncGroupOption = React.lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_@atlassian/user-picker/group-option" */ './main'
	).then((module) => {
		return {
			default: module.GroupOption,
		};
	}),
) as React.LazyExoticComponent<React.ComponentType<GroupOptionProps>>;

export default AsyncGroupOption;
