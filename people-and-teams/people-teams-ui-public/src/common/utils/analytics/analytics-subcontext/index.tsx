import React from 'react';

import { PeopleTeamsAnalyticsProvider } from '../index';

type PeopleTeamsAnalyticsSubcontextState = {
	topLevelAttributes?: { source?: string; attributes?: Record<string, any> };
};

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
