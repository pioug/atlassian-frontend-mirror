import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';
import createAndFireEvent from '@atlaskit/analytics-next/createAndFireEvents';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { type Props } from './types';

export type UserPickerSession = {
	id: string;
	start: number;
	inputChangeTime: number;
	upCount: number;
	downCount: number;
	lastKey?: number;
};

export const createAndFireEventInElementsChannel: (
	payload: AnalyticsEventPayload,
) => (createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent =
	createAndFireEvent('fabric-elements');

export interface SmartEventCreator {
	(props: Props, ...args: any[]): AnalyticsEventPayload;
}
