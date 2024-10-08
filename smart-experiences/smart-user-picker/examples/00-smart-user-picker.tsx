import React, { Fragment, useState } from 'react';
import { IntlProvider } from 'react-intl-next';

import {
	type ActionTypes,
	type OnChange,
	type OnInputChange,
	type Value,
	type OptionData,
	type ExternalUser,
	type User,
	type Team,
} from '@atlaskit/user-picker';
import SmartUserPicker from '../src';
import Textfield from '@atlaskit/textfield';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button/standard-button';
import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { options } from '../example-helpers/options';
import { useEndpointMocks } from '../example-helpers/mock-endpoints';
import '../example-helpers/mock-ufo';

const exampleLocales = ['en-EN', 'cs-CZ', 'da-DK', 'de-DE'];

const products = [
	{ label: 'Jira', value: 'jira' },
	{ label: 'Confluence', value: 'confluence' },
	{ label: 'People', value: 'people' },
	{ label: 'Bitbucket', value: 'bitbucket' },
];

export interface BitbucketAttributes {
	isPublicRepo?: boolean;
	workspaceIds?: string[];
	emailDomain?: string;
}

export interface ConfluenceAttributes {
	isEntitledConfluenceExternalCollaborator?: boolean;
}

type State = {
	userId: string;
	tenantId: string;
	orgId: string;
	product: string;
	includeUsers: boolean;
	includeGroups: boolean;
	includeTeams: boolean;
	includeNonLicensedUsers: boolean;
	isFilterOn: boolean;
	isMulti: boolean;
	isPrefetchOn: boolean;
	fieldId: string;
	childObjectId?: string;
	objectId?: string;
	containerId?: string;
	bootstrapOptions: boolean;
	bitbucketAttributes: BitbucketAttributes;
	confluenceAttributes: ConfluenceAttributes;
	locale: string;
	selectedOptionIds: Set<string>;
};

const TENANT_ID = 'fake-tenant-id';
const ORG_ID = 'fake-org-id';

const productsMap = products
	.map((p) => ({ [p.value]: p }))
	.reduce((acc, val) => ({ ...acc, ...val }), {});

