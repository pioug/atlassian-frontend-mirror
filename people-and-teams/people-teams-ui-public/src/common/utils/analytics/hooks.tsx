import React, { type ReactNode, useMemo } from 'react';

import { PeopleTeamsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

const defaultAnalyticsContextData = {
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export function PeopleTeamsAnalyticsProvider({
	analyticsContextData,
	children,
}: {
	analyticsContextData?: object;
	children: ReactNode;
}): React.JSX.Element {
	const data = useMemo(() => {
		if (typeof analyticsContextData === 'object') {
			return {
				...defaultAnalyticsContextData,
				...analyticsContextData,
			};
		}

		return defaultAnalyticsContextData;
	}, [analyticsContextData]);

	return <PeopleTeamsAnalyticsContext data={data}>{children}</PeopleTeamsAnalyticsContext>;
}
