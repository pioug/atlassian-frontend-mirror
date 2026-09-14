import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export const createEvent = (
	eventType: 'ui' | 'operational',
	action: string,
	actionSubject: string,
	attributes = {},
): AnalyticsEventPayload => ({
	eventType,
	action,
	actionSubject,
	attributes: {
		packageName,
		packageVersion,
		...attributes,
	},
});
