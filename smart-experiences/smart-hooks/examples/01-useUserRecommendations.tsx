import React, { useCallback, useMemo, useState } from 'react';

import { IntlProvider, useIntl } from 'react-intl-next';

import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Textfield from '@atlaskit/textfield';
import { ufologger } from '@atlaskit/ufo';
import UserPicker, { type ActionTypes, type Value } from '@atlaskit/user-picker';
import { payloadPublisher } from '@atlassian/ufo';

import { useEndpointMocks } from '../example-helpers/use-endpoint-mocks';
import { transformRecommendationsToOptions, useUserRecommendations } from '../src';

payloadPublisher.setup({
	product: 'examples',
	gasv3: {
		sendOperationalEvent: (event) => {
			console.log('sendOperationalEvent:', event);
		},
	},
	app: { version: { web: 'unknown' } },
});

ufologger.enable();

const JIRA_CLOUD_ID = '49d8b9d6-ee7d-4931-a0ca-7fcae7d1c3b5';

type State = {
	baseUrl?: string;
	userId: string;
	tenantId: string;
	includeUsers: boolean;
	includeGroups: boolean;
	includeTeams: boolean;
	isMulti: boolean;
	isPreloadOn: boolean;
	fieldId: string;
	childObjectId?: string;
	objectId?: string;
	containerId?: string;
};

const UserPickerExample = React.memo(() => {
	useEndpointMocks();

	let [state, setState] = useState<State>({
		baseUrl: undefined,
		userId: 'Context',
		tenantId: JIRA_CLOUD_ID,
		fieldId: 'storybook',
		includeUsers: true,
		includeGroups: false,
		includeTeams: true,
		isMulti: true,
		isPreloadOn: false,
		childObjectId: undefined,
		objectId: undefined,
		containerId: undefined,
	});

	const { isLoading, recommendations, triggerSearchFactory, selectUserFactory } =
		useUserRecommendations({
			baseUrl: state.baseUrl,
			fieldId: 'fieldId',
			objectId: state.objectId,
			containerId: state.containerId,
			includeGroups: state.includeGroups,
			includeTeams: state.includeTeams,
			includeUsers: state.includeUsers,
			productKey: 'jira',
			tenantId: state.tenantId,
			preload: state.isPreloadOn,
		});
	const triggerSearch = triggerSearchFactory();
	const selectUser = selectUserFactory();
	const intl = useIntl();
	const options = useMemo(
		() => transformRecommendationsToOptions(recommendations, intl),
		[recommendations, intl],
	);
	const createBoolean = (
		id: 'includeUsers' | 'includeGroups' | 'includeTeams' | 'isMulti' | 'isPreloadOn',
		label: string,
	) => {
		return (
			<div>
				<input
					checked={Boolean(state[id] as boolean)}
					id={id}
					onChange={() =>
						setState({
							...state,
							[id]: !state[id],
						})
					}
					type="checkbox"
				/>
				<label htmlFor={id}>{label}</label>
			</div>
		);
	};

	const createText = (
		id:
			| 'baseUrl'
			| 'userId'
			| 'tenantId'
			| 'objectId'
			| 'childObjectId'
			| 'fieldId'
			| 'containerId',
		width: 'large' | 'medium',
	) => {
		return (
			<Textfield
				width={width}
				name={id}
				value={(state[id] as string) || ''}
				onChange={(e) => {
					setState({
						...state,
						[id]: e.currentTarget.value,
					});
				}}
			/>
		);
	};

	const handleChange = useCallback(
		(value: Value, action: ActionTypes) => {
			console.log(value);
			if (value && Array.isArray(value)) {
				// For UserPickers, the last item in the array is the most recently selected
				// for the multipicker case
				value.length > 0 && selectUser(value[value.length - 1].id);
			} else {
				// please ensure ID is not PII/UGC
				value && selectUser(value.id);
			}
		},
		[selectUser],
	);

	const onFocus = useCallback(() => triggerSearch(''), [triggerSearch]);

	return (
		<div>
			<h5>Smart Picker props</h5>
			<label htmlFor="userId">User Id (userId)</label>
			{createText('userId', 'large')}
			<label htmlFor="tenantId">Tenant ID (tenantId)</label>
			{createText('tenantId', 'large')}
			<label htmlFor="fieldId">Context Id (fieldId)</label>
			{createText('fieldId', 'large')}
			<label htmlFor="containerId">Container Id [Optional] (containerId)</label>
			{createText('containerId', 'large')}
			<label htmlFor="objectId">Object Id [Optional] (objectId)</label>
			{createText('objectId', 'large')}
			<label htmlFor="childObjectId">Child Object Id [Optional] (childObjectId)</label>
			{createText('childObjectId', 'large')}
			<label htmlFor="baseUrl">baseUrl</label>
			{createText('baseUrl', 'large')}
			{createBoolean('includeUsers', 'includeUsers')}
			{createBoolean('includeTeams', 'includeTeams')}
			{createBoolean('includeGroups', 'includeGroups')}
			{createBoolean('isPreloadOn', 'isPreloadOn')}
			{createBoolean('isMulti', 'isMulti')}
			<hr />
			<label htmlFor="user-picker">User Picker</label>
			<UserPicker
				maxOptions={10}
				isMulti={state.isMulti}
				onFocus={onFocus}
				onInputChange={triggerSearch}
				onChange={handleChange}
				fieldId={state.fieldId}
				options={options}
				isLoading={isLoading}
			/>
		</div>
	);
});

export default () => {
	let onEvent = (e: UIAnalyticsEvent) => {
		console.log(
			`Analytics ${e.payload.attributes.sessionId} ${e.payload.actionSubject} ${e.payload.action} `,
			e.payload,
		);
	};

	return (
		<AnalyticsListener onEvent={onEvent} channel="fabric-elements">
			<IntlProvider locale="en-US">
				<UserPickerExample />
			</IntlProvider>
		</AnalyticsListener>
	);
};
