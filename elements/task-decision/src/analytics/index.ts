// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
	createAndFireEvent,
	UIAnalyticsEvent,
	type AnalyticsEventPayload,
	type CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';

export const fabricElementsChannel = 'fabric-elements';

export const createAndFireEventInElementsChannel: (
	payload: AnalyticsEventPayload,
) => (createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent =
	createAndFireEvent(fabricElementsChannel);
