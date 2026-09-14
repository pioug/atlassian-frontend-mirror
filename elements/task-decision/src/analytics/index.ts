// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import createAndFireEvent from '@atlaskit/analytics-next/createAndFireEvents';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';

export const fabricElementsChannel = 'fabric-elements';

export const createAndFireEventInElementsChannel: (
	payload: AnalyticsEventPayload,
) => (createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent =
	createAndFireEvent(fabricElementsChannel);
