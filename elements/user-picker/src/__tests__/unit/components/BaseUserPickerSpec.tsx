import { AnalyticsListener } from '@atlaskit/analytics-next';
import Select from '@atlaskit/select';
import { ReactWrapper } from 'enzyme';
import { mountWithIntl, shallowWithIntl } from 'enzyme-react-intl';
import debounce from 'lodash/debounce';
import React from 'react';
import {
  BaseUserPicker,
  BaseUserPickerWithoutAnalytics,
  BaseUserPickerProps,
} from '../../../components/BaseUserPicker';
import { getComponents } from '../../../components/components';
import * as analytics from '../../../analytics';
import {
  optionToSelectableOption,
  optionToSelectableOptions,
} from '../../../components/utils';
import {
  EmailType,
  Option,
  OptionData,
  Team,
  User,
  Group,
  UserPickerProps,
  UserType,
  Value,
  ExternalUser,
} from '../../../types';

const ID_1 = '111111111111111111111111';
const ID_2 = '111111111111111111111110';
const INVALID_ID_1 = 'invalid@id.com';
const INVALID_ID_2 = 'Bob Ross';

const OLD_AAID = '1234567:12345678-1234-1234-1234-123456789012';
const TEAM_ID = '12345678-1234-1234-1234-123456789012';
const GROUP_ID = '12345678-1234-1234-1234-123456789012';

const getBasePicker = (
  BasePickerComponent: React.JSXElementConstructor<BaseUserPickerProps>,
) => (props: Partial<BaseUserPickerProps> = {}) => (
  <BasePickerComponent
    fieldId="test"
    SelectComponent={Select}
    styles={{}}
    components={getComponents(props.isMulti)}
    width={'100%'}
    {...props}
  />
);

const getBasePickerWithoutAnalytics = getBasePicker(
  BaseUserPickerWithoutAnalytics,
);

const getBasePickerWithAnalytics = getBasePicker(BaseUserPicker);

