/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**@jsxFrag */

import React, { type PropsWithChildren, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type IconButtonProps } from '@atlaskit/button/new';
import WorldIcon from '@atlaskit/icon/core/migration/globe--world';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import SectionMessage from '@atlaskit/section-message';
import Select from '@atlaskit/select';
import { type OptionData } from '@atlaskit/smart-user-picker';
import Toggle from '@atlaskit/toggle';
import { ufologger } from '@atlaskit/ufo';
import { userPickerData } from '@atlaskit/util-data-test/user-picker-data';

import App from '../example-helpers/AppWithFlag';
import RestrictionMessage from '../example-helpers/RestrictionMessage';
import { type ProductName, ShareDialogContainer } from '../src';
import {
	type ShortenRequest,
	type ShortenResponse,
	type UrlShortenerClient,
} from '../src/clients/AtlassianUrlShortenerClient';
import SlackIcon from '../src/components/colorSlackIcon';
import languages from '../src/i18n/languages';
import {
	type Comment,
	type ConfigResponse,
	type Content,
	type ContentProps,
	type DialogPlacement,
	type Integration,
	type KeysOfType,
	type MetaData,
	type OriginTracing,
	type RenderCustomTriggerButton,
	type ShareButtonStyle,
	type ShareClient,
	type ShareResponse,
	type TooltipPosition,
	type User,
} from '../src/types';
import { type AdditionalTab, type IntegrationMode } from '../src/types/ShareEntities';

type UserData = {
	avatarUrl?: string;
	fixed?: boolean;
	id: string;
	includesYou?: boolean;
	lozenge?: string;
	memberCount?: number;
	name: string;
	publicName?: string;
	type?: string;
};

ufologger.enable();

const WrapperWithMarginTop = ({ children }: PropsWithChildren<{}>) => (
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	<div css={{ marginTop: 10 }}>{children}</div>
);

const JDOG_CLOUD_ID = '49d8b9d6-ee7d-4931-a0ca-7fcae7d1c3b5';

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

interface DialogPlacementOption {
	label: string;
	value: State['dialogPlacement'];
}

const dialogPlacementOptions: Array<DialogPlacementOption> = [
	{ label: 'bottom-end', value: 'bottom-end' },
	{ label: 'bottom', value: 'bottom' },
	{ label: 'bottom-start', value: 'bottom-start' },
	{ label: 'top-start', value: 'top-start' },
	{ label: 'top', value: 'top' },
	{ label: 'top-end', value: 'top-end' },
	{ label: 'right-start', value: 'right-start' },
	{ label: 'right', value: 'right' },
	{ label: 'right-end', value: 'right-end' },
	{ label: 'left-start', value: 'left-start' },
	{ label: 'left', value: 'left' },
	{ label: 'left-end', value: 'left-end' },
];

interface ConfigOption {
	label: string;
	value: ConfigResponse;
}

const configOptions: Array<ConfigOption> = [
	{ label: 'Email sharing allowed', value: { disableSharingToEmails: false } },
	{ label: 'Email sharing disabled', value: { disableSharingToEmails: true } },
	{ label: 'No value for email sharing', value: {} },
];

interface TriggerButtonAppearanceOption {
	label: string;
	value: State['triggerButtonAppearance'];
}

const triggerButtonAppearanceOptions: Array<TriggerButtonAppearanceOption> = [
	{ label: 'default', value: 'default' },
	{ label: 'primary', value: 'primary' },
];

interface TriggerButtonStyleOption {
	label: string;
	value: State['triggerButtonStyle'];
}

const triggerButtonStyleOptions: Array<TriggerButtonStyleOption> = [
	{ label: 'icon-only', value: 'icon-only' },
	{ label: 'icon-with-text', value: 'icon-with-text' },
	{ label: 'text-only', value: 'text-only' },
];

interface TriggerPositionOption {
	label: string;
	value: State['triggerButtonTooltipPosition'];
}

