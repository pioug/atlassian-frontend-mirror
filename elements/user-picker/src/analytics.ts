/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

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

/**
 * @deprecated Use `import { startSession } from '@atlaskit/user-picker/start-session'` instead.
 */
export { startSession } from './startSession';
/**
 * @deprecated Use `import { focusEvent } from '@atlaskit/user-picker/focus-event'` instead.
 */
export { focusEvent } from './focusEvent';
/**
 * @deprecated Use `import { clearEvent } from '@atlaskit/user-picker/clear-event'` instead.
 */
export { clearEvent } from './clearEvent';
/**
 * @deprecated Use `import { deleteEvent } from '@atlaskit/user-picker/delete-event'` instead.
 */
export { deleteEvent } from './deleteEvent';
/**
 * @deprecated Use `import { cancelEvent } from '@atlaskit/user-picker/cancel-event'` instead.
 */
export { cancelEvent } from './cancelEvent';
/**
 * @deprecated Use `import { selectEvent } from '@atlaskit/user-picker/select-event'` instead.
 */
export { selectEvent } from './selectEvent';
/**
 * @deprecated Use `import { searchedEvent } from '@atlaskit/user-picker/searched-event'` instead.
 */
export { searchedEvent } from './searchedEvent';
/**
 * @deprecated Use `import { failedEvent } from '@atlaskit/user-picker/failed-event'` instead.
 */
export { failedEvent } from './failedEvent';
/**
 * @deprecated Use `import { userInfoEvent } from '@atlaskit/user-picker/user-info-event'` instead.
 */
export { userInfoEvent } from './userInfoEvent';
/**
 * @deprecated Use `import { createEvent } from '@atlaskit/user-picker/create-event'` instead.
 */
export { createEvent } from './createEvent';
/**
 * @deprecated Use `import { checkValidId } from '@atlaskit/user-picker/check-valid-id'` instead.
 */
export { checkValidId } from './checkValidId';
/**
 * @deprecated Use `import { optionData2Analytics } from '@atlaskit/user-picker/option-data2-analytics'` instead.
 */
export { optionData2Analytics } from './optionData2Analytics';
/**
 * @deprecated Use `import { createDefaultPickerAttributes } from '@atlaskit/user-picker/create-default-picker-attributes'` instead.
 */
export { createDefaultPickerAttributes } from './createDefaultPickerAttributes';
/**
 * @deprecated Use `import { queryLength } from '@atlaskit/user-picker/query-length'` instead.
 */
export { queryLength } from './queryLength';
/**
 * @deprecated Use `import { upKeyCount } from '@atlaskit/user-picker/up-key-count'` instead.
 */
export { upKeyCount } from './upKeyCount';
/**
 * @deprecated Use `import { downKeyCount } from '@atlaskit/user-picker/down-key-count'` instead.
 */
export { downKeyCount } from './downKeyCount';
/**
 * @deprecated Use `import { spaceInQuery } from '@atlaskit/user-picker/space-in-query'` instead.
 */
export { spaceInQuery } from './spaceInQuery';
/**
 * @deprecated Use `import { sessionDuration } from '@atlaskit/user-picker/session-duration'` instead.
 */
export { sessionDuration } from './sessionDuration';
/**
 * @deprecated Use `import { sessionId } from '@atlaskit/user-picker/session-id'` instead.
 */
export { sessionId } from './sessionId';
/**
 * @deprecated Use `import { values } from '@atlaskit/user-picker/values'` instead.
 */
export { values } from './values';
/**
 * @deprecated Use `import { numberOfResults } from '@atlaskit/user-picker/number-of-results'` instead.
 */
export { numberOfResults } from './numberOfResults';
