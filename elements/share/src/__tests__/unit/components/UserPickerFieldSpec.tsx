jest.mock('../../../components/utils', () => ({
  getInviteWarningType: jest.fn(),
  getMenuPortalTargetCurrentHTML: jest.fn(),
}));

import { shallowWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import UserPicker, { OptionData, SmartUserPicker } from '@atlaskit/user-picker';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Props,
  REQUIRED,
  UserPickerField,
} from '../../../components/UserPickerField';
import { getMenuPortalTargetCurrentHTML } from '../../../components/utils';
import { messages } from '../../../i18n';
import { ProductName } from '../../../types/Products';
import { renderProp } from '../_testUtils';

describe('UserPickerField', () => {
  const renderUserPicker = (userPickerFieldProps: Props, ...args: any[]) =>
    renderProp(
      shallowWithIntl(<UserPickerField {...userPickerFieldProps} />),
      'children',
      ...args,
    );

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
    expect(formattedMessage).toHaveLength(2);

    const formattedMessageAddMore = formattedMessage.first();
    expect(formattedMessageAddMore).toHaveLength(1);
    expect(formattedMessageAddMore.props()).toMatchObject(
      messages.userPickerAddMoreMessage,
    );

    const formattedMessageDefaultConfluence = formattedMessage.last();
    expect(formattedMessageDefaultConfluence).toHaveLength(1);
    expect(formattedMessageDefaultConfluence.props()).toMatchObject(
      messages.infoMessageDefaultConfluence,
    );

    expect(field.find(ErrorMessage).exists()).toBeFalsy();

    const expectProps = {
      fieldId: 'share',
      addMoreMessage: 'add more',
      onChange: fieldProps.onChange,
      value: fieldProps.value,
      placeholder: (
        <FormattedMessage {...messages.userPickerGenericPlaceholder} />
      ),
      loadOptions: expect.any(Function),
      isLoading: mockIsLoading,
    };

    const userPicker = renderProp(
      formattedMessageAddMore,
      'children',
      'add more',
    ).find(UserPicker);
    expect(userPicker).toHaveLength(1);
    expect(userPicker.props()).toMatchObject(expectProps);
  });

  it('should render UserPicker when product is `jira`', () => {
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
    expect(formattedMessage).toHaveLength(2);

    const formattedMessageAddMore = formattedMessage.first();

    const infoMessageDefaultJira = formattedMessage.last();
    expect(infoMessageDefaultJira).toHaveLength(1);
    expect(infoMessageDefaultJira.props()).toMatchObject(
      messages.infoMessageDefaultJira,
    );

    expect(field.find(ErrorMessage).exists()).toBeFalsy();

    const expectProps = {
      fieldId: 'share',
      addMoreMessage: 'add more',
      onChange: fieldProps.onChange,
      value: fieldProps.value,
      placeholder: (
        <FormattedMessage {...messages.userPickerGenericPlaceholderJira} />
      ),
      loadOptions: expect.any(Function),
      isLoading: mockIsLoading,
    };

    const userPicker = renderProp(
      formattedMessageAddMore,
      'children',
      'add more',
    ).find(UserPicker);
    expect(userPicker).toHaveLength(1);
    expect(userPicker.props()).toMatchObject(expectProps);
  });

  it('should set defaultValue', () => {
    const defaultValue: OptionData[] = [];
    const loadOptions = jest.fn();
    const component = shallowWithIntl(
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
    const formattedMessageAddMore = field.find(FormattedMessage).first();
    const userPicker = renderProp(
      formattedMessageAddMore,
      'children',
      'add more',
    ).find(UserPicker);
    expect(userPicker).toHaveLength(1);
    userPicker.simulate('loadOptions', '');
    expect(loadOptions).not.toHaveBeenCalled();
  });

  describe('smart user picker enabled', () => {
    it('should render smart user picker', () => {
      const cloudId = 'cloud-id';

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
        },
        { fieldProps, meta: { valid: true } },
      );
      const formattedMessageAddMore = field.find(FormattedMessage).first();
      const smartUserPicker = renderProp(
        formattedMessageAddMore,
        'children',
        'add more',
      ).find(SmartUserPicker);
      expect(smartUserPicker).toHaveLength(1);
      expect(smartUserPicker.prop('siteId')).toBe(cloudId);
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
      const component = shallowWithIntl(
        <UserPickerField loadOptions={loadOptions} product="confluence" />,
      );
      const validate = component.prop('validate');
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

      const formattedMessageAddMore = field.find(FormattedMessage).first();
      expect(formattedMessageAddMore).toHaveLength(1);
      const userPicker = renderProp(
        formattedMessageAddMore,
        'children',
        'add more',
      ).find(UserPicker);

      userPicker.simulate('inputChange', 'some text');
      expect(onInputChange).toHaveBeenCalledTimes(1);
    });
  });
});
