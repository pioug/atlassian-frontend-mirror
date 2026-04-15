import React from 'react';
import type { EmailOptionProps } from './main';

const AsyncEmailOption = React.lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_@atlassian/user-picker/email-option" */ './main'
	).then((module) => {
		return {
			default: module.EmailOption,
		};
	}),
) as React.LazyExoticComponent<React.ComponentType<EmailOptionProps>>;

export default AsyncEmailOption;
