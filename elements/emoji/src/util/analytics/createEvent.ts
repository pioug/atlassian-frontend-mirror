import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent'; // eslint-disable-line @typescript-eslint/consistent-type-imports

export const createEvent = (
	eventType: 'ui' | 'operational',
	action: string,
	actionSubject: string,
	actionSubjectId?: string,
	attributes = {},
): AnalyticsEventPayload => ({
	eventType,
	action,
	actionSubject,
	actionSubjectId,
	attributes: {
		packageName: process.env._PACKAGE_NAME_,
		packageVersion: process.env._PACKAGE_VERSION_,
		...attributes,
	},
});
