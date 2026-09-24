import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';
import createAndFireEvent from '@atlaskit/analytics-next/createAndFireEvents';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { type UserPickerProps, type UserPickerState } from './types';

export const packageName = process.env._PACKAGE_NAME_ as string;

export const packageVersion = process.env._PACKAGE_VERSION_ as string;

export const UUID_REGEXP_TEAMS_GROUPS: any =
	/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;

export const UUID_REGEXP_OLD_AAID: any =
	/^[a-fA-F0-9]{1,8}:[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;

export const UUID_REGEXP_NEW_AAID: any = /^[a-fA-F0-9]{24,24}$/;

export type UserPickerSession = {
	downCount: number;
	id: string;
	inputChangeTime: number;
	lastKey?: number;
	start: number;
	upCount: number;
};

export const createAndFireEventInElementsChannel: (
	payload: AnalyticsEventPayload,
) => (createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent =
	createAndFireEvent('fabric-elements');

export interface EventCreator {
	(
		props: UserPickerProps,
		state: UserPickerState,
		session?: UserPickerSession,
	): AnalyticsEventPayload;
	(
		props: UserPickerProps,
		state: UserPickerState,
		session?: UserPickerSession,
		...args: any[]
	): AnalyticsEventPayload;
}

export function pickerType(props: UserPickerProps): any {
	return props.isMulti ? 'multi' : 'single';
}
