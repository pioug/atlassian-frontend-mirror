import React from 'react';
import type { CustomOptionProps } from './main';

const AsyncCustomOption = React.lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_@atlassian/user-picker/custom-option" */ './main'
	).then((module) => {
		return {
			default: module.CustomOption,
		};
	}),
) as React.LazyExoticComponent<React.ComponentType<CustomOptionProps>>;

export default AsyncCustomOption;
