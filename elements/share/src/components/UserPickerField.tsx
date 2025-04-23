import React from 'react';

import { FormattedMessage, injectIntl, type WrappedComponentProps } from 'react-intl-next';

import { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives/compiled';
import SmartUserPicker, {
	type EmailValidationResponse,
	isValidEmail,
	type LoadOptions,
	type OptionData,
	type Props as SmartUserPickerProps,
	type UserPickerProps,
	type Value,
} from '@atlaskit/smart-user-picker';
import UserPicker, { type ExternalUser, type Team, type User } from '@atlaskit/user-picker';

import { messages } from '../i18n';
import {
	type ConfigResponse,
	type MessageDescriptor,
	type ProductName,
	type ShareError,
	type UserPickerOptions,
} from '../types';

import { MAX_PICKER_HEIGHT } from './styles';
import { allowEmails, getMenuPortalTargetCurrentHTML } from './utils';

export const REQUIRED = 'REQUIRED';
const DEBOUNCE_MS = 150;

const USER_PICKER_FIELD_LABEL = 'share-user-picker-field-label';
const USER_PICKER_FIELD_PLACEHOLDER = 'share-user-picker-field-placeholder';

const USER_PICKER_ARIA_LABEL = `${USER_PICKER_FIELD_LABEL} ${USER_PICKER_FIELD_PLACEHOLDER}`;

const validate = (value: Value) => {
	return value && value instanceof Array && value.length > 0 ? undefined : REQUIRED;
};
export type Props = {
	loadOptions?: LoadOptions;
	defaultValue?: OptionData[];
	config?: ConfigResponse;
	isLoading?: boolean;
	product: ProductName;
	onInputChange?: (query?: string, sessionId?: string) => void;
	enableSmartUserPicker?: boolean;
	loggedInAccountId?: string;
	cloudId?: string;
	onChange?: (value: Value) => void;
	selectPortalRef?: React.Ref<HTMLDivElement>;
	isPublicLink?: boolean;
	helperMessage?: string;
	orgId?: string;
	isBrowseUsersDisabled?: boolean;
	shareError?: ShareError;
	userPickerOptions?: UserPickerOptions;
	productAttributes?: SmartUserPickerProps['productAttributes'];
};

type GetMessageDescriptor = (
	product?: ProductName,
	allowEmail?: boolean,
	isBrowseUsersDisabled?: boolean,
) => MessageDescriptor;

type GetNoOptionMessageDescriptor = (
	emailValidity: EmailValidationResponse,
	isPublicLink?: boolean,
	allowEmail?: boolean,
) => MessageDescriptor;

type GetNoOptionMessage = (params: { inputValue: string }) => any;

const getNoOptionsMessageDescriptor: GetNoOptionMessageDescriptor = (
	emailValidity: EmailValidationResponse,
	isPublicLink?: boolean,
	allowEmail?: boolean,
) => {
	if (isPublicLink || !allowEmail) {
		return messages.userPickerExistingUserOnlyNoOptionsMessage;
	}
	return messages.userPickerGenericNoOptionsMessage;
};

const getNoOptionsMessage =
	(
		isPublicLink?: boolean,
		allowEmail?: boolean,
		noOptionsMessageHandler?: any,
	): GetNoOptionMessage =>
	({ inputValue }: { inputValue: string }): GetNoOptionMessage => {
		if (noOptionsMessageHandler) {
			return noOptionsMessageHandler({ inputValue, isPublicLink, allowEmail });
		}
		return inputValue && inputValue.trim().length > 0
			? ((
					<FormattedMessage
						{...getNoOptionsMessageDescriptor(isValidEmail(inputValue), isPublicLink, allowEmail)}
						values={{
							inputValue,
						}}
					/>
				) as any)
			: null;
	};

const getPlaceHolderMessageDescriptorDefault: GetMessageDescriptor = (
	product: ProductName = 'confluence',
	allowEmail?: boolean,
	isBrowseUsersDisabled?: boolean,
) => {
	if (!allowEmail) {
		const placeholderMessage = {
			jira: messages.userPickerPlaceholderEmailDisabledJira,
			// We can use the same message as when emails are not disabled, since
			// emails are not mentioned in this placeholder as it would be too long
			confluence: messages.userPickerPlaceholderConfluence,
		};

		return placeholderMessage[product];
	}

	if (isBrowseUsersDisabled) {
		return messages.userPickerPlaceholderBrowseUsersDisabled;
	}

	const placeholderMessage = {
		jira: messages.userPickerPlaceholderJira,
		confluence: messages.userPickerPlaceholderConfluence,
	};

	return placeholderMessage[product];
};

const getLabelMessageDescriptorDefault: GetMessageDescriptor = (
	product: ProductName = 'confluence',
	allowEmail?: boolean,
	isBrowseUsersDisabled?: boolean,
) => {
	if (!allowEmail) {
		const labelMessage = {
			jira: messages.userPickerLabelEmailDisabledJira,
			confluence: messages.userPickerLabelEmailDisabledConfluence,
		};

		return labelMessage[product];
	}

	if (isBrowseUsersDisabled) {
		return messages.userPickerLabelBrowseUsersDisabled;
	}

	const labelMessage = {
		jira: messages.userPickerLabelJira,
		confluence: messages.userPickerLabelConfluence,
	};

	return labelMessage[product];
};

const getRequiredMessageDefault: GetMessageDescriptor = (
	product: ProductName = 'confluence',
	allowEmail?: boolean,
	isBrowseUsersDisabled?: boolean,
): MessageDescriptor => {
	if (!allowEmail) {
		const requiredMessage = {
			jira: messages.userPickerRequiredMessageEmailDisabledJira,
			confluence: messages.userPickerRequiredMessageEmailDisabledConfluence,
		};

		return requiredMessage[product];
	}

	if (isBrowseUsersDisabled) {
		return messages.userPickerRequiredMessageBrowseUsersDisabled;
	}

	const requiredMessage = {
		jira: messages.userPickerRequiredMessageJira,
		confluence: messages.userPickerRequiredMessageConfluence,
	};

	return requiredMessage[product];
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class UserPickerFieldComponent extends React.Component<WrappedComponentProps & Props> {
	private loadOptions = (search?: string) => {
		const { loadOptions } = this.props;
		if (loadOptions && search && search.length > 0) {
			return loadOptions(search);
		} else {
			return [];
		}
	};

	private getHelperMessageOrDefault = (): React.ReactNode => {
		const { product, isPublicLink, helperMessage } = this.props;

		if (isPublicLink) {
			return null;
		}

		if (helperMessage !== undefined) {
			return helperMessage;
		}

		if (product === 'jira') {
			return fg('jira-issue-terminology-refresh-m3') ? (
				<FormattedMessage {...messages.infoMessageDefaultJiraIssueTermRefresh} />
			) : (
				<FormattedMessage {...messages.infoMessageDefaultJira} />
			);
		}

		return <FormattedMessage {...messages.infoMessageDefaultConfluence} />;
	};

	private handleUserPickerTransform = (
		event: Value | React.FormEvent<HTMLInputElement>,
		current: Value,
	) => {
		const { onChange } = this.props;
		if (onChange) {
			onChange(event as Value);
		}

		return event as Value;
	};

	private getSmartUserPickerProps = () => {
		const {
			product,
			intl,
			loggedInAccountId,
			cloudId,
			orgId,
			enableSmartUserPicker,
			isBrowseUsersDisabled,
			userPickerOptions,
			productAttributes,
		} = this.props;
		if (!enableSmartUserPicker || isBrowseUsersDisabled) {
			return {};
		}

		const baseProps = {
			productKey: product,
			principalId: loggedInAccountId,
			siteId: cloudId || '',
			includeTeams: true,
			includeGroups: true,
			debounceTime: DEBOUNCE_MS,
			orgId,
			productAttributes,
		};

		const externalUserBylineByProduct = {
			confluence: intl.formatMessage(messages.inviteToConfluence),
			jira: intl.formatMessage(messages.inviteToJira),
		};

		if (userPickerOptions?.includeNonLicensedUsers) {
			const externalUserByline = externalUserBylineByProduct[product] || '';

			const overrideByline =
				product === 'confluence' || product === 'jira'
					? (item: User | ExternalUser | Team) =>
							(item as ExternalUser).isExternal ? externalUserByline : ''
					: undefined;

			return {
				...baseProps,
				includeNonLicensedUsers: true,
				overrideByline,
			};
		}

		return baseProps;
	};

	render() {
		const {
			defaultValue,
			enableSmartUserPicker,
			config,
			intl,
			isLoading,
			product,
			onInputChange,
			selectPortalRef,
			isPublicLink,
			isBrowseUsersDisabled,
			shareError,
			userPickerOptions,
		} = this.props;

		const smartUserPickerProps: Partial<SmartUserPickerProps> = this.getSmartUserPickerProps();

		const allowEmail = allowEmails(config);

		const {
			header,
			noOptionsMessageHandler,
			onFocus,
			getLabelMessage: getLabelMessageCustom,
			getPlaceholderMessage: getPlaceholderMessageCustom,
			getRequiredMessage: getRequiredMessageCustom,
		} = userPickerOptions ?? {};

		const getRequiredMessage = (...[product, ...params]: Parameters<GetMessageDescriptor>) =>
			getRequiredMessageCustom?.(...params) ?? getRequiredMessageDefault(...[product, ...params]);
		const getLabelMessage = (...[product, ...params]: Parameters<GetMessageDescriptor>) =>
			getLabelMessageCustom?.(...params) ??
			getLabelMessageDescriptorDefault(...[product, ...params]);
		const getPlaceHolderMessage = (...[product, ...params]: Parameters<GetMessageDescriptor>) =>
			getPlaceholderMessageCustom?.(...params) ??
			getPlaceHolderMessageDescriptorDefault(...[product, ...params]);

		const requiredMessage = getRequiredMessage(product, allowEmail, isBrowseUsersDisabled);

		const commonPickerProps: Partial<UserPickerProps> = {
			fieldId: 'share',
			loadOptions: this.loadOptions,
			isMulti: true,
			width: '100%',
			allowEmail,
			noOptionsMessage: getNoOptionsMessage(isPublicLink, allowEmail, noOptionsMessageHandler),
			isLoading,
			onInputChange: onInputChange,
			maxPickerHeight: MAX_PICKER_HEIGHT,
			textFieldBackgroundColor: true,
			header,
			onFocus,
		};

		const UserPickerComponent: React.FunctionComponent<any> | React.ComponentClass<any> =
			enableSmartUserPicker && !isBrowseUsersDisabled ? SmartUserPicker : UserPicker;

		const menuPortalTarget = getMenuPortalTargetCurrentHTML(selectPortalRef);

		return (
			<Field<Value>
				label={
					<Text id={USER_PICKER_FIELD_LABEL}>
						<FormattedMessage {...getLabelMessage(product, allowEmail, isBrowseUsersDisabled)} />
					</Text>
				}
				name="users"
				validate={validate}
				defaultValue={defaultValue}
				transform={this.handleUserPickerTransform}
				isRequired
			>
				{({ fieldProps, error: fieldValidationError, meta: { valid: fieldValid } }) => {
					const helperMessage = this.getHelperMessageOrDefault();
					const addMoreMessage = shareError?.errorCode
						? null
						: intl.formatMessage(messages.userPickerAddMoreMessage);

					const wasValidationOrShareError: boolean = !!fieldValidationError || !!shareError;

					return (
						<>
							<UserPickerComponent
								{...fieldProps}
								{...commonPickerProps}
								{...smartUserPickerProps}
								aria-labelledby={USER_PICKER_ARIA_LABEL}
								required={true}
								addMoreMessage={addMoreMessage}
								placeholder={
									<Text id={USER_PICKER_FIELD_PLACEHOLDER}>
										<FormattedMessage
											{...getPlaceHolderMessage(product, allowEmail, isBrowseUsersDisabled)}
										/>
									</Text>
								}
								menuPortalTarget={menuPortalTarget}
								inputId={fieldProps.id}
							/>

							{helperMessage && !wasValidationOrShareError && (
								<HelperMessage testId="user-picker">{helperMessage}</HelperMessage>
							)}
							{!fieldValid && fieldValidationError === REQUIRED && (
								<ErrorMessage>
									<FormattedMessage {...requiredMessage} />
								</ErrorMessage>
							)}
							{shareError && shareError.errorCode && (
								<ErrorMessage>
									{shareError.message}
									&nbsp;
									{shareError.helpUrl && (
										<Link target="_blank" href={shareError.helpUrl} rel="help">
											Learn why
										</Link>
									)}
								</ErrorMessage>
							)}
						</>
					);
				}}
			</Field>
		);
	}
}

export const UserPickerField: React.ComponentType<Props> = injectIntl(UserPickerFieldComponent);