const triggerButtonTooltipPositionOptions: Array<TriggerPositionOption> = [
	{ label: 'top', value: 'top' },
	{ label: 'left', value: 'left' },
	{ label: 'bottom', value: 'bottom' },
	{ label: 'right', value: 'right' },
	{ label: 'mouse', value: 'mouse' },
];

type ExampleState = {
	additionalTabs: Array<AdditionalTab>;
	chosenConfig: number;
	customButton: boolean;
	customHelperMessage: boolean;
	customTitle: boolean;
	customTooltipText: boolean;
	customTriggerButtonIcon: boolean;
	enableSmartUserPicker: boolean;
	escapeOnKeyPress: boolean;
	hasAdditionalTabs: boolean;
	hasFooter: boolean;
	hasHeader: boolean;
	hasMenu: boolean;
	hasShareFieldsFooter: boolean;
	hasSplit: boolean;
	hasTabs: boolean;
	integrationMode: IntegrationMode;
	isBrowseUsersDisabled: boolean;
	isCopyDisabled: boolean;
	isPublicLink: boolean;
	locale: string;
	locales: string[];
	product: ProductName;
	restrictionMessage: boolean;
	shareIntegrations: Array<Integration>;
	shortLinkData?: ShortenRequest;
	useUrlShortener: boolean;
};

type State = {
	dialogPlacement: DialogPlacement;
	isAutoOpenDialog: boolean;
	triggerButtonAppearance: IconButtonProps['appearance'];
	triggerButtonStyle: ShareButtonStyle;
	triggerButtonTooltipPosition: TooltipPosition;
} & ExampleState;

const renderCustomTriggerButton: RenderCustomTriggerButton = ({ onClick }, { ...triggerProps }) => (
	// @ts-ignore
	<button onClick={onClick} {...triggerProps}>
		Custom Button
	</button>
);

const FooterWrapper = ({ children }: PropsWithChildren<{}>) => (
	<div
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		css={{
			marginTop: 8,
			'& > *': {
				borderRadius: 0,
			},
		}}
	>
		{children}
	</div>
);

const FieldsFooterWrapper = ({ children }: PropsWithChildren<{}>) => (
	<div
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		css={{
			marginTop: 8,
			marginBottom: 8,
			'& > *': {
				borderRadius: 0,
			},
		}}
	>
		{children}
	</div>
);

const CustomHeader = () => (
	<SectionMessage appearance="discovery" title="Header">
		<p>This is a sample header for the Share dialog</p>
	</SectionMessage>
);

const CustomFooter = () => (
	<FooterWrapper>
		<SectionMessage appearance="information" title="Footer">
			<p>This is a sample footer for the Share dialog</p>
		</SectionMessage>
	</FooterWrapper>
);

const ShareFieldsFooter = () => (
	<FieldsFooterWrapper>
		<SectionMessage appearance="warning">
			<p>This is a sample fields footer for the Share form</p>
		</SectionMessage>
	</FieldsFooterWrapper>
);
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

const IntegrationContent = (props: ContentProps) => {
	return (
		<>
			<div>Share to Integration form</div>
			{/* eslint-disable-next-line @atlassian/a11y/anchor-is-valid */}
			{fg('dst-a11y__replace-anchor-with-link__people-and-tea') ? (
				// eslint-disable-next-line @atlassian/a11y/anchor-is-valid
				<Link
					href="#"
					onClick={() => {
						props?.changeTab?.(0);
					}}
				>
					Change tab
				</Link>
			) : (
				// eslint-disable-next-line @atlaskit/design-system/no-html-anchor, @atlassian/a11y/anchor-is-valid
				<a
					href="#"
					onClick={() => {
						props?.changeTab?.(0);
					}}
				>
					Change tab
				</a>
			)}
		</>
	);
};

