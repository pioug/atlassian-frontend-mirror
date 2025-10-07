import React from 'react';

import { componentWithFG } from '@atlaskit/platform-feature-flags-react';
import { TeamsAppAnalyticsContext } from '@atlaskit/teams-app-internal-analytics';

import { PeopleTeamsAnalyticsProvider } from '../index';

type PeopleTeamsAnalyticsSubcontextState = {
	topLevelAttributes?: { source?: string; attributes?: Record<string, any> };
};

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
function _PeopleTeamsAnalyticsSubcontextProvider({
	children,
	topLevelAttributes,
}: PeopleTeamsAnalyticsSubcontextState & { children: React.ReactNode }) {
	return (
		<PeopleTeamsAnalyticsProvider analyticsContextData={topLevelAttributes}>
			<>{children}</>
		</PeopleTeamsAnalyticsProvider>
	);
}

/**
 *
 * When this feature get is cleaned up, every instance of  `PeopleTeamsAnalyticsSubcontextProvider`
 * should be replaced with `TeamsAppAnalyticsContext` from `@atlaskit/teams-app-internal-analytics`
 */
function _TeamsAppAnalyticsContext({
	children,
	topLevelAttributes,
}: PeopleTeamsAnalyticsSubcontextState & { children: React.ReactNode }) {
	return (
		// @ts-ignore - source as a string is not a valid type for TeamsAppAnalyticsContext
		<TeamsAppAnalyticsContext data={topLevelAttributes}>
			<>{children}</>
		</TeamsAppAnalyticsContext>
	);
}

export const PeopleTeamsAnalyticsSubcontextProvider = componentWithFG(
	'ptc-enable-people-teams-ui-analytics-refactor',
	_TeamsAppAnalyticsContext,
	_PeopleTeamsAnalyticsSubcontextProvider,
);
