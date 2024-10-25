jest.mock('../../../components/utils', () => ({
	getMenuPortalTargetCurrentHTML: jest.fn(),
	allowEmails: (config: ConfigResponse) => !(config && config.disableSharingToEmails),
}));

import React from 'react';

import { render as renderRTL, screen } from '@testing-library/react';
import { mount, shallow } from 'enzyme';
import { FormattedMessage, IntlProvider, type MessageDescriptor } from 'react-intl-next';

import { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import SmartUserPicker, { type OptionData } from '@atlaskit/smart-user-picker';
import UserPicker, { type ExternalUser, type Team, type User } from '@atlaskit/user-picker';

import { type Props, REQUIRED, UserPickerField } from '../../../components/UserPickerField';
import { getMenuPortalTargetCurrentHTML } from '../../../components/utils';
import { messages } from '../../../i18n';
import { type ConfigResponse, type UserPickerOptions } from '../../../types';
import { type ProductName } from '../../../types/Products';
import { renderProp } from '../_testUtils';

const mockFormatMessage = (descriptor: any) => descriptor.defaultMessage;
const mockIntl = { formatMessage: mockFormatMessage };

jest.mock('react-intl-next', () => {
	return {
		...(jest.requireActual('react-intl-next') as any),
		FormattedMessage: (descriptor: any) => <span>{descriptor.defaultMessage}</span>,
		injectIntl: (Node: any) => (props: any) => <Node {...props} intl={mockIntl} />,
		useIntl: jest.fn().mockReturnValue({
			locale: 'en',
			formatMessage: (descriptor: any) => descriptor.defaultMessage,
		}),
	};
});

type Scenario = {
	product: ProductName;
	isBrowseUsersDisabled: boolean;
	disableSharingToEmails: boolean;
};

type ScenarioAndOutcome<T> = [string, Scenario, T];

const NO_EMAIL_JIRA: [string, Scenario] = [
	'email disabled in Jira',
	{
		product: 'jira',
		isBrowseUsersDisabled: false,
		disableSharingToEmails: true,
	},
];
const NO_EMAIL_CONFLUENCE: [string, Scenario] = [
	'email disabled in Confluence',
	{
		product: 'confluence',
		isBrowseUsersDisabled: false,
		disableSharingToEmails: true,
	},
];
const NO_BROWSE_JIRA: [string, Scenario] = [
	'browse users is disabled Jira',
	{
		product: 'jira',
		isBrowseUsersDisabled: true,
		disableSharingToEmails: false,
	},
];
const NO_BROWSE_CONFLUENCE: [string, Scenario] = [
	'browse users is disabled Confluence',
	{
		product: 'confluence',
		isBrowseUsersDisabled: true,
		disableSharingToEmails: false,
	},
];
const REGULAR_JIRA: [string, Scenario] = [
	'in Jira',
	{
		product: 'jira',
		isBrowseUsersDisabled: false,
		disableSharingToEmails: false,
	},
];
const REGULAR_CONFLUENCE: [string, Scenario] = [
	'in Confluence',
	{
		product: 'confluence',
		isBrowseUsersDisabled: false,
		disableSharingToEmails: false,
	},
];

const user: User = { id: '1', name: 'user', isExternal: false };
const externalUser: ExternalUser = {
	id: '2',
	name: 'externalUser',
	isExternal: true,
	sources: [],
};
const team: Team = { id: '3', name: 'team', type: 'team' };

describe('UserPickerField', () => {
	const render = (userPickerFieldProps: Props, ...args: any[]) => {
		const component = shallow(<UserPickerField {...userPickerFieldProps} />)
			.dive()
			.find(Field);
		const userPicker = renderProp(component, 'children', ...args);

		return { component, userPicker };
	};

	const renderUserPicker = (userPickerFieldProps: Props, ...args: any[]) => {
		return render(userPickerFieldProps, ...args).userPicker;
	};

	const renderUserPickerRTL = (userPickerFieldProps: Props) => {
		return renderRTL(
			<IntlProvider locale="en">
				<UserPickerField {...userPickerFieldProps} />
			</IntlProvider>,
		);
	};

	afterEach(() => {
		(getMenuPortalTargetCurrentHTML as jest.Mock).mockClear();
	});

	it.each<[ProductName, string]>([
		['jira', 'Recipients will see the name of the roadmap and your message'],
		['confluence', 'Recipients will see the name of the board and your message'],
	])(
		'should render UserPicker when product is %s and helperMessage is available',
		(product, helperMessage) => {
			const fieldProps = {
				onChange: jest.fn(),
				value: [],
			};
			const loadOptions = jest.fn();

			const field = renderUserPicker(
				{
					loadOptions,
					isLoading: true,
					product,
					helperMessage,
				},
				{ fieldProps, meta: { valid: true } },
			);

			const fieldHelperMessage = field.find(HelperMessage);

			expect(fieldHelperMessage).toHaveLength(1);
			expect(fieldHelperMessage.html()).toEqual(expect.stringContaining(helperMessage));
		},
	);

	describe.each<ProductName>(['jira', 'confluence'])(
		'should render UserPicker in %s',
		(product) => {
			it('without HelperMessage when helperMessage is defined empty', () => {
				const fieldProps = {
					onChange: jest.fn(),
					value: [],
				};
				const loadOptions = jest.fn();

				const field = renderUserPicker(
					{
						loadOptions,
						isLoading: true,
						product,
						helperMessage: '',
					},
					{ fieldProps, meta: { valid: true } },
				);

				const fieldHelperMessage = field.find(HelperMessage);

				expect(fieldHelperMessage).toHaveLength(0);
			});

			const helperMessage = {
				jira: 'Recipients will see the name of the issue and your message',
				confluence: 'Recipients will see the name of the page and your message',
			};

			it('with default HelperMessage when helperMessage is not defined', () => {
				const fieldProps = {
					onChange: jest.fn(),
					value: [],
				};
				const loadOptions = jest.fn();

				const field = renderUserPicker(
					{
						loadOptions,
						isLoading: true,
						product,
					},
					{ fieldProps, meta: { valid: true } },
				);

				const fieldHelperMessage = field.find(HelperMessage);

				expect(fieldHelperMessage).toHaveLength(1);
				expect(fieldHelperMessage.html()).toEqual(expect.stringContaining(helperMessage[product]));
			});

			it('with appropriate defaultValue', () => {
				const defaultValue: OptionData[] = [];
				const loadOptions = jest.fn();
				const component = mount(
					<UserPickerField
						loadOptions={loadOptions}
						defaultValue={defaultValue}
						product={product}
					/>,
				);
				expect(component.find(Field).prop('defaultValue')).toBe(defaultValue);
			});
		},
	);

	describe('labels and placeholders', () => {
		const labelScenarios: ScenarioAndOutcome<MessageDescriptor[]>[] = [
			[
				...NO_EMAIL_JIRA,
				[
					messages.userPickerLabelEmailDisabledJira,
					messages.userPickerPlaceholderEmailDisabledJira,
					messages.infoMessageDefaultJira,
				],
			],
			// The same placeholder is used in Confluence for "email disabled" or not, as the placeholder does not call out email due to copy length
			[
				...NO_EMAIL_CONFLUENCE,
				[
					messages.userPickerLabelEmailDisabledConfluence,
					messages.userPickerPlaceholderConfluence,
					messages.infoMessageDefaultConfluence,
				],
			],
			[
				...NO_BROWSE_JIRA,
				[
					messages.userPickerLabelBrowseUsersDisabled,
					messages.userPickerPlaceholderBrowseUsersDisabled,
					messages.infoMessageDefaultJira,
				],
			],
			[
				...NO_BROWSE_CONFLUENCE,
				[
					messages.userPickerLabelBrowseUsersDisabled,
					messages.userPickerPlaceholderBrowseUsersDisabled,
					messages.infoMessageDefaultConfluence,
				],
			],
			[
				...REGULAR_JIRA,
				[
					messages.userPickerLabelJira,
					messages.userPickerPlaceholderJira,
					messages.infoMessageDefaultJira,
				],
			],
			[
				...REGULAR_CONFLUENCE,
				[
					messages.userPickerLabelConfluence,
					messages.userPickerPlaceholderConfluence,
					messages.infoMessageDefaultConfluence,
				],
			],
		];

		it.each<ScenarioAndOutcome<MessageDescriptor[]>>(labelScenarios)(
			'should show correct label and placeholder when %s',
			async (_case: string, props, expectedMessages: MessageDescriptor[]) => {
				const [label, placeholder, info] = expectedMessages;
				const loadOptions = jest.fn();
				renderUserPickerRTL({
					loadOptions,
					isLoading: true,
					product: props.product,
					config: { disableSharingToEmails: props.disableSharingToEmails },
					isBrowseUsersDisabled: props.isBrowseUsersDisabled,
				});

				// Find info message
				expect(await screen.findByText(info.defaultMessage as string)).toBeInTheDocument();

				// Check no error messages
				expect(screen.queryByText("You can't do that")).not.toBeInTheDocument();

				// Check for field label
				expect(await screen.findByText(label.defaultMessage as string)).toBeInTheDocument();

				// Verify expected placeholder
				expect(await screen.findByText(placeholder.defaultMessage as string)).toBeInTheDocument();
			},
		);
	});

	it('should not call loadUsers on empty query', () => {
		const loadOptions = jest.fn();
		const fieldProps = {
			onChange: jest.fn(),
			value: [],
		};
		const field = renderUserPicker(
			{ loadOptions, product: 'confluence' },
			{ fieldProps, meta: { valid: true } },
		);

		const userPicker = field.find(UserPicker);
		expect(userPicker).toHaveLength(1);
		userPicker.simulate('loadOptions', '');
		expect(loadOptions).not.toHaveBeenCalled();
	});

	describe('smart user picker enabled', () => {
		it('should render smart user picker', () => {
			const cloudId = 'cloud-id';
			const orgId = 'org-id';

			const fieldProps = {
				onChange: jest.fn(),
				value: [],
			};
			const loadOptions = jest.fn();
			const field = renderUserPicker(
				{
					loadOptions,
					product: 'jira',
					enableSmartUserPicker: true,
					cloudId,
					orgId,
				},
				{ fieldProps, meta: { valid: true } },
			);

			const smartUserPicker = field.find(SmartUserPicker);
			expect(smartUserPicker).toHaveLength(1);
			expect(smartUserPicker.prop('siteId')).toBe(cloudId);
			expect(smartUserPicker.prop('orgId')).toBe(orgId);
			expect(smartUserPicker.prop('includeTeams')).toBe(true);
			expect(smartUserPicker.prop('includeGroups')).toBe(true);
		});
	});

	describe('validate function', () => {
		it.each<[string | undefined, { id: string }[] | null]>([
			['REQUIRED', []],
			['REQUIRED', null],
			[undefined, [{ id: 'some-id' }]],
		])('should return "%s" when called with %p', (expected, value) => {
			const loadOptions = jest.fn();
			const component = mount(<UserPickerField loadOptions={loadOptions} product="confluence" />);
			const validate = component.find(Field).prop('validate');
			expect(validate(value)).toEqual(expected);
		});
	});

	const errorMessageScenarios: ScenarioAndOutcome<MessageDescriptor>[] = [
		[...NO_EMAIL_JIRA, messages.userPickerRequiredMessageEmailDisabledJira],
		[...NO_EMAIL_CONFLUENCE, messages.userPickerRequiredMessageEmailDisabledConfluence],
		[...NO_BROWSE_JIRA, messages.userPickerRequiredMessageBrowseUsersDisabled],
		[...NO_BROWSE_CONFLUENCE, messages.userPickerRequiredMessageBrowseUsersDisabled],
		[...REGULAR_JIRA, messages.userPickerRequiredMessageJira],
		[...REGULAR_CONFLUENCE, messages.userPickerRequiredMessageConfluence],
	];

	describe('error messages', () => {
		it.each<ScenarioAndOutcome<MessageDescriptor>>(errorMessageScenarios)(
			'should show correct error message when %s',
			(_case: string, props, expectedMessage: MessageDescriptor) => {
				const fieldProps = {
					onChange: jest.fn(),
					value: [],
				};
				const loadOptions = jest.fn();
				const errorMessage = renderUserPicker(
					{
						loadOptions,
						product: props.product,
						config: { disableSharingToEmails: props.disableSharingToEmails },
						isBrowseUsersDisabled: props.isBrowseUsersDisabled,
					},
					{
						fieldProps,
						meta: { valid: false },
						error: REQUIRED,
					},
				).find(ErrorMessage);

				expect(errorMessage).toHaveLength(1);
				const message = errorMessage.find(FormattedMessage);
				expect(message).toHaveLength(1);
				expect(message.props()).toMatchObject(expectedMessage);
			},
		);

		it.each<ProductName>(['confluence', 'jira'])(
			'should show error messages when %s',
			async (product: ProductName) => {
				const loadOptions = jest.fn();
				renderUserPickerRTL({
					loadOptions,
					product,
					shareError: {
						message: "You can't do that",
						errorCode: 'some-error-code',
						helpUrl: 'https://example.com',
						retryable: false,
					},
				});

				expect(await screen.findByText("You can't do that")).toBeInTheDocument();

				expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
			},
		);
	});

	describe('invite warning', () => {
		const setUpInviteWarningTest = (product: ProductName = 'confluence', isPublicLink = false) => {
			const loadOptions = jest.fn();
			const fieldProps = {
				onChange: jest.fn(),
				value: [],
			};
			const component = renderUserPicker(
				{
					loadOptions,
					config: { disableSharingToEmails: true },
					product,
					isPublicLink,
				},
				{
					fieldProps,
					meta: { valid: true },
				},
			);
			return {
				loadOptions,
				fieldProps,
				component,
			};
		};

		it('should display warning message when product is confluence', () => {
			const { component } = setUpInviteWarningTest();

			const helperMessage = component.find(HelperMessage);
			expect(helperMessage).toHaveLength(1);

			const message = helperMessage.find(FormattedMessage);
			expect(message).toHaveLength(1);
			expect(message.props()).toMatchObject(messages.infoMessageDefaultConfluence);
		});

		it('should display warning message when product is jira', () => {
			const { component } = setUpInviteWarningTest('jira');

			const helperMessage = component.find(HelperMessage);
			expect(helperMessage).toHaveLength(1);

			const message = helperMessage.find(FormattedMessage);
			expect(message).toHaveLength(1);
			expect(message.props()).toMatchObject(messages.infoMessageDefaultJira);
		});

		it('should not display warning message if public link is on', () => {
			const { component } = setUpInviteWarningTest('confluence', true);

			const helperMessage = component.find(HelperMessage);
			expect(helperMessage).toHaveLength(0);
		});
	});

	describe('onUserInputChanged prop', () => {
		it('should be called when user pickers field input changes', () => {
			const fieldProps = {
				onChange: jest.fn(),
				value: [],
			};
			const onInputChange = jest.fn();
			const field = renderUserPicker(
				{ onInputChange, product: 'confluence' },
				{ fieldProps, meta: { valid: true } },
			);

			const userPicker = field.find(UserPicker);
			userPicker.simulate('inputChange', 'some text');
			expect(onInputChange).toHaveBeenCalledTimes(1);
		});
	});

	describe('when sharing to emails is disabled', () => {
		it('should not allow emails in the user picker', () => {
			const fieldProps = {
				onChange: jest.fn(),
				value: [],
			};
			const loadOptions = jest.fn();
			const field = renderUserPicker(
				{
					loadOptions,
					product: 'confluence',
					config: { disableSharingToEmails: true },
					enableSmartUserPicker: true,
				},
				{ fieldProps, meta: { valid: true } },
			);
			const smartUserPicker = field.find(SmartUserPicker);
			expect(smartUserPicker.prop('allowEmail')).toBe(false);
		});
	});

	describe('includeNonLicensedUsers prop', () => {
		describe.each([
			['jira', 'Invite to Jira'],
			['confluence', 'Invite to Confluence'],
		])('Test for product: %s', (product, expectedByline) => {
			it('should override byline for external users', () => {
				const cloudId = 'cloud-id';
				const orgId = 'org-id';

				const fieldProps = {
					onChange: jest.fn(),
					value: [],
				};
				const loadOptions = jest.fn();
				const userPickerOptions: UserPickerOptions = {
					includeNonLicensedUsers: true,
				};
				const field = renderUserPicker(
					{
						loadOptions,
						product: product as ProductName,
						enableSmartUserPicker: true,
						userPickerOptions,
						cloudId,
						orgId,
					},
					{ fieldProps, meta: { valid: true } },
				);

				const smartUserPicker = field.find(SmartUserPicker);
				expect(smartUserPicker.prop('includeNonLicensedUsers')).toBe(true);

				const overrideByline = smartUserPicker.prop('overrideByline');
				expect(overrideByline?.(user)).toBe('');
				expect(overrideByline?.(externalUser)).toBe(expectedByline);
				expect(overrideByline?.(team)).toBe('');
			});
		});
	});

	describe('custom messages', () => {
		it('should render custom messages when provided', () => {
			const customPlaceHolderMessageDescriptor: MessageDescriptor = {
				id: 'custom.placeholder',
				defaultMessage: 'Custom placeholder',
			};
			const customLabelMessageDescriptor: MessageDescriptor = {
				id: 'custom.label',
				defaultMessage: 'Custom label',
			};

			const loadOptions = jest.fn();
			const { getByText } = renderRTL(
				<IntlProvider locale="en">
					<UserPickerField
						{...{
							loadOptions,
							product: 'confluence',
							userPickerOptions: {
								getPlaceholderMessage: () => customPlaceHolderMessageDescriptor,
								getLabelMessage: () => customLabelMessageDescriptor,
							},
						}}
					/>
				</IntlProvider>,
			);

			expect(getByText('Custom placeholder')).toBeInTheDocument();
			expect(getByText('Custom label')).toBeInTheDocument();
		});
	});
});