const AdditionalTabContent = (props: ContentProps) => (
	<>
		<div>This is a custom tab in the share dialog</div>
		{/* eslint-disable-next-line @atlassian/a11y/anchor-is-valid */}
		{fg('dst-a11y__replace-anchor-with-link__people-and-tea') ? (
			// eslint-disable-next-line @atlassian/a11y/anchor-is-valid
			<Link
				href="#"
				onClick={() => {
					props?.changeTab?.(0);
				}}
			>
				Change tab
			</Link>
		) : (
			// eslint-disable-next-line @atlaskit/design-system/no-html-anchor, @atlassian/a11y/anchor-is-valid
			<a
				href="#"
				onClick={() => {
					props?.changeTab?.(0);
				}}
			>
				Change tab
			</a>
		)}
	</>
);

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
	dialogPlacement: dialogPlacementOptions[2].value,
	escapeOnKeyPress: true,
	triggerButtonAppearance: triggerButtonAppearanceOptions[0].value,
	triggerButtonStyle: triggerButtonStyleOptions[0].value,
	triggerButtonTooltipPosition: triggerButtonTooltipPositionOptions[0].value,
	product: 'confluence',
	hasHeader: false,
	hasFooter: false,
	enableSmartUserPicker: false,
	hasShareFieldsFooter: false,
	isBrowseUsersDisabled: false,
	isCopyDisabled: false,
	isPublicLink: false,
	hasTabs: false,
	hasSplit: false,
	hasMenu: false,
	integrationMode: 'off',
	hasAdditionalTabs: false,
	additionalTabs: [],
	shareIntegrations: [],
	locales: Object.keys(languages),
	locale: 'en-US',
};

const Globe = () => <WorldIcon color="currentColor" spacing="spacious" label="" />;

