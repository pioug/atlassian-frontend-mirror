import React from 'react';

import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';

import { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import SmartUserPicker, {
  EmailValidationResponse,
  isValidEmail,
  LoadOptions,
  OptionData,
  Props as SmartUserPickerProps,
  UserPickerProps,
  Value,
} from '@atlaskit/smart-user-picker';
import UserPicker from '@atlaskit/user-picker';

import { messages } from '../i18n';
import { ConfigResponse, MessageDescriptor, ProductName } from '../types';

import { MAX_PICKER_HEIGHT } from './styles';
import { allowEmails, getMenuPortalTargetCurrentHTML } from './utils';

export const REQUIRED = 'REQUIRED';
const DEBOUNCE_MS = 150;

const validate = (value: Value) => {
  return value && value instanceof Array && value.length > 0
    ? undefined
    : REQUIRED;
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
};

type GetPlaceHolderMessageDescriptor = (
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
  (isPublicLink?: boolean, allowEmail?: boolean): GetNoOptionMessage =>
  ({ inputValue }: { inputValue: string }): GetNoOptionMessage =>
    inputValue && inputValue.trim().length > 0
      ? ((
          <FormattedMessage
            {...getNoOptionsMessageDescriptor(
              isValidEmail(inputValue),
              isPublicLink,
              allowEmail,
            )}
            values={{
              inputValue,
            }}
          />
        ) as any)
      : null;

const getPlaceHolderMessageDescriptor: GetPlaceHolderMessageDescriptor = (
  product: ProductName = 'confluence',
  allowEmail?: boolean,
  isBrowseUsersDisabled?: boolean,
) => {
  if (!allowEmail) {
    const placeholderMessage = {
      jira: messages.userPickerExistingUserOnlyPlaceholder,
      confluence: messages.userPickerGenericExistingUserOnlyPlaceholder,
    };

    return placeholderMessage[product];
  }

  if (isBrowseUsersDisabled) {
    return messages.userPickerGenericEmailOnlyPlaceholder;
  }

  const placeholderMessage = {
    jira: messages.userPickerGenericPlaceholderJira,
    confluence: messages.userPickerGenericPlaceholder,
  };

  return placeholderMessage[product];
};

const requiredMessagesWithEmail = {
  confluence: messages.userPickerRequiredMessage,
  jira: messages.userPickerRequiredMessageJira,
};

const requiredMessagesWithoutEmail = {
  confluence: messages.userPickerRequiredExistingUserOnlyMessage,
  jira: messages.userPickerRequiredExistingUserOnlyMessageJira,
};

const getRequiredMessage = (
  product: ProductName,
  allowEmail: boolean,
  isBrowseUsersDisabled?: boolean,
): MessageDescriptor => {
  if (isBrowseUsersDisabled) {
    return messages.userPickerRequiredMessageEmailOnly;
  }

  const emailMessages = allowEmail
    ? requiredMessagesWithEmail
    : requiredMessagesWithoutEmail;

  return emailMessages[product];
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class UserPickerFieldComponent extends React.Component<
  WrappedComponentProps & Props
> {
  private loadOptions = (search?: string) => {
    const { loadOptions } = this.props;
    if (loadOptions && search && search.length > 0) {
      return loadOptions(search);
    } else {
      return [];
    }
  };

  private getInviteWarningMessage = (): React.ReactNode => {
    const { product, isPublicLink, helperMessage } = this.props;

    if (isPublicLink) {
      return null;
    }

    if (helperMessage !== undefined) {
      return helperMessage;
    }

    return product === 'jira' ? (
      <FormattedMessage {...messages.infoMessageDefaultJira} />
    ) : (
      <FormattedMessage {...messages.infoMessageDefaultConfluence} />
    );
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

  render() {
    const {
      defaultValue,
      enableSmartUserPicker,
      config,
      intl,
      isLoading,
      product,
      onInputChange,
      loggedInAccountId,
      cloudId,
      selectPortalRef,
      isPublicLink,
      orgId,
      isBrowseUsersDisabled,
    } = this.props;

    const smartUserPickerProps: Partial<SmartUserPickerProps> =
      enableSmartUserPicker && !isBrowseUsersDisabled
        ? {
            productKey: product,
            principalId: loggedInAccountId,
            siteId: cloudId || '',
            includeTeams: true,
            includeGroups: true,
            debounceTime: DEBOUNCE_MS,
            orgId,
          }
        : {};

    const allowEmail = allowEmails(config);

    const requiredMessage = getRequiredMessage(
      product,
      allowEmail,
      isBrowseUsersDisabled,
    );

    const commonPickerProps: Partial<UserPickerProps> = {
      fieldId: 'share',
      loadOptions: this.loadOptions,
      isMulti: true,
      width: '100%',
      placeholder: (
        <FormattedMessage
          {...getPlaceHolderMessageDescriptor(
            product,
            allowEmail,
            isBrowseUsersDisabled,
          )}
        />
      ),
      allowEmail,
      noOptionsMessage: getNoOptionsMessage(isPublicLink, allowEmail),
      isLoading,
      onInputChange: onInputChange,
      maxPickerHeight: MAX_PICKER_HEIGHT,
      textFieldBackgroundColor: true,
    };

    const UserPickerComponent:
      | React.FunctionComponent<any>
      | React.ComponentClass<any> =
      enableSmartUserPicker && !isBrowseUsersDisabled
        ? SmartUserPicker
        : UserPicker;

    const menuPortalTarget = getMenuPortalTargetCurrentHTML(selectPortalRef);

    return (
      <Field<Value>
        name="users"
        validate={validate}
        defaultValue={defaultValue}
        transform={this.handleUserPickerTransform}
      >
        {({ fieldProps, error, meta: { valid } }) => {
          const inviteWarningMessage = this.getInviteWarningMessage();

          return (
            <>
              <UserPickerComponent
                {...fieldProps}
                {...commonPickerProps}
                {...smartUserPickerProps}
                addMoreMessage={intl.formatMessage(
                  messages.userPickerAddMoreMessage,
                )}
                menuPortalTarget={menuPortalTarget}
              />

              {inviteWarningMessage && (
                <HelperMessage>{inviteWarningMessage}</HelperMessage>
              )}
              {!valid && error === REQUIRED && (
                <ErrorMessage>
                  <FormattedMessage {...requiredMessage} />
                </ErrorMessage>
              )}
            </>
          );
        }}
      </Field>
    );
  }
}

export const UserPickerField: React.ComponentType<Props> = injectIntl(
  UserPickerFieldComponent,
);