describe('BaseUserPicker', () => {
  const shallowUserPicker = (props: Partial<UserPickerProps> = {}) =>
    shallowWithIntl(getBasePickerWithoutAnalytics(props));

  const options: User[] = [
    {
      id: ID_1,
      name: 'Jace Beleren',
      publicName: 'jbeleren',
      type: 'user',
    },
    {
      id: ID_2,
      name: 'Chandra Nalaar',
      publicName: 'cnalaar',
      type: 'user',
    },
  ];

  // original options have new AAID format
  const mixedOptions: OptionData[] = [
    ...options,
    {
      id: OLD_AAID,
      name: 'old user',
      publicName: 'old user',
      type: 'user',
    },
    {
      id: GROUP_ID,
      name: 'SmartGroup',
      type: 'group',
    },
    {
      id: TEAM_ID,
      name: 'SmartExperiences',
      type: 'team',
    },
    {
      id: INVALID_ID_1,
      name: 'hi@id.com',
      publicName: 'hi@id.com',
      type: 'user',
    },
    {
      id: INVALID_ID_2,
      name: 'Bob Ross',
      publicName: 'Bob Ross',
      type: 'user',
    },
  ];

  const externalOptions: ExternalUser[] = [
    {
      id: ID_2,
      name: 'Chandra Nalaar',
      publicName: 'cnalaar',
      isExternal: true,
      sources: ['google'],
    },
  ];

  const emailValue: OptionData = {
    id: 'email@atlassian.com',
    name: 'email@atlassian.com',
    type: EmailType,
  };

  const userOptions: Option[] = optionToSelectableOptions(options);

  it('should render using a Select', () => {
    const component = shallowUserPicker({ options });
    const select = component.find(Select);

    expect(select.prop('options')).toEqual(userOptions);
    expect(select.prop('menuPlacement')).toBeTruthy();
    expect(select.prop('instanceId')).toEqual('test'); // match fieldId
  });

  it('should disable picker if isDisabled is true', () => {
    const component = shallowUserPicker({ isDisabled: true });
    const select = component.find(Select);
    expect(select.prop('isDisabled')).toEqual(true);
  });

  it('should set custom placeholder', () => {
    const custom = 'Custom';
    const component = shallowUserPicker({ placeholder: custom });
    const select = component.find(Select);
    expect(select.prop('placeholder')).toEqual(custom);
  });

  it('should set custom empty placeholder', () => {
    const custom = '';
    const component = shallowUserPicker({ placeholder: custom });
    const select = component.find(Select);
    expect(select.prop('placeholder')).toEqual(custom);
  });

  it('should pass custom no options message to picker', () => {
    const customMessage = 'Custom';
    const component = shallowUserPicker({ noOptionsMessage: customMessage });
    const select = component.find(Select);
    expect(select.prop('noOptionsMessage')).toEqual(customMessage);
  });

  it('should trigger onChange with User', () => {
    const onChange = jest.fn();
    const component = shallowUserPicker({ onChange });

    const select = component.find(Select);
    select.simulate('change', userOptions[0], { action: 'select-option' });

    expect(onChange).toHaveBeenCalledWith(options[0], 'select-option');
  });

  it('should trigger props.onSelection if onChange with select-option action', () => {
    const onSelection = jest.fn();
    const component = shallowUserPicker({ onSelection });

    const select = component.find(Select);
    select.simulate('change', userOptions[0], { action: 'select-option' });

    expect(onSelection).toHaveBeenCalledWith(options[0], undefined);
  });

  it('should trigger props.onClear if onChange with clear action', () => {
    const onClear = jest.fn();
    const component = shallowUserPicker({ onClear });

    const select = component.find(Select);
    select.simulate('change', userOptions[0], { action: 'clear' });

    expect(onClear).toHaveBeenCalled();
  });

  it('should display no loading message', () => {
    const component = shallowUserPicker();
    const select = component.find(Select);
    expect(select.prop('loadingMessage')()).toEqual(null);
  });

  it('should call onFocus handler', () => {
    const onFocus = jest.fn();
    const component = shallowUserPicker({ onFocus });

    component.simulate('focus');
    expect(onFocus).toHaveBeenCalled();
  });

  it('should call onBlur handler', () => {
    const onBlur = jest.fn();
    const component = shallowUserPicker({ onBlur });

    component.simulate('blur');
    expect(onBlur).toHaveBeenCalled();
  });

  it('should call onClose handler', () => {
    const onClose = jest.fn();
    const component = shallowUserPicker({ onClose });

    component.simulate('close');
    expect(onClose).toHaveBeenCalled();
  });

  it('should clear options on blur', () => {
    const onBlur = jest.fn();
    const component = shallowUserPicker({ onBlur, options });
    expect(component.state('options')).toEqual(options);
    component.simulate('blur');
    expect(component.state('options')).toEqual([]);
  });

  it('should clear options on close', () => {
    const onClose = jest.fn();
    const component = shallowUserPicker({ onClose, options });
    expect(component.state('options')).toEqual(options);
    component.simulate('close');
    expect(component.state('options')).toEqual([]);
  });

  describe('Multiple users select', () => {
    it('should set isMulti in Select', () => {
      const component = shallowUserPicker({ options, isMulti: true });
      const select = component.find(Select);
      expect(select.prop('isMulti')).toBeTruthy();
    });

    it('should call onChange with an array of users', () => {
      const onChange = jest.fn();
      const component = shallowUserPicker({ options, isMulti: true, onChange });

      component
        .find(Select)
        .simulate('change', userOptions, { action: 'select-option' });

      expect(onChange).toHaveBeenCalledWith(
        [options[0], options[1]],
        'select-option',
      );
    });
    it('should remove user correctly', () => {
      let value = [] as Value;
      const onChange = jest.fn();
      const component = shallowUserPicker({
        options,
        isMulti: true,
        onChange,
        value,
      });

      component
        .find(Select)
        .simulate('change', [userOptions[0]], { action: 'select-option' });
      expect(onChange).toBeCalledWith(
        [
          {
            id: ID_1,
            name: 'Jace Beleren',
            publicName: 'jbeleren',
            type: 'user',
          },
        ],
        'select-option',
      );

      component.find(Select).simulate('change', null, {
        action: 'remove-value',
        removedValue: optionToSelectableOption(options[0]),
      });
      expect(onChange).toBeCalledWith(undefined, 'remove-value');

      component
        .find(Select)
        .simulate('change', [userOptions[1]], { action: 'select-option' });

      expect(onChange).toBeCalledWith(
        [
          {
            id: ID_2,
            name: 'Chandra Nalaar',
            publicName: 'cnalaar',
            type: 'user',
          },
        ],
        'select-option',
      );
    });

    it('should remove user correctly when no value props provided', () => {
      const onChange = jest.fn();
      const component = shallowUserPicker({
        options,
        isMulti: true,
        onChange,
      });

      component
        .find(Select)
        .simulate('change', [userOptions[0]], { action: 'select-option' });
      expect(onChange).toBeCalledWith([options[0]], 'select-option');
      // test deletion based on id
      expect(component.find(Select).props().value).toEqual([
        { data: options[0], label: 'Jace Beleren', value: ID_1 },
      ]);
      const sameIdItem = { ...options[0], label: 'Jace' };

      // when value deselected and no items selected, the value
      // parameter is set to null
      component.find(Select).simulate('change', null, {
        action: 'remove-value',
        removedValue: optionToSelectableOption(sameIdItem),
      });
      expect(onChange).toBeCalledWith(undefined, 'remove-value');

      expect(component.find(Select).props().value).toEqual([]);
    });
  });

  it('should set hovering clear indicator', () => {
    const component = shallowUserPicker();
    const select = component.find(Select);
    select.simulate('clearIndicatorHover', true);
    expect(component.state()).toHaveProperty('hoveringClearIndicator', true);
  });

  it('should set isClearable to false', () => {
    const component = shallowUserPicker({ isClearable: false });
    const select = component.find(Select);
    expect(select.prop('isClearable')).toEqual(false);
  });

  it('should open menu onFocus', () => {
    const component = shallowUserPicker();
    const select = component.find(Select);
    select.simulate('focus');
    expect(component.state()).toHaveProperty('menuIsOpen', true);
  });

  it('should close menu onBlur', () => {
    const component = shallowUserPicker();
    component.setState({ menuIsOpen: true });
    const select = component.find(Select);
    select.simulate('blur');
    expect(component.state()).toHaveProperty('menuIsOpen', false);
  });

  describe('appearance', () => {
    it('should infer normal appearance if single picker', () => {
      const component = shallowUserPicker();

      expect(component.find(Select).prop('appearance')).toEqual('normal');
    });

    it('should pass in appearance that comes from props', () => {
      const component = shallowUserPicker({
        isMulti: true,
        appearance: 'normal',
      });

      expect(component.find(Select).prop('appearance')).toEqual('normal');
    });
  });

  describe('auto focus', () => {
    it('should autoFocus if open by default', () => {
      const component = shallowUserPicker({ open: true });
      expect(component.find(Select).prop('autoFocus')).toBeTruthy();
    });

    it('should not autoFocus if not open by default', () => {
      const component = shallowUserPicker();
      expect(component.find(Select).prop('autoFocus')).toBeFalsy();
    });

    it('should always autoFocus if prop set to true', () => {
      const component = shallowUserPicker({ autoFocus: true });
      expect(component.find(Select).prop('autoFocus')).toBeTruthy();
    });

    it('should never autoFocus if prop set to false', () => {
      const component = shallowUserPicker({ open: true, autoFocus: false });
      expect(component.find(Select).prop('autoFocus')).toBeFalsy();
    });
  });

  describe('async load', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('should load users when picker open', () => {
      const usersPromise = new Promise<User[]>((resolve) =>
        window.setTimeout(() => resolve(options), 500),
      );
      const loadOptions = jest.fn(() => usersPromise);
      const component = shallowUserPicker({ loadOptions });
      component.setProps({ open: true });
      jest.runAllTimers();
      expect(loadOptions).toHaveBeenCalled();
      return usersPromise.then(() => {
        jest.runAllTimers();
        expect(component.state()).toMatchObject({
          options,
        });
      });
    });

    describe('onInputChange', () => {
      it.each([['input-change'], ['set-value']])(
        'should load users on input change with action "%s"',
        (action) => {
          const usersPromise = new Promise<User[]>((resolve) =>
            window.setTimeout(() => resolve(options), 500),
          );
          const loadOptions = jest.fn(() => usersPromise);
          const component = shallowUserPicker({ loadOptions });
          const select = component.find(Select);
          select.simulate('inputChange', 'some text', { action });
          expect(component.find(Select).prop('isLoading')).toBeTruthy();
          jest.runAllTimers();
          expect(loadOptions).toHaveBeenCalled();
          expect(loadOptions).toHaveBeenCalledWith('some text');
          return usersPromise.then(() => {
            jest.runAllTimers();
            expect(component.state()).toMatchObject({
              options,
            });
          });
        },
      );

      it('should replace old options after new query', () => {
        const options2 = [
          {
            id: 'some-id',
            name: 'Some Value',
            publicName: 'svalue',
          },
          {
            id: 'some-id-2',
            name: 'Second Value',
            publicName: 'svalue2',
          },
        ];
        const promise1 = new Promise<User[]>((resolve) =>
          window.setTimeout(() => resolve(options), 500),
        );
        const promise2 = new Promise<User[]>((resolve) =>
          window.setTimeout(() => resolve(options2), 1000),
        );
        const loadOptions = (search?: string) =>
          search === 'a' ? promise1 : promise2;
        const component = shallowUserPicker({ loadOptions });
        const select = component.find(Select);
        select.simulate('inputChange', 'a', { action: 'input-change' });
        jest.runAllTimers();
        return promise1.then(() => {
          jest.runAllTimers();
          expect(component.state()).toMatchObject({
            options,
          });
          select.simulate('inputChange', 'n', { action: 'input-change' });
          return promise2.then(() => {
            jest.runAllTimers();
            expect(component.state()).toMatchObject({
              options: options2,
            });
          });
        });
      });

      it('should finish resolving even when loadOptions errors', () => {
        const usersPromise = new Promise<User[]>((_, reject) =>
          window.setTimeout(() => reject('Bad loadOptions'), 500),
        );
        const longerPromise = new Promise((resolve) =>
          window.setTimeout(() => resolve(1), 1000),
        );
        const loadOptions = jest.fn(() => usersPromise);
        const component = shallowUserPicker({ loadOptions });

        const select = component.find(Select);
        select.simulate('inputChange', 'a', { action: 'input-change' });
        jest.runAllTimers();
        return usersPromise
          .catch(() => longerPromise)
          .then(() => {
            expect(component.state()).toMatchObject({
              resolving: false,
            });
          });
      });

      it('should call props.onInputChange', () => {
        const onInputChange = jest.fn();
        const component = shallowUserPicker({ onInputChange });
        const select = component.find(Select);
        select.simulate('inputChange', 'some text', { action: 'input-change' });
        expect(onInputChange).toHaveBeenCalled();
      });

      it('should call props.onInputChange with controlled search', () => {
        const onInputChange = jest.fn();
        const component = shallowUserPicker({ onInputChange, search: 'text' });
        const select = component.find(Select);
        select.simulate('inputChange', 'some text', { action: 'input-change' });
        expect(onInputChange).toHaveBeenCalled();
      });

      it('should debounce input change events', () => {
        const usersPromise = new Promise<User[]>((resolve) =>
          window.setTimeout(() => resolve(options), 500),
        );
        const loadOptions = jest.fn(() => usersPromise);
        shallowUserPicker({ loadOptions });

        expect(debounce).toHaveBeenCalledWith(expect.any(Function), 200);
      });
    });

    describe('with session id', () => {
      let analyticsSpy: jest.SpyInstance;
      beforeEach(() => {
        // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
        //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
        analyticsSpy = jest.spyOn(analytics, 'startSession').mockReturnValue({
          id: 'random-session-id',
        });
      });

      afterEach(() => {
        analyticsSpy.mockRestore();
      });

      it('should pass sessionId to load option', () => {
        const loadOptions = jest.fn(() => Promise.resolve(options));
        const component = mountWithIntl(
          getBasePickerWithoutAnalytics({ loadOptions }),
        );
        const input = component.find('input');
        input.simulate('focus');
        expect(loadOptions).toHaveBeenCalledWith(
          undefined,
          'random-session-id',
        );
      });

      const testData = [
        {
          callback: jest.fn(),
          payload: ['random-session-id'],
          prop: 'onFocus',
          toString: () => 'onFocus',
        },
        {
          callback: jest.fn(),
          payload: ['random-session-id'],
          prop: 'onBlur',
          toString: () => 'onBlur',
        },
        {
          callback: jest.fn(),
          payload: ['random-session-id'],
          prop: 'onClose',
          toString: () => 'onClose',
        },
        {
          callback: jest.fn(),
          payload: ['search', 'random-session-id'],
          prop: 'onInputChange',
          propParams: ['search', { action: 'input-change' }],
          toString: () => 'onInputChange',
        },
      ];

      test.each(testData)(
        'should pass session id %s',
        ({ callback, payload, prop, propParams = [] }) => {
          const component = mountWithIntl(
            getBasePickerWithAnalytics({ [prop]: callback, open: true }),
          );
          const input = component.find(Select);
          input.props()[prop](...propParams);
          expect(callback).toHaveBeenCalledWith(...payload);
        },
      );

      it('should pass session id on select when it starts opened', () => {
        const onSelection = jest.fn();
        const component = mountWithIntl(
          getBasePickerWithAnalytics({ onSelection, open: true }),
        );
        const input = component.find(Select);
        input
          .props()
          ['onChange']({ data: 'user-id' }, { action: 'select-option' });
        expect(onSelection).toHaveBeenCalledWith(
          'user-id',
          'random-session-id',
        );
      });

      it('should pass session id on focus before open', () => {
        const onFocus = jest.fn();
        const component = mountWithIntl(
          getBasePickerWithAnalytics({ onFocus }),
        );
        const input = component.find('input');
        input.simulate('focus');
        expect(onFocus).toHaveBeenCalledWith('random-session-id');
      });

      it('should use the same session id on 2nd focus', async () => {
        analyticsSpy
          .mockReturnValueOnce({ id: 'session-first' })
          .mockReturnValueOnce({ id: 'session-second' });
        const onFocus = jest.fn();
        const component = mountWithIntl(
          getBasePickerWithAnalytics({ onFocus }),
        );
        const input = component.find('input');
        input.simulate('focus');
        await component.update();
        input.simulate('focus');
        await component.update();
        expect(onFocus).toHaveBeenCalledTimes(2);
        expect(onFocus).toHaveBeenCalledWith('session-first');
      });

      it('should use new session id for on focus if open is false', async () => {
        analyticsSpy
          .mockReturnValueOnce({ id: 'session-first' })
          .mockReturnValueOnce({ id: 'session-second' });
        const onFocus = jest.fn();
        const component = mountWithIntl(
          getBasePickerWithAnalytics({ onFocus, open: false }),
        );
        const input = component.find('input');
        input.simulate('focus');
        await component.update();
        input.simulate('focus');
        await component.update();
        expect(onFocus).toHaveBeenCalledTimes(2);
        expect(onFocus.mock.calls).toMatchObject([
          ['session-first'],
          ['session-second'],
        ]);
      });
    });

    describe('with defaultOptions', () => {
      it('should render with default options', () => {
        const component = shallowUserPicker({
          isMulti: true,
          defaultValue: [options[0]],
        });

        expect(component.find(Select).prop('value')).toEqual([
          { label: 'Jace Beleren', data: options[0], value: ID_1 },
        ]);
      });

      it('should not remove fixed options', () => {
        const onChange = jest.fn();
        const component = shallowUserPicker({
          isMulti: true,
          defaultValue: [{ ...options[0], fixed: true }],
          onChange,
        });

        const select = component.find(Select);
        const fixedOption = optionToSelectableOption({
          ...options[0],
          fixed: true,
        });
        expect(select.prop('value')).toEqual([fixedOption]);

        select.simulate('change', [], {
          action: 'pop-value',
          removedValue: fixedOption,
        });

        expect(onChange).not.toHaveBeenCalled();

        expect(select.prop('value')).toEqual([fixedOption]);
      });

      it('should not remove fixed options with other values', () => {
        const onChange = jest.fn();
        const fixedUser = { ...options[0], fixed: true };
        const component = shallowUserPicker({
          isMulti: true,
          defaultValue: [fixedUser],
          onChange,
        });

        const fixedOption = optionToSelectableOption(fixedUser);
        expect(component.find(Select).prop('value')).toEqual([fixedOption]);

        const removableOption = optionToSelectableOption(options[1]);
        component
          .find(Select)
          .simulate('change', [fixedOption, removableOption], {
            action: 'select-option',
          });

        component.update();

        expect(component.find(Select).prop('value')).toEqual([
          fixedOption,
          removableOption,
        ]);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
          [fixedUser, options[1]],
          'select-option',
        );

        onChange.mockClear();

        expect(component.find(Select).prop('value')).toEqual([
          fixedOption,
          removableOption,
        ]);

        component.find(Select).simulate('change', [removableOption], {
          action: 'pop-value',
          removedValue: fixedOption,
        });

        component.update();

        expect(onChange).not.toHaveBeenCalled();

        expect(component.find(Select).prop('value')).toEqual([
          fixedOption,
          removableOption,
        ]);
      });
    });

    describe('props.open is true', () => {
      it('should call loadOptions', () => {
        const loadOptions = jest.fn(() => []);
        shallowUserPicker({
          open: true,
          loadOptions,
        });

        expect(loadOptions).toHaveBeenCalledTimes(1);
      });

      it('should call loadOptions with props.search is passed in', () => {
        const loadOptions = jest.fn(() => []);
        shallowUserPicker({
          open: true,
          loadOptions,
          search: 'test',
        });

        expect(loadOptions).toHaveBeenCalledWith('test', expect.any(String));
      });
    });

    describe('maxOptions', () => {
      it('should only pass maxOptions number of options to dropdown in single picker', () => {
        const component = shallowUserPicker({
          options,
          open: true,
          maxOptions: 1,
        });

        expect(component.prop('options')).toHaveLength(1);
        expect(component.prop('options')[0]).toEqual(userOptions[0]);
      });

      it('should not display any options if maxOptions is zero', () => {
        const component = shallowUserPicker({
          options,
          open: true,
          maxOptions: 0,
        });

        expect(component.prop('options')).toHaveLength(0);
      });

      it('should ignore negative number of maxOptions', () => {
        const component = shallowUserPicker({
          options,
          open: true,
          maxOptions: -1,
        });

        expect(component.prop('options')).toHaveLength(2);
      });

      it('should only pass #maxOptions options to dropdown in multi picker', () => {
        const component = shallowUserPicker({
          options,
          open: true,
          maxOptions: 1,
          isMulti: true,
        });

        expect(component.prop('options')).toHaveLength(1);
        expect(component.prop('options')[0]).toEqual(userOptions[0]);
      });

      it('should not consider selected options when passing maxOptions to dropdown', () => {
        const component = shallowUserPicker({
          options,
          value: [options[0]],
          open: true,
          maxOptions: 1,
          isMulti: true,
        });
        expect(component.prop('options')).toHaveLength(1);
        expect(component.prop('options')[0]).toEqual(userOptions[1]);
      });
    });

    describe('inputValue', () => {
      it('should set inputValue to empty string by default', () => {
        const component = shallowUserPicker({ value: options[0] });
        expect(component.find(Select).prop('inputValue')).toEqual('');
      });

      it('onInputChange: should set inputValue to query', () => {
        const component = shallowUserPicker();
        const select = component.find(Select);
        select.simulate('inputChange', 'some text', { action: 'input-change' });
        expect(component.find(Select).prop('inputValue')).toEqual('some text');
      });

      it('onBlur: should clear inputValue', () => {
        const component = shallowUserPicker();
        const select = component.find(Select);
        select.simulate('blur');
        expect(component.find(Select).prop('inputValue')).toEqual('');
      });

      it('onChange: should clear inputValue', () => {
        const component = shallowUserPicker();
        const select = component.find(Select);
        select.simulate('change', userOptions[0], { action: 'select-option' });
        expect(component.find(Select).prop('inputValue')).toEqual('');
      });

      it('single onFocus with value: should set inputValue to value', () => {
        const component = shallowUserPicker({ value: options[0] });
        const select = component.find(Select);
        select.simulate('focus', { target: {} });
        expect(component.find(Select).prop('inputValue')).toEqual(
          options[0].name,
        );
      });

      it('onFocus no value: should have set empty inputValue', () => {
        const component = shallowUserPicker();
        const select = component.find(Select);
        select.simulate('focus', { target: {} });
        expect(component.find(Select).prop('inputValue')).toEqual('');
      });

      it('multi onFocus with value: should have empty inputValue', () => {
        const component = shallowUserPicker({
          value: options[0],
          isMulti: true,
        });
        const select = component.find(Select);
        select.simulate('focus', { target: {} });
        expect(component.find(Select).prop('inputValue')).toEqual('');
      });

      it('should highlight input value on focus', () => {
        const component = shallowUserPicker({ value: options[0] });
        const select = component.find(Select);
        const highlightInput = jest.fn();
        const input = document.createElement('input') as HTMLInputElement;
        input.select = highlightInput;
        select.simulate('focus', { target: input });
        expect(highlightInput).toBeCalledTimes(1);
      });

      it('should clear inputValue on change after focus', () => {
        const component = shallowUserPicker({ value: options[0] });
        const select = component.find(Select);
        select.simulate('focus', {});
        select.simulate('change', null, { action: 'clear' });
        component.update();
        expect(component.find(Select).prop('inputValue')).toBe('');
      });
    });

    it('should blur on escape', () => {
      const component = shallowUserPicker();
      component.setState({ menuIsOpen: true });
      const ref = { blur: jest.fn() };
      (component.instance() as any).handleSelectRef(ref);

      component.find(Select).simulate('keyDown', { keyCode: 27 });
      expect(ref.blur).toHaveBeenCalled();
    });

    it('should prevent default selection event when user inserts space on empty input', () => {
      const component = shallowUserPicker({ options });
      component.setState({ menuIsOpen: true });
      const preventDefault = jest.fn();
      component
        .find(Select)
        .simulate('keyDown', { keyCode: 32, preventDefault });
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should not prevent default event when there is inputValue', () => {
      const component = shallowUserPicker({ options });
      component.setState({ menuIsOpen: true, inputValue: 'test' });
      const preventDefault = jest.fn();
      component
        .find(Select)
        .simulate('keyDown', { keyCode: 32, preventDefault });
      expect(preventDefault).toHaveBeenCalledTimes(0);
    });

    describe('groups and teams', () => {
      const teamOptions: Team[] = [
        {
          id: 'team-123',
          name: 'The A team',
          type: 'team',
          memberCount: 1,
        },
        {
          id: 'team-abc',
          name: 'The B team',
          type: 'team',
          includesYou: true,
        },
      ];

      const groupOptions: Group[] = [
        { id: 'group-90210', name: 'the-bae-goals-group', type: 'group' },
        { id: 'group-111', name: 'groups-that-group-groups', type: 'group' },
      ];

      const selectableTeamOptions: Option[] = optionToSelectableOptions(
        teamOptions,
      );
      const selectableGroupOptions: Option[] = optionToSelectableOptions(
        groupOptions,
      );

      const mixedOptions: OptionData[] = (options as OptionData[])
        .concat(teamOptions)
        .concat(groupOptions);

      const selectableMixedOptions: Option[] = optionToSelectableOptions(
        mixedOptions,
      );

      it('should render select with only teams', () => {
        const component = shallowUserPicker({ options: teamOptions });
        const select = component.find(Select);
        expect(select.prop('options')).toEqual(selectableTeamOptions);
      });

      it('should render select with only groups', () => {
        const component = shallowUserPicker({ options: groupOptions });
        const select = component.find(Select);
        expect(select.prop('options')).toEqual(selectableGroupOptions);
      });

      it('should render select with teams, groups, and users', () => {
        const component = shallowUserPicker({ options: mixedOptions });
        const select = component.find(Select);
        expect(select.prop('options')).toEqual(selectableMixedOptions);
      });

      it('should be able to multi-select a mix of teams, groups, and users', () => {
        const onChange = jest.fn();
        const component = shallowUserPicker({
          options: mixedOptions,
          isMulti: true,
          onChange,
        });

        component.find(Select).simulate('change', selectableMixedOptions, {
          action: 'select-option',
        });

        expect(onChange).toHaveBeenCalledWith(
          mixedOptions.slice(0, 6),
          'select-option',
        );
      });
    });

    describe('analytics', () => {
      const onEvent = jest.fn();

      const createEventMatcher = (
        actionSubject: string,
        action: string,
        analyticAttributes: { [key: string]: any },
      ) =>
        expect.objectContaining({
          payload: expect.objectContaining({
            action,
            actionSubject,
            attributes: expect.objectContaining({
              ...analyticAttributes,
            }),
          }),
        });

      const AnalyticsTestComponent = (props: Partial<UserPickerProps>) => (
        <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
          {getBasePickerWithAnalytics(props)}
        </AnalyticsListener>
      );

      let component: ReactWrapper;

      beforeEach(() => {
        component = mountWithIntl(<AnalyticsTestComponent />);
      });

      afterEach(() => {
        onEvent.mockClear();
      });

      it('should trigger cancel event', () => {
        const input = component.find('input');
        input.simulate('focus');
        input.simulate('blur');
        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'cancelled',
              actionSubject: 'userPicker',
              eventType: 'ui',
              attributes: {
                context: 'test',
                sessionDuration: expect.any(Number),
                packageName: '@atlaskit/user-picker',
                packageVersion: expect.any(String),
                sessionId: expect.any(String),
                journeyId: expect.any(String),
                queryLength: 0,
                spaceInQuery: false,
                pickerType: 'single',
                upKeyCount: 0,
                downKeyCount: 0,
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger pressed event', () => {
        const input = component.find('input');
        input.simulate('focus');
        component.setProps({ options });
        input.simulate('keyDown', { keyCode: 40 });
        input.simulate('keyDown', { keyCode: 40 });
        input.simulate('keyDown', { keyCode: 40 });
        input.simulate('keyDown', { keyCode: 38 });
        input.simulate('keyDown', { keyCode: 13 });
        component.find(Select).prop('onChange')(
          optionToSelectableOption(options[0]),
          {
            action: 'select-option',
          },
        );
        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'pressed',
              actionSubject: 'userPicker',
              eventType: 'ui',
              attributes: {
                context: 'test',
                sessionDuration: expect.any(Number),
                packageName: '@atlaskit/user-picker',
                packageVersion: expect.any(String),
                sessionId: expect.any(String),
                journeyId: expect.any(String),
                queryLength: 0,
                spaceInQuery: false,
                pickerType: 'single',
                upKeyCount: 1,
                downKeyCount: 3,
                position: 0,
                result: { id: ID_1, type: UserType },
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked event', () => {
        const input = component.find('input');
        input.simulate('focus');
        component.setProps({ options });
        input.simulate('keyDown', { keyCode: 40 });
        input.simulate('keyDown', { keyCode: 40 });
        input.simulate('keyDown', { keyCode: 40 });
        input.simulate('keyDown', { keyCode: 38 });
        component.find(Select).prop('onChange')(
          optionToSelectableOption(options[0]),
          {
            action: 'select-option',
          },
        );
        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'userPicker',
              eventType: 'ui',
              attributes: {
                context: 'test',
                sessionDuration: expect.any(Number),
                packageName: '@atlaskit/user-picker',
                packageVersion: expect.any(String),
                journeyId: expect.any(String),
                sessionId: expect.any(String),
                queryLength: 0,
                spaceInQuery: false,
                pickerType: 'single',
                upKeyCount: 1,
                downKeyCount: 3,
                position: 0,
                result: { id: ID_1, type: UserType },
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked event for external user', () => {
        const input = component.find('input');
        input.simulate('focus');
        component.setProps({ externalOptions });
        input.simulate('keyDown', { keyCode: 40 });
        input.simulate('keyDown', { keyCode: 40 });
        input.simulate('keyDown', { keyCode: 40 });
        input.simulate('keyDown', { keyCode: 38 });
        component.find(Select).prop('onChange')(
          optionToSelectableOption(externalOptions[0]),
          {
            action: 'select-option',
          },
        );
        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'userPicker',
              eventType: 'ui',
              attributes: {
                context: 'test',
                sessionDuration: expect.any(Number),
                packageName: '@atlaskit/user-picker',
                packageVersion: expect.any(String),
                journeyId: expect.any(String),
                sessionId: expect.any(String),
                queryLength: 0,
                spaceInQuery: false,
                pickerType: 'single',
                upKeyCount: 1,
                downKeyCount: 3,
                position: -1,
                result: {
                  type: 'external_user',
                  sources: ['google'],
                },
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger cleared event', () => {
        const input = component.find('input');
        input.simulate('focus');
        component.find(Select).prop('onChange')(
          optionToSelectableOption(options[0]),
          {
            action: 'clear',
          },
        );
        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'cleared',
              actionSubject: 'userPicker',
              eventType: 'ui',
              attributes: {
                context: 'test',
                packageName: '@atlaskit/user-picker',
                packageVersion: expect.any(String),
                journeyId: expect.any(String),
                sessionId: expect.any(String),
                values: [],
                pickerType: 'single',
                pickerOpen: true,
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger deleted event', () => {
        component.setProps({ isMulti: true });
        const input = component.find('input');
        input.simulate('focus');
        component.find(Select).prop('onChange')([], {
          action: 'remove-value',
          removedValue: optionToSelectableOption(options[0]),
        });
        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'deleted',
              actionSubject: 'userPickerItem',
              eventType: 'ui',
              attributes: {
                context: 'test',
                packageName: '@atlaskit/user-picker',
                packageVersion: expect.any(String),
                journeyId: expect.any(String),
                sessionId: expect.any(String),
                pickerOpen: true,
                value: { id: options[0].id, type: UserType },
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger deleted event with email id set to null', () => {
        component.setProps({ isMulti: true });
        component = mountWithIntl(
          <AnalyticsTestComponent value={[emailValue]} />,
        );
        const input = component.find('input');
        input.simulate('focus');
        component.find(Select).prop('onChange')([], {
          action: 'remove-value',
          removedValue: optionToSelectableOption(emailValue),
        });
        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'deleted',
              actionSubject: 'userPickerItem',
              attributes: expect.objectContaining({
                value: { id: null, type: EmailType },
              }),
            }),
          }),
          'fabric-elements',
        );
      });

      it('should not trigger deleted event if there was no removed value', () => {
        component.setProps({ isMulti: true });
        const input = component.find('input');
        input.simulate('focus');
        component.find(Select).prop('onChange')([], {
          action: 'pop-value',
          removedValue: undefined,
        });
        expect(onEvent).not.toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'deleted',
            }),
          }),
        );
      });

      it('should trigger failed event', () => {
        component.setProps({
          loadOptions: () => Promise.reject(new Error('some error')),
        });
        const input = component.find('input');
        input.simulate('focus');
        onEvent.mockClear();
        return Promise.resolve()
          .then()
          .then(() => {
            expect(onEvent).toHaveBeenCalledWith(
              expect.objectContaining({
                payload: expect.objectContaining({
                  action: 'failed',
                  actionSubject: 'userPicker',
                  eventType: 'operational',
                  attributes: {
                    context: 'test',
                    packageName: '@atlaskit/user-picker',
                    packageVersion: expect.any(String),
                    pickerType: 'single',
                    journeyId: expect.any(String),
                    sessionId: expect.any(String),
                  },
                }),
              }),
              'fabric-elements',
            );
          });
      });

      it('should set emailId to null for focused event', async () => {
        component = mountWithIntl(
          <AnalyticsTestComponent value={emailValue} />,
        );
        component.setProps({
          open: true,
        });

        component.update();
        await Promise.resolve();

        expect(onEvent).toHaveBeenCalledTimes(1);
        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'focused',
              actionSubject: 'userPicker',
              eventType: 'ui',
              attributes: expect.objectContaining({
                values: [{ id: null, type: EmailType }],
              }),
            }),
          }),
          'fabric-elements',
        );
      });

      describe('searched event', () => {
        it('should fire when opening menu with options', () => {
          component.setProps({
            open: true,
            options,
          });
          return Promise.resolve().then(() => {
            expect(onEvent).toHaveBeenCalledTimes(2);
            expect(onEvent).toHaveBeenCalledWith(
              expect.objectContaining({
                payload: expect.objectContaining({
                  action: 'searched',
                  actionSubject: 'userPicker',
                  eventType: 'operational',
                  attributes: expect.objectContaining({
                    context: 'test',
                    packageVersion: expect.any(String),
                    packageName: '@atlaskit/user-picker',
                    journeyId: expect.any(String),
                    sessionId: expect.any(String),
                    sessionDuration: expect.any(Number),
                    durationSinceInputChange: expect.any(Number),
                    queryLength: 0,
                    results: [
                      { id: ID_1, type: UserType },
                      { id: ID_2, type: UserType },
                    ],
                    pickerType: 'single',
                  }),
                }),
              }),
              'fabric-elements',
            );
          });
        });

        it('should not fire searched if the menu is not open', () => {
          component.setProps({
            options: [options[0]],
          });
          component.update();

          return Promise.resolve().then(() => {
            expect(onEvent).not.toHaveBeenCalled();
          });
        });

        it('should not fire searched if there are no options', () => {
          component.setProps({
            open: true,
          });
          component.update();

          return Promise.resolve().then(() => {
            // Focused event
            expect(onEvent).toHaveBeenCalledTimes(1);
            expect(onEvent).not.toHaveBeenCalledWith(
              expect.objectContaining({
                payload: expect.objectContaining({
                  action: 'searched',
                }),
              }),
            );
          });
        });

        it('should fire searched when options change', () => {
          component.setProps({
            open: true,
            options,
          });

          onEvent.mockClear();

          component.setProps({
            options: [options[0]],
          });

          return Promise.resolve().then(() => {
            expect(onEvent).toHaveBeenCalledTimes(1);
            expect(onEvent).toHaveBeenCalledWith(
              expect.objectContaining({
                payload: expect.objectContaining({
                  action: 'searched',
                  actionSubject: 'userPicker',
                  eventType: 'operational',
                  attributes: expect.objectContaining({
                    context: 'test',
                    packageVersion: expect.any(String),
                    packageName: '@atlaskit/user-picker',
                    journeyId: expect.any(String),
                    sessionId: expect.any(String),
                    sessionDuration: expect.any(Number),
                    durationSinceInputChange: expect.any(Number),
                    queryLength: 0,
                    results: [{ id: ID_1, type: UserType }],
                    pickerType: 'single',
                  }),
                }),
              }),
              'fabric-elements',
            );
          });
        });

        it('should fire searched when value changed', () => {
          component.setProps({
            open: true,
            options,
          });

          onEvent.mockClear();

          component
            .find(Select)
            .props()
            .onChange(
              [{ id: ID_1, name: 'Jace Beleren', publicName: 'jbeleren' }],
              'select-option',
            );

          return Promise.resolve().then(() => {
            expect(onEvent).toHaveBeenCalledTimes(1);
            expect(onEvent).toHaveBeenCalledWith(
              expect.objectContaining({
                payload: expect.objectContaining({
                  action: 'searched',
                  actionSubject: 'userPicker',
                  eventType: 'operational',
                  attributes: expect.objectContaining({
                    context: 'test',
                    packageVersion: expect.any(String),
                    packageName: '@atlaskit/user-picker',
                    journeyId: expect.any(String),
                    sessionId: expect.any(String),
                    sessionDuration: expect.any(Number),
                    durationSinceInputChange: expect.any(Number),
                    queryLength: 0,
                    results: [
                      { id: ID_1, type: UserType },
                      { id: ID_2, type: UserType },
                    ],
                    pickerType: 'single',
                  }),
                }),
              }),
              'fabric-elements',
            );
          });
        });

        describe('with journeyId', () => {
          let analyticsSpy: jest.SpyInstance;

          beforeEach(() => {
            analyticsSpy = jest
              .spyOn(analytics, 'startSession')
              .mockReturnValue({
                id: 'random-session-id',
                start: 0,
                inputChangeTime: 0,
                upCount: 0,
                downCount: 0,
              });
          });

          afterEach(() => {
            analyticsSpy.mockRestore();
          });
          it('should have the same id for journey id and session id on focus', async () => {
            const mockSessionId = 'session-first';
            analyticsSpy
              .mockReturnValueOnce({ id: mockSessionId })
              .mockReturnValue({ id: 'random-id' });
            component.setProps({ isMulti: true });
            const input = component.find('input');
            input.simulate('focus');

            await Promise.resolve();
            expect(onEvent).toHaveBeenCalledTimes(1);
            expect(onEvent).toHaveBeenCalledWith(
              createEventMatcher('userPicker', 'focused', {
                journeyId: mockSessionId,
                sessionId: mockSessionId,
              }),
              'fabric-elements',
            );
          });
          it('should use different journey id on second focus', async () => {
            const firstMockSessionId = 'session-first';
            const secondMockSessionId = 'session-second';
            analyticsSpy
              .mockReturnValueOnce({ id: firstMockSessionId })
              .mockReturnValueOnce({ id: secondMockSessionId });
            component.setProps({ isMulti: true });
            const input = component.find('input');
            input.simulate('focus');
            input.simulate('blur');
            input.simulate('focus');

            await Promise.resolve();
            expect(onEvent).toHaveBeenCalledTimes(3);
            expect(onEvent).toHaveBeenNthCalledWith(
              1,
              createEventMatcher('userPicker', 'focused', {
                journeyId: firstMockSessionId,
                sessionId: firstMockSessionId,
              }),
              'fabric-elements',
            );
            expect(onEvent).toHaveBeenNthCalledWith(
              2,
              createEventMatcher('userPicker', 'cancelled', {
                journeyId: firstMockSessionId,
                sessionId: firstMockSessionId,
              }),
              'fabric-elements',
            );
            expect(onEvent).toHaveBeenNthCalledWith(
              3,
              createEventMatcher('userPicker', 'focused', {
                journeyId: secondMockSessionId,
                sessionId: secondMockSessionId,
              }),
              'fabric-elements',
            );
          });
          it('should use same journey id across multiple selects', () => {
            const firstMockSessionId = 'session-first';
            const secondMockSessionId = 'session-second';
            analyticsSpy
              .mockReturnValueOnce({ id: firstMockSessionId })
              .mockReturnValue({ id: secondMockSessionId });
            component.setProps({ isMulti: true, options });
            const input = component.find('input');
            input.simulate('focus');

            component.find(Select).prop('onChange')(
              optionToSelectableOption(options[0]),
              {
                action: 'select-option',
              },
            );
            component.find(Select).prop('onChange')(
              optionToSelectableOption(options[1]),
              {
                action: 'select-option',
              },
            );

            expect(onEvent).toHaveBeenCalledWith(
              createEventMatcher('userPicker', 'focused', {
                journeyId: firstMockSessionId,
                sessionId: firstMockSessionId,
              }),
              'fabric-elements',
            );

            expect(onEvent).toHaveBeenCalledWith(
              createEventMatcher('userPicker', 'clicked', {
                journeyId: firstMockSessionId,
                sessionId: firstMockSessionId,
              }),
              'fabric-elements',
            );
            expect(onEvent).toHaveBeenCalledWith(
              createEventMatcher('userPicker', 'clicked', {
                journeyId: firstMockSessionId,
                sessionId: secondMockSessionId,
              }),
              'fabric-elements',
            );
          });
        });
      });
      describe('PII checks', () => {
        it('should set invalid ids as null for events containing ids fired when option is clicked', () => {
          const invalidOption = mixedOptions.find(
            (value) => value.id === INVALID_ID_1,
          );
          if (invalidOption) {
            component.setProps({ options: mixedOptions, value: invalidOption });

            const input = component.find('input');
            input.simulate('focus');

            component.find(Select).prop('onChange')(
              optionToSelectableOption(invalidOption),
              {
                action: 'select-option',
              },
            );

            // focused -> searched -> clicked
            expect(onEvent).toHaveBeenCalledWith(
              createEventMatcher('userPicker', 'focused', {
                values: expect.arrayContaining([{ id: null, type: 'user' }]),
              }),
              'fabric-elements',
            );
            expect(onEvent).toHaveBeenCalledWith(
              createEventMatcher('userPicker', 'searched', {
                results: expect.arrayContaining([
                  { id: ID_1, type: 'user' },
                  { id: ID_2, type: 'user' },
                  { id: OLD_AAID, type: 'user' },
                  { id: GROUP_ID, type: 'group' },
                  { id: TEAM_ID, type: 'team' },
                  { id: null, type: 'user' },
                  { id: null, type: 'user' },
                ]),
              }),
              'fabric-elements',
            );
            expect(onEvent).toHaveBeenCalledWith(
              createEventMatcher('userPicker', 'clicked', {
                result: { id: null, type: 'user' },
              }),
              'fabric-elements',
            );
            checkForPII(onEvent);
          } else {
            fail();
          }
        });

        it('should set invalid ids as null for events fired when selected values are cleared', () => {
          // clear event only fired for single pickers
          const invalidOption = mixedOptions.find(
            (value) => value.id === INVALID_ID_1,
          );
          if (invalidOption) {
            component.setProps({
              options: mixedOptions,
              value: invalidOption,
            });

            const input = component.find('input');
            input.simulate('focus');

            component.find(Select).prop('onChange')(
              optionToSelectableOption(options[0]),
              {
                action: 'clear',
              },
            );

            // focused -> cleared
            expect(onEvent).toHaveBeenCalledWith(
              createEventMatcher('userPicker', 'focused', {
                values: expect.arrayContaining([{ id: null, type: 'user' }]),
              }),
              'fabric-elements',
            );
            expect(onEvent).toHaveBeenCalledWith(
              createEventMatcher('userPicker', 'cleared', {
                values: expect.arrayContaining([{ id: null, type: 'user' }]),
              }),
              'fabric-elements',
            );
            checkForPII(onEvent);
          } else {
            fail();
          }
        });

        it('should set invalid ids as null for events fired when selected user is removed', () => {
          const validOption = mixedOptions.find((value) => value.id === ID_1);
          const invalidOption = mixedOptions.find(
            (value) => value.id === INVALID_ID_1,
          );
          if (validOption && invalidOption) {
            component.setProps({
              options: mixedOptions,
              value: [validOption, invalidOption],
            });

            const input = component.find('input');
            input.simulate('focus');

            component.find(Select).prop('onChange')(
              optionToSelectableOption(invalidOption),
              {
                action: 'remove-value',
                removedValue: optionToSelectableOption(invalidOption),
              },
            );
            checkForPII(onEvent);

            // focused -> removed
            expect(onEvent).toHaveBeenCalledWith(
              createEventMatcher('userPicker', 'focused', {
                values: expect.arrayContaining([
                  { id: ID_1, type: 'user' },
                  { id: null, type: 'user' },
                ]),
              }),
              'fabric-elements',
            );
            expect(onEvent).toHaveBeenCalledWith(
              createEventMatcher('userPickerItem', 'deleted', {
                value: { id: null, type: 'user' },
              }),
              'fabric-elements',
            );
          } else {
            fail();
          }
        });

        /**
         * Checks for PII defined in the mock users.
         * User-picker has been involved with PII leaks in analytics in the past.
         * Please add this check when testing for event firing.
         */
        const checkForPII = (mockOnEvent: jest.Mock) => {
          mockOnEvent.mock.calls.map((args) => {
            // payload is always the first argument
            const payloadString = JSON.stringify(args[0]);
            // check against defined mock users
            expect(payloadString).not.toMatch(`\"${INVALID_ID_1}\"`);
            expect(payloadString).not.toMatch(`\"${INVALID_ID_2}\"`);

            // general regex testing
            // check against full name
            expect(payloadString).not.toMatch(/\"[a-zA-Z]+ [a-zA-Z]+\"/);
            // check against email
            expect(payloadString).not.toMatch(
              /\"[a-zA-Z0-9_\-+\'`?=*%$#!\^{|}~.]+@([a-zA-Z0-9-]+\.)+([a-zA-Z0-9]+)\"/,
            );
          });
        };
      });
    });
  });
});