export default function Example() {
	const [state, setState] = useState<State>(defaultProps);

	const share = (_content: Content, _users: User[], _metaData: MetaData, _comment?: Comment) => {
		console.info('Share', {
			_content,
			_users,
			_metaData,
			_comment,
		});

		return new Promise<ShareResponse>((resolve) => {
			setTimeout(
				() =>
					resolve({
						shareRequestId: 'c41e33e5-e622-4b38-80e9-a623c6e54cdd',
					}),
				2000,
			);
		});
	};

	const shareClient: ShareClient = {
		getConfig: () =>
			new Promise<ConfigResponse>((resolve) => {
				setTimeout(() => {
					resolve(configOptions[state.chosenConfig].value);
				}, 1000);
			}),
		share: share,
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
									// Allow the example to refresh when this config changes
									key={configOptions[state.chosenConfig].label}
									isAutoOpenDialog={state.isAutoOpenDialog}
									shareClient={shareClient}
									urlShortenerClient={urlShortenerClient}
									cloudId={JDOG_CLOUD_ID}
									dialogPlacement={state.dialogPlacement}
									loadUserOptions={loadUserOptions}
									originTracingFactory={originTracingFactory}
									productId="confluence"
									renderCustomTriggerButton={
										state.customButton ? renderCustomTriggerButton : undefined
									}
									shareAri="ari"
									shareContentType="issue"
									shareContentSubType="subtype"
									shareContentId="contentid"
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
									bottomMessage={state.restrictionMessage ? <RestrictionMessage /> : null}
									useUrlShortener={state.useUrlShortener}
									shortLinkData={state.shortLinkData}
									product={state.product}
									customHeader={state.hasHeader ? <CustomHeader /> : undefined}
									customFooter={state.hasFooter ? <CustomFooter /> : undefined}
									onUserSelectionChange={console.log}
									shareFieldsFooter={state.hasShareFieldsFooter ? <ShareFieldsFooter /> : undefined}
									onDialogOpen={() => {
										console.log('Share Dialog Opened');
									}}
									isCopyDisabled={state.isCopyDisabled}
									isPublicLink={state.isPublicLink}
									integrationMode={state.integrationMode}
									additionalTabs={state.hasAdditionalTabs ? state.additionalTabs : undefined}
									shareIntegrations={state.shareIntegrations}
									shareFormHelperMessage={
										state.customHelperMessage ? 'Custom Helper Message' : undefined
									}
									isBrowseUsersDisabled={state.isBrowseUsersDisabled}
								/>
							</WrapperWithMarginTop>
							<h4>Options</h4>
							<div>
								<WrapperWithMarginTop>
									<h5>Recipient controls</h5>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Product (groups are not enabled in Jira)
									<Select
										value={{
											label: state.product,
											value: state.product,
										}}
										options={[
											{ label: 'confluence', value: 'confluence' },
											{ label: 'jira', value: 'jira' },
										]}
										onChange={(option: any) =>
											setState({
												...state,
												product: option.value,
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Is Browse Users Disabled
									<Toggle
										isChecked={state.isBrowseUsersDisabled}
										onChange={() =>
											setState({
												...state,
												isBrowseUsersDisabled: !state.isBrowseUsersDisabled,
											})
										}
									/>
									(if true, only emails can be selected)
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Share config (controls whether emails are available)
									<Select
										value={configOptions[state.chosenConfig]}
										options={configOptions}
										onChange={(config: ConfigOption | null) => {
											setState({
												...state,
												chosenConfig:
													configOptions.findIndex((option) => option.label === config?.label) || 0,
											});
										}}
									/>
								</WrapperWithMarginTop>
								<h5>Features controls</h5>
								<WrapperWithMarginTop>
									Enable Integration Tabs
									<Toggle
										isChecked={state.hasTabs}
										onChange={() =>
											setState({
												...state,
												hasTabs: !state.hasTabs,
												hasSplit: false,
												hasMenu: false,
												integrationMode: state.integrationMode !== 'tabs' ? 'tabs' : 'off',
												shareIntegrations: [
													{
														type: 'Slack',
														Icon: SlackIcon,
														Content: IntegrationContent,
													},
												],
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Enable Additional Tabs
									<Toggle
										isChecked={state.hasTabs && state.hasAdditionalTabs}
										isDisabled={!state.hasTabs}
										onChange={() =>
											setState({
												...state,
												hasAdditionalTabs: !state.hasAdditionalTabs,
												additionalTabs: [
													{
														label: 'Custom Tab',
														Content: AdditionalTabContent,
													},
												],
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Enable Integration Split Button
									<Toggle
										isChecked={state.hasSplit}
										onChange={() =>
											setState({
												...state,
												hasTabs: false,
												hasMenu: false,
												hasSplit: !state.hasSplit,
												integrationMode: state.integrationMode !== 'split' ? 'split' : 'off',
												shareIntegrations: [
													{
														type: 'Slack',
														Icon: SlackIcon,
														Content: IntegrationContent,
													},
												],
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Enable Integration Menu Button
									<Toggle
										isChecked={state.hasMenu}
										onChange={() =>
											setState({
												...state,
												hasTabs: false,
												hasSplit: false,
												hasMenu: !state.hasMenu,
												integrationMode: state.integrationMode !== 'menu' ? 'menu' : 'off',
												shareIntegrations: [
													{
														type: 'Slack',
														Icon: SlackIcon,
														Content: IntegrationContent,
													},
												],
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Is Public Link
									<Toggle
										isChecked={state.isPublicLink}
										onChange={() => setState({ ...state, isPublicLink: !state.isPublicLink })}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Is Copy Disabled
									<Toggle
										isChecked={state.isCopyDisabled}
										onChange={() =>
											setState({
												...state,
												isCopyDisabled: !state.isCopyDisabled,
											})
										}
									/>
								</WrapperWithMarginTop>
								<h5>Custom UI components</h5>
								<WrapperWithMarginTop>
									Custom Share Dialog Trigger Button
									<Toggle
										isChecked={state.customButton}
										onChange={() => setState({ ...state, customButton: !state.customButton })}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Custom Share Dialog Title
									<Toggle
										isChecked={state.customTitle}
										onChange={() => setState({ ...state, customTitle: !state.customTitle })}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Custom Share Form Helper Message
									<Toggle
										isChecked={state.customHelperMessage}
										onChange={() =>
											setState({
												...state,
												customHelperMessage: !state.customHelperMessage,
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Custom Trigger Button Tooltip Text
									<Toggle
										isChecked={state.customTooltipText}
										onChange={() =>
											setState({
												...state,
												customTooltipText: !state.customTooltipText,
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Custom Trigger Button Icon
									<Toggle
										isChecked={state.customTriggerButtonIcon}
										onChange={() =>
											setState({
												...state,
												customTriggerButtonIcon: !state.customTriggerButtonIcon,
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Show Restriction Message
									<Toggle
										isChecked={state.restrictionMessage}
										onChange={() =>
											setState({
												...state,
												restrictionMessage: !state.restrictionMessage,
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Custom Header
									<Toggle
										isChecked={state.hasHeader}
										onChange={() => setState({ ...state, hasHeader: !state.hasHeader })}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Custom Footer
									<Toggle
										isChecked={state.hasFooter}
										onChange={() => setState({ ...state, hasFooter: !state.hasFooter })}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Share Fields Footer
									<Toggle
										isChecked={state.hasShareFieldsFooter}
										onChange={() =>
											setState({
												...state,
												hasShareFieldsFooter: !state.hasShareFieldsFooter,
											})
										}
									/>
								</WrapperWithMarginTop>
								<h5>URL shortening</h5>
								<WrapperWithMarginTop>
									Use URL shortener
									<Toggle
										isChecked={!!state.shortLinkData}
										onChange={() =>
											setState({
												...state,
												shortLinkData: state.shortLinkData
													? undefined
													: {
															product: state.product,
															type: 'test',
															params: { x: 'a' },
														},
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Use URL shortener legacy API
									<Toggle
										isChecked={state.useUrlShortener}
										onChange={() =>
											setState({
												...state,
												useUrlShortener: !state.useUrlShortener,
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Auto open dialog
									<Toggle
										isChecked={state.isAutoOpenDialog}
										onChange={() => {
											// Because the onFocus of this toggle, the `@atlaskit/popup` dialog
											// closes itself right after it's opened, when the focus is shifted.
											setTimeout(() => {
												setState({
													...state,
													isAutoOpenDialog: !state.isAutoOpenDialog,
												});
											}, 150);
										}}
									/>
								</WrapperWithMarginTop>
								<h5>Core behavioural settings</h5>
								<WrapperWithMarginTop>
									Enable Smart User Picker
									<Toggle
										isChecked={state.enableSmartUserPicker}
										onChange={() =>
											setState({
												...state,
												enableSmartUserPicker: !state.enableSmartUserPicker,
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Dialog Placement
									<Select
										value={dialogPlacementOptions.find(
											(option) => option.value === state.dialogPlacement,
										)}
										options={dialogPlacementOptions}
										onChange={(option: any) =>
											setState({ ...state, dialogPlacement: option.value })
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Close Share Dialog on escape key press
									<Toggle
										isChecked={state.escapeOnKeyPress}
										onChange={() =>
											setState({
												...state,
												escapeOnKeyPress: !state.escapeOnKeyPress,
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Trigger Button Style
									<Select<TriggerButtonStyleOption>
										value={{
											label: state.triggerButtonStyle,
											value: state.triggerButtonStyle,
										}}
										options={triggerButtonStyleOptions}
										onChange={(option: any) =>
											setState({ ...state, triggerButtonStyle: option.value })
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Trigger Button Appearance
									<Select<TriggerButtonAppearanceOption>
										value={{
											label: state.triggerButtonAppearance ?? 'default',
											value: state.triggerButtonAppearance ?? 'default',
										}}
										options={triggerButtonAppearanceOptions}
										onChange={(option: any) =>
											setState({
												...state,
												triggerButtonAppearance: option.value,
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Trigger Button Tooltip Position
									<Select<TriggerPositionOption>
										value={{
											label: state.triggerButtonTooltipPosition,
											value: state.triggerButtonTooltipPosition,
										}}
										options={triggerButtonTooltipPositionOptions}
										onChange={(option: any) =>
											setState({
												...state,
												triggerButtonTooltipPosition: option.value,
											})
										}
									/>
								</WrapperWithMarginTop>
								<WrapperWithMarginTop>
									Locale
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
