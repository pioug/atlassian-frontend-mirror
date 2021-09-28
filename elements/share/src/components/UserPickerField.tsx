import { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import UserPicker, {
  EmailValidationResponse,
  LoadOptions,
  OptionData,
  Value,
  isValidEmail,
  UserPickerProps,
  SmartUserPicker,
  SmartUserPickerProps,
} from '@atlaskit/user-picker';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { messages } from '../i18n';
import { MessageDescriptor, ProductName } from '../types';
import { getMenuPortalTargetCurrentHTML } from './utils';
import { MAX_PICKER_HEIGHT } from './styles';

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
  isLoading?: boolean;
  product: ProductName;
  onInputChange?: (query?: string, sessionId?: string) => void;
  enableSmartUserPicker?: boolean;
  loggedInAccountId?: string;
  cloudId?: string;
  onChange?: (value: Value) => void;
  selectPortalRef?: React.Ref<HTMLDivElement>;
  isPublicLink?: boolean;
};

type GetPlaceHolderMessageDescriptor = (
  product?: ProductName,
) => MessageDescriptor;

type GetNoOptionMessageDescriptor = (
  emailValidity: EmailValidationResponse,
  isPublicLink?: boolean,
) => MessageDescriptor;

type GetNoOptionMessage = (params: { inputValue: string }) => any;

const getNoOptionsMessageDescriptor: GetNoOptionMessageDescriptor = (
  emailValidity: EmailValidationResponse,
  isPublicLink?: boolean,
) => {
  if (isPublicLink) {
    return messages.userPickerExistingUserOnlyNoOptionsMessage;
  }

  return messages.userPickerGenericNoOptionsMessage;
};

const getNoOptionsMessage = (isPublicLink?: boolean): GetNoOptionMessage => ({
  inputValue,
}: {
  inputValue: string;
}): GetNoOptionMessage =>
  inputValue && inputValue.trim().length > 0
    ? ((
        <FormattedMessage
          {...getNoOptionsMessageDescriptor(
            isValidEmail(inputValue),
            isPublicLink,
          )}
          values={{
            inputValue,
          }}
        />
      ) as any)
    : null;

const getPlaceHolderMessageDescriptor: GetPlaceHolderMessageDescriptor = (
  product: ProductName = 'confluence',
) => {
  const placeholderMessage = {
    jira: messages.userPickerGenericPlaceholderJira,
    confluence: messages.userPickerGenericPlaceholder,
  };

  return placeholderMessage[product];
};

export class UserPickerField extends React.Component<Props> {
  private loadOptions = (search?: string) => {
    const { loadOptions } = this.props;
    if (loadOptions && search && search.length > 0) {
      return loadOptions(search);
    } else {
      return [];
    }
  };

  private getInviteWarningMessage = (): React.ReactNode => {
    const { product, isPublicLink } = this.props;

    if (isPublicLink) {
      return null;
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
      isLoading,
      product,
      onInputChange,
      loggedInAccountId,
      cloudId,
      selectPortalRef,
      isPublicLink,
    } = this.props;
    const requireMessage = {
      jira: messages.userPickerRequiredMessageJira,
      confluence: messages.userPickerRequiredMessage,
    };

    const smartUserPickerProps: Partial<SmartUserPickerProps> = enableSmartUserPicker
      ? {
          productKey: product,
          principalId: loggedInAccountId,
          siteId: cloudId || '',
          includeTeams: true,
          includeGroups: true,
          debounceTime: DEBOUNCE_MS,
        }
      : {};

    const commonPickerProps: Partial<UserPickerProps> = {
      fieldId: 'share',
      loadOptions: this.loadOptions,
      isMulti: true,
      width: '100%',
      placeholder: (
        <FormattedMessage {...getPlaceHolderMessageDescriptor(product)} />
      ),
      allowEmail: true,
      noOptionsMessage: getNoOptionsMessage(isPublicLink),
      isLoading,
      onInputChange: onInputChange,
      maxPickerHeight: MAX_PICKER_HEIGHT,
      textFieldBackgroundColor: true,
    };

    const UserPickerComponent:
      | React.FunctionComponent<any>
      | React.ComponentClass<any> = enableSmartUserPicker
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
              <FormattedMessage {...messages.userPickerAddMoreMessage}>
                {(addMore) => (
                  <UserPickerComponent
                    {...fieldProps}
                    {...commonPickerProps}
                    {...smartUserPickerProps}
                    addMoreMessage={addMore as string}
                    menuPortalTarget={menuPortalTarget}
                  />
                )}
              </FormattedMessage>
              {inviteWarningMessage && (
                <HelperMessage>{inviteWarningMessage}</HelperMessage>
              )}
              {!valid && error === REQUIRED && (
                <ErrorMessage>
                  <FormattedMessage {...requireMessage[product]} />
                </ErrorMessage>
              )}
            </>
          );
        }}
      </Field>
    );
  }
}
