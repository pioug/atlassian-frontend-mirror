import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import React from 'react';
import type { ExternalUser } from '../../types';

const AsyncExternalUserOption: React.LazyExoticComponent<
	React.ForwardRefExoticComponent<
		Omit<
			{
				isSelected: boolean;
				status?: string;
				user: ExternalUser;
			},
			keyof WithAnalyticsEventsProps
		> &
			React.RefAttributes<any>
	>
> = React.lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_@atlassian/user-picker/external-user-option" */ './main'
	).then((module) => {
		return {
			default: module.ExternalUserOption,
		};
	}),
);

export default AsyncExternalUserOption;
