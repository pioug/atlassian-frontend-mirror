import React, { type ReactNode, useMemo } from 'react';

import { PeopleTeamsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import type { AnalyticsEventSource } from '../../common/utils/constants';
import type { PackageMetaDataType } from '../../common/utils/generated/analytics.types';

export const defaultAnalyticsContextData: PackageMetaDataType = {
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

type TeamsAppAnalyticsContextData = {
	source?: AnalyticsEventSource;
	attributes?: Record<string, any>;
};

export function TeamsAppAnalyticsContext({
	data,
	children,
}: {
	data?: TeamsAppAnalyticsContextData;
	children: ReactNode;
}) {
	const analyticsContextData = useMemo(() => {
		if (typeof data === 'object') {
			return {
				...defaultAnalyticsContextData,
				...data,
			};
		}
		return defaultAnalyticsContextData;
	}, [data]);

	return (
		<PeopleTeamsAnalyticsContext data={analyticsContextData}>
			{children}
		</PeopleTeamsAnalyticsContext>
	);
}
