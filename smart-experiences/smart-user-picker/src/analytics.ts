import { createAndFireEvent, type AnalyticsEventPayload } from '@atlaskit/analytics-next';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuid } from 'uuid';
import { type Props, type State } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export type UserPickerSession = {
	id: string;
	start: number;
	inputChangeTime: number;
	upCount: number;
	downCount: number;
	lastKey?: number;
};

export const startSession = (): UserPickerSession => ({
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	id: uuid(),
	start: Date.now(),
	inputChangeTime: Date.now(),
	upCount: 0,
	downCount: 0,
	lastKey: undefined,
});

export const createAndFireEventInElementsChannel = createAndFireEvent('fabric-elements');

const createEvent = (
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

export interface SmartEventCreator {
	(props: Props, ...args: any[]): AnalyticsEventPayload;
}

const createDefaultSmartPickerAttributes = (props: Props, state: State) => {
	const {
		fieldId,
		objectId,
		containerId,
		childObjectId,
		prefetch,
		maxOptions,
		includeTeams,
		productKey,
		principalId,
		siteId,
		orgId,
		filterOptions,
	} = props;
	const { sessionId, query } = state;

	const maxNumberOfResults = maxOptions || 100;
	return {
		context: fieldId,
		childObjectId,
		containerId,
		hasFilterOptions: Boolean(filterOptions),
		includeTeams,
		maxNumberOfResults,
		objectId,
		prefetch,
		principalId,
		productKey,
		queryLength: (query || '').length,
		siteId,
		orgId,
		sessionId,
	};
};

const createSmartUserPickerEvent = (
	action: string,
	actionSubect: string,
	attributes = {},
): AnalyticsEventPayload => ({
	source: 'smart-user-picker',
	...createEvent('operational', action, actionSubect, attributes),
});

export const preparedUsersLoadedEvent: SmartEventCreator = (
	props: Props,
	state: State,
	attributes = {},
) =>
	createSmartUserPickerEvent('loaded', 'preparedUsers', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});

export const mountedWithPrefetchEvent: SmartEventCreator = (
	props: Props,
	state: State,
	attributes = {},
) =>
	createSmartUserPickerEvent('mounted', 'prefetch', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});

export const filterUsersEvent: SmartEventCreator = (props: Props, state: State, attributes = {}) =>
	createSmartUserPickerEvent('filtered', 'users', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});

export const requestUsersEvent: SmartEventCreator = (props: Props, state: State, attributes = {}) =>
	createSmartUserPickerEvent('requested', 'users', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});

export const successfulRequestUsersEvent: SmartEventCreator = (
	props: Props,
	state: State,
	attributes = {},
) =>
	createSmartUserPickerEvent('successful', 'usersRequest', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});

export const failedRequestUsersEvent: SmartEventCreator = (
	props: Props,
	state: State,
	attributes = {},
) =>
	createSmartUserPickerEvent('failed', 'usersRequest', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});

export const failedUserResolversEvent: SmartEventCreator = (
	props: Props,
	state: State,
	attributes = {},
) =>
	createSmartUserPickerEvent('failed', 'userResolversRequest', {
		...createDefaultSmartPickerAttributes(props, state),
		...attributes,
	});
