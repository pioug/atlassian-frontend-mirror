import React from 'react';

import { PeopleTeamsAnalyticsProvider } from '../index';

type PeopleTeamsAnalyticsSubcontextState = {
	topLevelAttributes?: { source?: string; attributes?: Record<string, any> };
};

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export function PeopleTeamsAnalyticsSubcontextProvider({
	children,
	topLevelAttributes,
}: PeopleTeamsAnalyticsSubcontextState & { children: React.ReactNode }) {
	return (
		<PeopleTeamsAnalyticsProvider analyticsContextData={topLevelAttributes}>
			<>{children}</>
		</PeopleTeamsAnalyticsProvider>
	);
}
