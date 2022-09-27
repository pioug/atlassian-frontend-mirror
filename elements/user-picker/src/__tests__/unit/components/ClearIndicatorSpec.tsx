import { components } from '@atlaskit/select';
import Tooltip from '@atlaskit/tooltip';
import noop from 'lodash/noop';
import { mount } from 'enzyme';
import React from 'react';
import { ClearIndicator } from '../../../components/ClearIndicator';

describe('ClearIndicator', () => {
  const renderClearIndicator = (props: any) =>
    mount(<ClearIndicator {...props} getStyles={noop} cx={noop} />);

  it('should clear value onMouseDown', () => {
    const clearValue = jest.fn();
    const component = renderClearIndicator({
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
    const component = renderClearIndicator({
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
    const component = renderClearIndicator({
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

  // https://product-fabric.atlassian.net/browse/UR-3963
  it.skip('should pass in clearValueLabel to tooltip', async () => {
    const component = renderClearIndicator({
      selectProps: { clearValueLabel: 'test' },
    });

    // fallback
    component.find(components.ClearIndicator);

    // await tooltip loading
    await new Promise(setImmediate);
    component.update();

    component.find(components.ClearIndicator);
    const tooltip = component.find(Tooltip);

    expect(tooltip).toHaveLength(1);
    expect(tooltip.prop('content')).toEqual('test');
  });

  it('should not render tooltip if no clearValueLabel', async () => {
    const component = renderClearIndicator({ selectProps: {} });

    component.find(components.ClearIndicator);

    // await tooltip loading
    await new Promise(setImmediate);
    component.update();

    component.find(components.ClearIndicator);
    const tooltip = component.find(Tooltip);

    expect(tooltip).toHaveLength(0);
  });
});
