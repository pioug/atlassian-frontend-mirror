import React, { type PropsWithChildren, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type IconButtonProps } from '@atlaskit/button/new';
import WorldIcon from '@atlaskit/icon/core/migration/globe--world';
import Select from '@atlaskit/select';
import { type OptionData } from '@atlaskit/smart-user-picker';
import { ufologger } from '@atlaskit/ufo';
import { userPickerData } from '@atlaskit/util-data-test/user-picker-data';

import App from '../example-helpers/AppWithFlag';
import { type ProductName, ShareDialogContainer } from '../src';
import {
	type ShortenRequest,
	type ShortenResponse,
	type UrlShortenerClient,
} from '../src/clients/AtlassianUrlShortenerClient';
import languages from '../src/i18n/languages';
import {
	type Comment,
	type ConfigResponse,
	type Content,
	type DialogPlacement,
	type Integration,
	type KeysOfType,
	type MetaData,
	type OriginTracing,
	type ShareButtonStyle,
	type ShareClient,
	type ShareResponse,
	type TooltipPosition,
	type User,
} from '../src/types';
import { type IntegrationMode } from '../src/types/ShareEntities';

type UserData = {
	avatarUrl?: string;
	id: string;
	includesYou?: boolean;
	fixed?: boolean;
	lozenge?: string;
	memberCount?: number;
	name: string;
	publicName?: string;
	type?: string;
};

ufologger.enable();

const WrapperWithMarginTop = ({ children }: PropsWithChildren<{}>) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<div style={{ marginTop: 10 }}>{children}</div>
);

const CLOUD_ID = 'abc-123';

let factoryCount = 0;
function originTracingFactory(): OriginTracing {
	factoryCount++;
	const id = `id#${factoryCount}`;
	return {
		id,
		addToUrl: (l: string) => `${l}&atlOrigin=mockAtlOrigin:${id}`,
		toAnalyticsAttributes: () => ({
			originIdGenerated: id,
			originProduct: 'product',
		}),
	};
}

const loadUserOptions = (searchText?: string): OptionData[] => {
	if (!searchText) {
		return userPickerData;
	}

	return userPickerData
		.map((user: UserData) => ({
			...user,
			type: user.type || 'user',
		}))
		.filter((user: UserData) => {
			const searchTextInLowerCase = searchText.toLowerCase();
			const propertyToMatch: KeysOfType<UserData, string | undefined>[] = [
				'id',
				'name',
				'publicName',
			];

			return propertyToMatch.some((property: KeysOfType<UserData, string | undefined>) => {
				const value = property && user[property];
				return !!(value && value.toLowerCase().includes(searchTextInLowerCase));
			});
		});
};

type ExampleState = {
	chosenConfig: number;
	customButton: boolean;
	customTitle: boolean;
	customHelperMessage: boolean;
	customTooltipText: boolean;
	customTriggerButtonIcon: boolean;
	escapeOnKeyPress: boolean;
	restrictionMessage: boolean;
	useUrlShortener: boolean;
	shortLinkData?: ShortenRequest;
	product: ProductName;
	hasFooter: boolean;
	enableSmartUserPicker: boolean;
	hasShareFieldsFooter: boolean;
	isCopyDisabled: boolean;
	isPublicLink: boolean;
	hasTabs: boolean;
	hasSplit: boolean;
	shareIntegrations: Array<Integration>;
	integrationMode: IntegrationMode;
	locales: string[];
	locale: string;
};

type State = {
	isAutoOpenDialog: boolean;
	dialogPlacement: DialogPlacement;
	triggerButtonAppearance: IconButtonProps['appearance'];
	triggerButtonStyle: ShareButtonStyle;
	triggerButtonTooltipPosition: TooltipPosition;
} & ExampleState;

class MockUrlShortenerClient implements UrlShortenerClient {
	count = 0;

	public isSupportedProduct(): boolean {
		return true;
	}

	public shorten(): Promise<ShortenResponse> {
		return new Promise<ShortenResponse>((resolve) => {
			this.count++;
			setTimeout(() => {
				resolve({
					shortUrl: `https://foo.atlassian.net/short#${this.count}`,
				});
			}, 350);
		});
	}
}

const listenerHandler = (event: UIAnalyticsEvent, channel?: string) => {
	// eslint-disable-next-line no-console
	console.log(
		`AnalyticsEvent(${channel})\n\tpayload=%o\n\tcontext=%o`,
		event.payload,
		event.context,
	);
};

