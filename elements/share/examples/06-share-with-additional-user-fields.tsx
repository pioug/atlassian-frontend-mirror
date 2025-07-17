/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**@jsxFrag */

import React, { type PropsWithChildren, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type IconButtonProps } from '@atlaskit/button/new';
import { Field } from '@atlaskit/form';
import WorldIcon from '@atlaskit/icon/core/migration/globe--world';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import SectionMessage from '@atlaskit/section-message';
import Select, { type ValueType } from '@atlaskit/select';
import { type OptionData } from '@atlaskit/smart-user-picker';
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
import { type AdditionalTab, type IntegrationMode } from '../src/types/ShareEntities';

const marginTopStyles = css({ marginTop: 10 });
const fieldsFooterStyles = css({
	marginTop: 8,
	marginBottom: 8,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > *': {
		borderRadius: 0,
	},
});
const styles = xcss({ marginTop: 'space.300', flexGrow: 0, flexBasis: 0, minWidth: '112px' });
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

const WrapperWithMarginTop = ({ children }: PropsWithChildren) => (
	<div css={marginTopStyles}>{children}</div>
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
	chosenConfig: number;
	customButton: boolean;
	customTitle: boolean;
	customHelperMessage: boolean;
	customTooltipText: boolean;
	customTriggerButtonIcon: boolean;
	additionalUserFields: boolean;
	escapeOnKeyPress: boolean;
	restrictionMessage: boolean;
	useUrlShortener: boolean;
	shortLinkData?: ShortenRequest;
	product: ProductName;
	hasHeader: boolean;
	hasFooter: boolean;
	enableSmartUserPicker: boolean;
	hasShareFieldsFooter: boolean;
	isBrowseUsersDisabled: boolean;
	isCopyDisabled: boolean;
	isPublicLink: boolean;
	hasMenu: boolean;
	hasTabs: boolean;
	hasAdditionalTabs: boolean;
	hasSplit: boolean;
	shareIntegrations: Array<Integration>;
	additionalTabs: Array<AdditionalTab>;
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

const FieldsFooterWrapper = ({ children }: PropsWithChildren) => (
	<div css={fieldsFooterStyles}>{children}</div>
);

type SelectOption = {
	label: string;
	value: string;
};

const options: SelectOption[] = [
	{ label: 'Option 1', value: 'option1' },
	{ label: 'Option 2', value: 'option2' },
];

const AdditionalUserFields = () => {
	const [currentOption, setCurrentOption] = useState<SelectOption>(options[0]);

	return (
		<Box xcss={styles}>
			<Field<ValueType<SelectOption>> name="userRole">
				{({ fieldProps: { onChange, ...rest } }) => (
					<Select<SelectOption>
						{...rest}
						onChange={(e) => {
							if (!e) {
								return;
							}
							setCurrentOption(e);
							onChange(e);
						}}
						value={currentOption}
						options={options}
						styles={{
							control: (css: any) => {
								return {
									...css,
									minHeight: '44px',
									height: '100%',
									width: '100%',
								};
							},
						}}
					/>
				)}
			</Field>
		</Box>
	);
};

const ShareFieldsFooter = () => (
	<>
		<FieldsFooterWrapper>
			<SectionMessage appearance="warning">
				<p>This is a sample fields footer for the Share form</p>
			</SectionMessage>
		</FieldsFooterWrapper>
	</>
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

const defaultProps: State = {
	isAutoOpenDialog: false,
	customButton: false,
	customTitle: false,
	customHelperMessage: false,
	chosenConfig: 0,
	customTooltipText: false,
	customTriggerButtonIcon: false,
	additionalUserFields: true,
	restrictionMessage: false,
	useUrlShortener: false,
	shortLinkData: undefined,
	dialogPlacement: dialogPlacementOptions[2].value,
	escapeOnKeyPress: true,
	triggerButtonAppearance: triggerButtonAppearanceOptions[0].value,
	triggerButtonStyle: triggerButtonStyleOptions[0].value,
	triggerButtonTooltipPosition: triggerButtonTooltipPositionOptions[0].value,
	product: 'jira',
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
	const [state, _setState] = useState<State>(defaultProps);

	setBooleanFeatureFlagResolver((name: string) => name === 'share-compiled-migration');

	const share = (
		_content: Content,
		_users: User[],
		_metaData: MetaData,
		_comment?: Comment,
		rest?: { [key: string]: unknown },
	) => {
		console.info('Share', {
			_content,
			_users,
			_metaData,
			_comment,
			...rest,
		});

		return new Promise<ShareResponse>((resolve, reject) => {
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
									productId="jira-software"
									shareAri="ari"
									shareContentType="issue"
									shareContentSubType="subtype"
									shareContentId="contentid"
									shareTitle="My Share"
									shouldCloseOnEscapePress={state.escapeOnKeyPress}
									showFlags={showFlags}
									enableSmartUserPicker={state.enableSmartUserPicker}
									triggerButtonAppearance={state.triggerButtonAppearance}
									triggerButtonIcon={state.customTriggerButtonIcon ? Globe : undefined}
									triggerButtonStyle={state.triggerButtonStyle}
									triggerButtonTooltipPosition={state.triggerButtonTooltipPosition}
									bottomMessage={state.restrictionMessage ? <RestrictionMessage /> : null}
									useUrlShortener={state.useUrlShortener}
									shortLinkData={state.shortLinkData}
									product={state.product}
									onUserSelectionChange={console.log}
									shareFieldsFooter={<ShareFieldsFooter />}
									onDialogOpen={() => {
										console.log('Share Dialog Opened');
									}}
									isCopyDisabled={state.isCopyDisabled}
									isPublicLink={state.isPublicLink}
									integrationMode={state.integrationMode}
									shareIntegrations={state.shareIntegrations}
									isBrowseUsersDisabled={state.isBrowseUsersDisabled}
									isExtendedShareDialogEnabled
									additionalUserFields={<AdditionalUserFields />}
									onSubmit={(formValues) => {
										console.log('formValues', formValues);
									}}
								/>
							</WrapperWithMarginTop>
						</>
					)}
				</App>
			</IntlProvider>
		</AnalyticsListener>
	);
}
