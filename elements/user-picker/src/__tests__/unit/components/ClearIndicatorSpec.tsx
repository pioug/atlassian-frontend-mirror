import { components } from '@atlaskit/select';
import Tooltip from '@atlaskit/tooltip';
import { shallow } from 'enzyme';
import React from 'react';
import { ClearIndicator } from '../../../components/ClearIndicator';

describe('ClearIndicator', () => {
  const shallowClearIndicator = (props: any) =>
    shallow(<ClearIndicator {...props} />);

  it('should clear value onMouseDown', () => {
    const clearValue = jest.fn();
    const component = shallowClearIndicator({
      clearValue,
      selectProps: { isFocused: true },
    });

    const { onMouseDown } = component
      .find(components.ClearIndicator!)
      .prop('innerProps');

    onMouseDown();

    expect(clearValue).toHaveBeenCalledTimes(1);
  });

  it('should call stopPropagation if not focused', () => {
    const component = shallowClearIndicator({
      clearValue: jest.fn(),
      selectProps: { isFocused: false },
    });

    const { onMouseDown } = component
      .find(components.ClearIndicator!)
      .prop('innerProps');
    const stopPropagation = jest.fn();
    onMouseDown({ stopPropagation });
    expect(stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('should not call stopPropagation if focused', () => {
    const component = shallowClearIndicator({
      clearValue: jest.fn(),
      selectProps: { isFocused: true },
    });

    const { onMouseDown } = component
      .find(components.ClearIndicator!)
      .prop('innerProps');
    const stopPropagation = jest.fn();
    onMouseDown({ stopPropagation });
    expect(stopPropagation).toHaveBeenCalledTimes(0);
  });

  it('should pass in clearValueLabel to tooltip', () => {
    const component = shallowClearIndicator({
      selectProps: { clearValueLabel: 'test' },
    });
    component.simulate('hover');
    const tooltip = component.find(Tooltip);
    expect(tooltip).toHaveLength(1);
    expect(tooltip.prop('content')).toEqual('test');
  });

  it('should not render tooltip if no clearValueLabel', () => {
    const component = shallowClearIndicator({ selectProps: {} });
    component.simulate('hover');
    const tooltip = component.find(Tooltip);
    expect(tooltip.prop('content')).toBeUndefined();
  });
});