const Globe = () => <WorldIcon color="currentColor" spacing="spacious" label="" />;

export default function Example() {
	const defaultProps: State = {
		isAutoOpenDialog: false,
		customButton: false,
		customTitle: false,
		customHelperMessage: false,
		chosenConfig: 0,
		customTooltipText: false,
		customTriggerButtonIcon: false,
		restrictionMessage: false,
		useUrlShortener: false,
		shortLinkData: undefined,
		dialogPlacement: 'bottom-start',
		escapeOnKeyPress: true,
		triggerButtonAppearance: 'default',
		triggerButtonStyle: 'icon-only',
		triggerButtonTooltipPosition: 'top',
		product: 'confluence',
		hasFooter: false,
		enableSmartUserPicker: false,
		hasShareFieldsFooter: false,
		isCopyDisabled: false,
		isPublicLink: false,
		hasTabs: false,
		hasSplit: false,
		integrationMode: 'off',
		shareIntegrations: [],
		locales: Object.keys(languages),
		locale: 'en-US',
	};

	const [state, setState] = useState<State>(defaultProps);

	const shareClient: ShareClient = {
		getConfig: () =>
			new Promise<ConfigResponse>((resolve) => {
				setTimeout(() => {
					resolve({ disableSharingToEmails: false });
				}, 1000);
			}),

		share: (_content: Content, _users: User[], _metaData: MetaData, _comment?: Comment) => {
			console.info('Share', { _content, _users, _metaData, _comment });
			return new Promise<ShareResponse>((resolve, reject) => {
				setTimeout(
					() =>
						reject({
							code: 403,
							reason: 'Forbidden',
							body: Promise.resolve({
								status: 403,
								messages: ['Not allowed'],
								messagesDetails: [
									{
										message: 'Not allowed',
										errorCode: 'example-error-code',
										helpUrl: 'https://example.com',
									},
								],
							}),
						}),
					1000,
				);
			});
		},
	};

	const urlShortenerClient: UrlShortenerClient = new MockUrlShortenerClient();

	const localeOptions = state.locales.map((l) => ({
		label: l,
		value: l,
	}));

	return (
		<AnalyticsListener onEvent={listenerHandler} channel="fabric-elements">
			<IntlProvider locale={state.locale}>
				<App>
					{(showFlags) => (
						<>
							<h4>Share Component</h4>
							<WrapperWithMarginTop>
								<ShareDialogContainer
									isAutoOpenDialog={state.isAutoOpenDialog}
									shareClient={shareClient}
									urlShortenerClient={urlShortenerClient}
									cloudId={CLOUD_ID}
									dialogPlacement={state.dialogPlacement}
									loadUserOptions={loadUserOptions}
									originTracingFactory={originTracingFactory}
									productId="confluence"
									shareAri="ari"
									shareContentType="issue"
									shareFormTitle={state.customTitle ? 'Custom Title' : undefined}
									shareTitle="My Share"
									shouldCloseOnEscapePress={state.escapeOnKeyPress}
									showFlags={showFlags}
									enableSmartUserPicker={state.enableSmartUserPicker}
									triggerButtonAppearance={state.triggerButtonAppearance}
									triggerButtonIcon={state.customTriggerButtonIcon ? Globe : undefined}
									triggerButtonStyle={state.triggerButtonStyle}
									triggerButtonTooltipText={
										state.customTooltipText ? 'Custom Tooltip Text' : undefined
									}
									triggerButtonTooltipPosition={state.triggerButtonTooltipPosition}
									useUrlShortener={state.useUrlShortener}
									shortLinkData={state.shortLinkData}
									product={state.product}
									onUserSelectionChange={console.log}
									onDialogOpen={() => {
										console.log('Share Dialog Opened');
									}}
									isCopyDisabled={state.isCopyDisabled}
									isPublicLink={state.isPublicLink}
									integrationMode={state.integrationMode}
									shareIntegrations={state.shareIntegrations}
								/>
							</WrapperWithMarginTop>
							<h4>Options</h4>
							<div>
								<WrapperWithMarginTop>
									Locale (error messages have no i18n)
									<Select
										value={{
											label: state.locale,
											value: state.locale,
										}}
										options={localeOptions}
										onChange={(option: any) =>
											setState({
												...state,
												locale: option.value,
											})
										}
									/>
								</WrapperWithMarginTop>
							</div>
						</>
					)}
				</App>
			</IntlProvider>
		</AnalyticsListener>
	);
}
