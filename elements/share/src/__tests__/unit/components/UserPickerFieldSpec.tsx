jest.mock('../../../components/utils', () => ({
  getMenuPortalTargetCurrentHTML: jest.fn(),
  allowEmails: (config: ConfigResponse) =>
    !(config && config.disableSharingToEmails),
}));

import React from 'react';

import { mount, shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl-next';

import { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import SmartUserPicker, { OptionData } from '@atlaskit/smart-user-picker';
import UserPicker from '@atlaskit/user-picker';

import {
  Props,
  REQUIRED,
  UserPickerField,
} from '../../../components/UserPickerField';
import { getMenuPortalTargetCurrentHTML } from '../../../components/utils';
import { messages } from '../../../i18n';
import { ConfigResponse } from '../../../types';
import { ProductName } from '../../../types/Products';
import { renderProp } from '../_testUtils';

const mockFormatMessage = (descriptor: any) => descriptor.defaultMessage;
const mockIntl = { formatMessage: mockFormatMessage };

jest.mock('react-intl-next', () => {
  return {
    ...(jest.requireActual('react-intl-next') as any),
    FormattedMessage: (descriptor: any) => (
      <span>{descriptor.defaultMessage}</span>
    ),
    injectIntl: (Node: any) => (props: any) =>
      <Node {...props} intl={mockIntl} />,
    useIntl: jest.fn().mockReturnValue({
      locale: 'en',
      formatMessage: (descriptor: any) => descriptor.defaultMessage,
    }),
  };
});

describe('UserPickerField', () => {
  const renderUserPicker = (userPickerFieldProps: Props, ...args: any[]) => {
    const c = shallow(<UserPickerField {...userPickerFieldProps} />);
    return renderProp(c.dive().find(Field), 'children', ...args);
  };

  afterEach(() => {
    (getMenuPortalTargetCurrentHTML as jest.Mock).mockClear();
  });

  it('should render UserPicker', () => {
    const fieldProps = {
      onChange: jest.fn(),
      value: [],
    };
    const loadOptions = jest.fn();
    const mockIsLoading = true;
    const field = renderUserPicker(
      {
        loadOptions,
        isLoading: mockIsLoading,
        product: 'confluence',
      },
      { fieldProps, meta: { valid: true } },
    );

    const formattedMessage = field.find(FormattedMessage);
    expect(formattedMessage).toHaveLength(1);

    const formattedMessageDefaultConfluence = formattedMessage.first();
    expect(formattedMessageDefaultConfluence).toHaveLength(1);
    expect(formattedMessageDefaultConfluence.props()).toMatchObject(
      messages.infoMessageDefaultConfluence,
    );

    expect(field.find(ErrorMessage).exists()).toBeFalsy();

    const expectProps = {
      fieldId: 'share',
      addMoreMessage: 'Enter more',
      onChange: fieldProps.onChange,
      value: fieldProps.value,
      placeholder: (
        <FormattedMessage {...messages.userPickerGenericPlaceholder} />
      ),
      loadOptions: expect.any(Function),
      isLoading: mockIsLoading,
    };

    const userPicker = field.find(UserPicker);
    expect(userPicker).toHaveLength(1);
    expect(userPicker.props()).toMatchObject(expectProps);
  });

  it('should render UserPicker when product is Confluence and helperMessage is available', () => {
    const fieldProps = {
      onChange: jest.fn(),
      value: [],
    };
    const loadOptions = jest.fn();
    const mockIsLoading = true;
    const helperMessage =
      'Recipients will see the name of the board and your message';

    const field = renderUserPicker(
      {
        loadOptions,
        isLoading: mockIsLoading,
        product: 'confluence',
        helperMessage,
      },
      { fieldProps, meta: { valid: true } },
    );

    const fieldHelperMessage = field.find(HelperMessage);

    expect(fieldHelperMessage).toHaveLength(1);
    expect(fieldHelperMessage.html()).toEqual(
      expect.stringContaining(
        'Recipients will see the name of the board and your message',
      ),
    );
  });

  it('should render UserPicker when product is jira and helperMessage is available', () => {
    const fieldProps = {
      onChange: jest.fn(),
      value: [],
    };
    const loadOptions = jest.fn();
    const mockIsLoading = true;
    const helperMessage =
      'Recipients will see the name of the roadmap and your message';

    const field = renderUserPicker(
      { loadOptions, isLoading: mockIsLoading, product: 'jira', helperMessage },
      { fieldProps, meta: { valid: true } },
    );

    const fieldHelperMessage = field.find(HelperMessage);

    expect(fieldHelperMessage).toHaveLength(1);
    expect(fieldHelperMessage.html()).toEqual(
      expect.stringContaining(
        'Recipients will see the name of the roadmap and your message',
      ),
    );
  });

  it('should render UserPicker when product is `jira` and no helper message is available', () => {
    const fieldProps = {
      onChange: jest.fn(),
      value: [],
    };
    const loadOptions = jest.fn();
    const mockIsLoading = true;
    const field = renderUserPicker(
      { loadOptions, isLoading: mockIsLoading, product: 'jira' },
      { fieldProps, meta: { valid: true } },
    );

    const formattedMessage = field.find(FormattedMessage);
    expect(formattedMessage).toHaveLength(1);

    const infoMessageDefaultJira = formattedMessage.first();
    expect(infoMessageDefaultJira).toHaveLength(1);
    expect(infoMessageDefaultJira.props()).toMatchObject(
      messages.infoMessageDefaultJira,
    );

    expect(field.find(ErrorMessage).exists()).toBeFalsy();

    const expectProps = {
      fieldId: 'share',
      addMoreMessage: 'Enter more',
      onChange: fieldProps.onChange,
      value: fieldProps.value,
      placeholder: (
        <FormattedMessage {...messages.userPickerGenericPlaceholderJira} />
      ),
      loadOptions: expect.any(Function),
      isLoading: mockIsLoading,
    };

    const userPicker = field.find(UserPicker);
    expect(userPicker).toHaveLength(1);
    expect(userPicker.props()).toMatchObject(expectProps);
  });

  it('should set defaultValue', () => {
    const defaultValue: OptionData[] = [];
    const loadOptions = jest.fn();
    const component = mount(
      <UserPickerField
        loadOptions={loadOptions}
        defaultValue={defaultValue}
        product="confluence"
      />,
    );
    expect(component.find(Field).prop('defaultValue')).toBe(defaultValue);
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
    test.each<[string | undefined, { id: string }[] | null]>([
      ['REQUIRED', []],
      ['REQUIRED', null],
      [undefined, [{ id: 'some-id' }]],
    ])('should return "%s" when called with %p', (expected, value) => {
      const loadOptions = jest.fn();
      const component = mount(
        <UserPickerField loadOptions={loadOptions} product="confluence" />,
      );
      const validate = component.find(Field).prop('validate');
      expect(validate(value)).toEqual(expected);
    });
  });

  describe('error messages', () => {
    it('should display required message', () => {
      const fieldProps = {
        onChange: jest.fn(),
        value: [],
      };
      const loadOptions = jest.fn();
      const errorMessage = renderUserPicker(
        { loadOptions, product: 'confluence' },
        {
          fieldProps,
          meta: { valid: false },
          error: REQUIRED,
        },
      ).find(ErrorMessage);

      expect(errorMessage).toHaveLength(1);
      const message = errorMessage.find(FormattedMessage);
      expect(message).toHaveLength(1);
      expect(message.props()).toMatchObject(messages.userPickerRequiredMessage);
    });

    it('should display required message when product is `jira`', () => {
      const fieldProps = {
        onChange: jest.fn(),
        value: [],
      };
      const loadOptions = jest.fn();
      const errorMessage = renderUserPicker(
        { loadOptions, product: 'jira' },
        {
          fieldProps,
          meta: { valid: false },
          error: REQUIRED,
        },
      ).find(ErrorMessage);

      expect(errorMessage).toHaveLength(1);
      const message = errorMessage.find(FormattedMessage);
      expect(message).toHaveLength(1);
      expect(message.props()).toMatchObject(
        messages.userPickerRequiredMessageJira,
      );
    });

    it('should display required message when email is disabled', () => {
      const fieldProps = {
        onChange: jest.fn(),
        value: [],
      };
      const loadOptions = jest.fn();
      const errorMessage = renderUserPicker(
        {
          loadOptions,
          product: 'confluence',
          config: { disableSharingToEmails: true },
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
      expect(message.props()).toMatchObject(
        messages.userPickerRequiredExistingUserOnlyMessage,
      );
    });

    it('should display required message when product is `jira` and email is disabled', () => {
      const fieldProps = {
        onChange: jest.fn(),
        value: [],
      };
      const loadOptions = jest.fn();
      const errorMessage = renderUserPicker(
        {
          loadOptions,
          product: 'jira',
          config: { disableSharingToEmails: true },
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
      expect(message.props()).toMatchObject(
        messages.userPickerRequiredExistingUserOnlyMessageJira,
      );
    });
  });

  describe('invite warning', () => {
    const setUpInviteWarningTest = (
      product: ProductName = 'confluence',
      isPublicLink = false,
    ) => {
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

    it('should show existing user only placeholder', () => {
      const { component } = setUpInviteWarningTest();
      const userPicker = component.find(UserPicker);
      expect(userPicker.prop('placeholder')).toEqual(
        <FormattedMessage
          {...messages.userPickerGenericExistingUserOnlyPlaceholder}
        />,
      );
    });

    it('should show existing user only placeholder in Jira', () => {
      const { component } = setUpInviteWarningTest('jira');
      const userPicker = component.find(UserPicker);
      expect(userPicker.prop('placeholder')).toEqual(
        <FormattedMessage
          {...messages.userPickerExistingUserOnlyPlaceholder}
        />,
      );
    });

    it('should display warning message when product is confluence', () => {
      const { component } = setUpInviteWarningTest();

      const helperMessage = component.find(HelperMessage);
      expect(helperMessage).toHaveLength(1);

      const message = helperMessage.find(FormattedMessage);
      expect(message).toHaveLength(1);
      expect(message.props()).toMatchObject(
        messages.infoMessageDefaultConfluence,
      );
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
});