const SmartUserPickerCustomizableExample = () => {
	useEndpointMocks();

	let [state, setState] = useState<State>({
		userId: 'context',
		tenantId: TENANT_ID,
		orgId: ORG_ID,
		fieldId: 'storybook',
		product: 'jira',
		includeUsers: true,
		includeGroups: false,
		includeTeams: true,
		includeNonLicensedUsers: false,
		isFilterOn: false,
		isMulti: true,
		isPrefetchOn: false,
		childObjectId: undefined,
		objectId: undefined,
		containerId: undefined,
		confluenceAttributes: {
			isEntitledConfluenceExternalCollaborator: false,
		},
		bitbucketAttributes: {
			workspaceIds: ['workspace-1', 'workspace-2'],
			emailDomain: 'atlassian.com',
			isPublicRepo: true,
		},
		bootstrapOptions: false,
		locale: 'en',
		selectedOptionIds: new Set(),
	});

	const getProductAttributes = (product: string) => {
		switch (product) {
			case 'bitbucket':
				return state.bitbucketAttributes;
			case 'confluence':
				return state.confluenceAttributes;
			default:
				return undefined;
		}
	};

	let onInputChange: OnInputChange = (query?: string, sessionId?: string) => {
		console.log(`onInputChange query=${query} sessionId=${sessionId}`);
	};

	let onEvent = (e: UIAnalyticsEvent) => {
		console.log(
			`Analytics ${e.payload.attributes.sessionId} ${e.payload.actionSubject} ${e.payload.action} `,
			e.payload,
		);
	};

	let filterOptions = (userData: OptionData[]): OptionData[] => {
		return userData.filter((option) => !state.selectedOptionIds.has(option.id));
	};

	let onChange: OnChange = (value: Value, action: ActionTypes) => {
		var selectedOptionIds = state.selectedOptionIds;
		if (Array.isArray(value)) {
			value.forEach((option) => selectedOptionIds.add(option.id));
		} else {
			value && selectedOptionIds.add(value.id);
		}
		setState({
			...state,
			selectedOptionIds,
		});
	};

	let overrideByline = (item: User | ExternalUser | Team) => {
		return (item as ExternalUser).isExternal ? 'Invite to Product' : '';
	};

	let createBoolean = (
		id:
			| 'includeUsers'
			| 'includeGroups'
			| 'includeTeams'
			| 'includeNonLicensedUsers'
			| 'isPrefetchOn'
			| 'bootstrapOptions'
			| 'isMulti'
			| 'isFilterOn',
		label: string,
	) => {
		return (
			<div>
				<input
					checked={Boolean(state[id] as boolean)}
					id={id}
					onChange={() =>
						// @ts-ignore
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
	let createText = (
		id: 'userId' | 'tenantId' | 'orgId' | 'objectId' | 'childObjectId' | 'fieldId' | 'containerId',
		width: 'large' | 'medium',
	) => {
		return (
			<Textfield
				width={width}
				name={id}
				value={(state[id] as string) || ''}
				onChange={(e) => {
					// @ts-ignore
					setState({
						...state,
						[id]: e.currentTarget.value,
					});
				}}
			/>
		);
	};
	return (
		<div>
			<label htmlFor="product">Product</label>
			<Select
				//@ts-ignore react-select unsupported props
				width="medium"
				onChange={(selectedValue) => {
					if (selectedValue) {
						setState({
							...state,
							// @ts-ignore
							product: selectedValue.value,
						});
					}
				}}
				value={productsMap[state.product]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="single-select"
				classNamePrefix="react-select"
				options={products}
				placeholder="Choose a Product"
			/>
			<label htmlFor="product">Locale</label>
			<Select
				options={exampleLocales.map((locale) => ({
					label: locale,
					value: locale,
				}))}
				onChange={(chosenOption) =>
					chosenOption &&
					setState({
						...state,
						locale: chosenOption.value,
					})
				}
				value={{ label: state.locale, value: state.locale }}
				//@ts-ignore react-select unsupported props
				width={150}
			/>
			<h5>Smart Picker props</h5>
			<label htmlFor="tenantId">
				Tenant Id
				<Button
					appearance="link"
					onClick={() => {
						setState({
							...state,
							tenantId: TENANT_ID,
							product: 'jira',
							includeGroups: false,
						});
					}}
				>
					Jdog
				</Button>
				<Button
					appearance="link"
					onClick={() => {
						setState({
							...state,
							tenantId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
							product: 'confluence',
							includeGroups: true,
						});
					}}
				>
					Pug
				</Button>
				<Button
					appearance="link"
					onClick={() => {
						setState({
							...state,
							tenantId: 'bitbucket',
							product: 'bitbucket',
						});
					}}
				>
					Bitbucket
				</Button>
			</label>
			{createText('tenantId', 'large')}
			<label htmlFor="orgId">
				Org Id
				<Button
					appearance="link"
					onClick={() => {
						setState({
							...state,
							orgId: ORG_ID,
						});
					}}
				>
					Mock value
				</Button>
				<Button
					appearance="link"
					onClick={() => {
						setState({
							...state,
							orgId: '3f97e0d7-a8ca-4263-91bf-3015999c8e64',
						});
					}}
				>
					Pug
				</Button>
			</label>
			{createText('orgId', 'large')}
			<label htmlFor="userId">User Id (userId)</label>
			{createText('userId', 'large')}
			<label htmlFor="fieldId">Context Id (fieldId)</label>
			{createText('fieldId', 'large')}
			{state.product === 'bitbucket' && (
				<label htmlFor="containerId">Repository Id [Optional] (containerId)</label>
			)}
			{state.product !== 'bitbucket' && (
				<label htmlFor="containerId">Container Id [Optional] (containerId)</label>
			)}
			{createText('containerId', 'large')}
			<label htmlFor="objectId">Object Id [Optional] (objectId)</label>
			{createText('objectId', 'large')}
			<label htmlFor="childObjectId">Child Object Id [Optional] (childObjectId)</label>
			{createText('childObjectId', 'large')}
			{createBoolean('includeUsers', 'include Users (includeUsers)')}
			{createBoolean('includeTeams', 'include Teams (includeTeams)')}
			{createBoolean(
				'includeNonLicensedUsers',
				'include Non Licensed Users (includeNonLicensedUsers)',
			)}
			{createBoolean('isPrefetchOn', 'Prefetch')}
			{createBoolean('bootstrapOptions', 'bootstrapOptions')}
			{createBoolean('isMulti', 'isMulti')}
			{createBoolean('isFilterOn', 'filter last selected')}

			{state.product === 'confluence' && (
				<Fragment>
					<h5>Confluence props</h5>
					{createBoolean('includeGroups', 'include Groups (includeGroups)')}
					<div>
						<input
							checked={Boolean(state.confluenceAttributes.isEntitledConfluenceExternalCollaborator)}
							id="includeGuests"
							onChange={(e) => {
								// @ts-ignore
								setState({
									...state,
									confluenceAttributes: {
										...state.confluenceAttributes,
										isEntitledConfluenceExternalCollaborator:
											!state.confluenceAttributes.isEntitledConfluenceExternalCollaborator,
									},
								});
							}}
							type="checkbox"
						/>
						<label htmlFor="includeGuests">include Guests</label>
					</div>
				</Fragment>
			)}

			{state.product === 'bitbucket' && (
				<Fragment>
					<h5>Bitbucket props</h5>
					<label htmlFor="workspaceIds">Workspace Ids (workspaceIds)</label>
					<Textfield
						name="workspaceIds"
						value={state.bitbucketAttributes.workspaceIds || ''}
						onChange={(e) => {
							setState({
								...state,
								bitbucketAttributes: {
									...state.bitbucketAttributes,
									// @ts-ignore
									workspaceIds: e.currentTarget.value,
								},
							});
						}}
					/>
					<label htmlFor="emailDomain">Email domain (emailDomain)</label>
					<Textfield
						name="emailDomain"
						value={state.bitbucketAttributes.emailDomain || ''}
						onChange={(e) => {
							// @ts-ignore
							setState({
								...state,
								bitbucketAttributes: {
									...state.bitbucketAttributes,
									emailDomain: e.currentTarget.value,
								},
							});
						}}
					/>
					<div>
						<input
							checked={Boolean(state.bitbucketAttributes.isPublicRepo)}
							id="isPublicRepo"
							onChange={(e) => {
								// @ts-ignore
								setState({
									...state,
									bitbucketAttributes: {
										...state.bitbucketAttributes,
										isPublicRepo: !state.bitbucketAttributes.isPublicRepo,
									},
								});
							}}
							type="checkbox"
						/>
						<label htmlFor="isPublicRepo">is Public Repository (isPublicRepo)</label>
					</div>
				</Fragment>
			)}
			<hr />
			<label htmlFor="smart-user-picker-example">User Picker</label>
			<AnalyticsListener onEvent={onEvent} channel="fabric-elements">
				<IntlProvider locale={state.locale}>
					<SmartUserPicker
						maxOptions={10}
						isMulti={state.isMulti}
						includeUsers={state.includeUsers}
						includeGroups={state.includeGroups}
						includeTeams={state.includeTeams}
						includeNonLicensedUsers={state.includeNonLicensedUsers}
						fieldId={state.fieldId}
						onChange={onChange}
						onInputChange={onInputChange}
						principalId={state.userId}
						siteId={state.tenantId}
						orgId={state.orgId}
						productKey={state.product}
						objectId={state.objectId}
						containerId={state.containerId}
						childObjectId={state.childObjectId}
						debounceTime={400}
						prefetch={state.isPrefetchOn}
						filterOptions={state.isFilterOn ? filterOptions : undefined}
						bootstrapOptions={state.bootstrapOptions ? options : undefined}
						productAttributes={getProductAttributes(state.product)}
						onError={(e) => {
							console.error(e);
						}}
						overrideByline={overrideByline}
						inputId="smart-user-picker-example"
					/>
				</IntlProvider>
			</AnalyticsListener>
		</div>
	);
};

export default SmartUserPickerCustomizableExample;
