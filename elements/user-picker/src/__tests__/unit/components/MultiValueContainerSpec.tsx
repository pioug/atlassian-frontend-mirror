import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MultiValueContainer } from '../../../components/MultiValueContainer';
import { renderProp } from '../_testUtils';

describe('MultiValueContainer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const selectProps = {
    value: [1],
    options: [1, 2, 3],
    isDisabled: false,
    isFocused: true,
  };

  const findInput = (component: ShallowWrapper<any>) =>
    (component.find(FormattedMessage as React.ComponentClass<any>).exists()
      ? renderProp(
          component.find(FormattedMessage as React.ComponentClass<any>),
          'children',
          'add more people...',
        )
      : component
    ).find('input');

  const shallowValueContainer = (props: any) =>
    shallow(<MultiValueContainer selectProps={selectProps} {...props} />);

  test.each<[string | undefined, number[], boolean]>([
    ['add more people...', selectProps.value, false],
    ['Enter more...', selectProps.value, true],
    ['add more people...', selectProps.options, false],
    [undefined, [], false],
  ])(
    'should set placeholder to "%s" when (value: %p)',
    (placeholder, value, override) => {
      const component = shallowValueContainer({
        children: [
          <div key="placeholder">Placeholder</div>,
          <input key="input" type="text" />,
        ],
        selectProps: {
          ...selectProps,
          value,
          addMoreMessage: override ? placeholder : undefined,
        },
      });

      const input = findInput(component);

      expect(input.prop('placeholder')).toEqual(placeholder);
    },
  );

  it('should not display add more placeholder if disabled', () => {
    const component = shallowValueContainer({
      children: [
        <div key="placeholder">Placeholder</div>,
        <input key="input" type="text" />,
      ],
      selectProps: {
        ...selectProps,
        isDisabled: true,
      },
    });
    const input = findInput(component);

    expect(input.prop('placeholder')).toBeUndefined();
  });

  it('should scroll to bottom when adding new items and focused', () => {
    const component = shallowValueContainer({
      children: 'some text',
      getValue: jest.fn(() => []),
    });

    const scroll = jest.spyOn(
      component.instance() as MultiValueContainer,
      'scrollToBottom',
    );

    expect(component.state()).toHaveProperty('valueSize', 0);
    component.setProps({ getValue: jest.fn(() => [1]) });
    jest.runAllTimers();
    expect(component.state()).toHaveProperty('valueSize', 1);
    expect(component.state()).toHaveProperty('previousValueSize', 0);

    expect(scroll).toHaveBeenCalledTimes(1);
  });

  it('should not scroll if not in focus', () => {
    const unfocusedSelectProps = {
      ...selectProps,
      isFocused: false,
    };
    const component = shallowValueContainer({
      children: 'some text',
      getValue: jest.fn(() => []),
      selectProps: unfocusedSelectProps,
    });
    const scroll = jest.spyOn(
      component.instance() as MultiValueContainer,
      'scrollToBottom',
    );

    expect(component.state()).toHaveProperty('valueSize', 0);
    component.setProps({ getValue: jest.fn(() => [1]) });
    jest.runAllTimers();
    expect(component.state()).toHaveProperty('valueSize', 1);
    expect(component.state()).toHaveProperty('previousValueSize', 0);

    expect(scroll).not.toHaveBeenCalled();
  });

  it('should not scroll when removing an item', () => {
    const component = shallowValueContainer({
      children: 'some text',
      getValue: jest.fn(() => [1]),
    });
    const scroll = jest.spyOn(
      component.instance() as MultiValueContainer,
      'scrollToBottom',
    );

    expect(component.state()).toHaveProperty('valueSize', 1);
    component.setProps({ getValue: jest.fn(() => []) });
    jest.runAllTimers();
    expect(component.state()).toHaveProperty('valueSize', 0);
    expect(component.state()).toHaveProperty('previousValueSize', 1);

    expect(scroll).not.toHaveBeenCalled();
  });
});
