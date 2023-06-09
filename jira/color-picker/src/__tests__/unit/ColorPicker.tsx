import React from 'react';
import { shallow } from 'enzyme';

import {
  ColorPickerWithoutAnalytics as ColorPicker,
  ColorPickerProps,
} from '../..';
import Trigger from '../../components/Trigger';

describe('ColorPicker', () => {
  test('should pass default popperProps to PopupSelect', () => {
    const mockFn = jest.fn();
    const value = { value: 'blue', label: 'Blue' };
    const wrapper = shallow(
      <ColorPicker palette={[value]} onChange={mockFn} />,
    );

    const select = wrapper.find('PopupSelect');

    expect(select.prop('popperProps')).toEqual({
      strategy: 'fixed',
      modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
      placement: 'bottom-start',
    });
  });

  test('should popperProps to PopupSelect', () => {
    const mockFn = jest.fn();
    const value = { value: 'blue', label: 'Blue' };
    const popperProps: ColorPickerProps['popperProps'] = {
      placement: 'bottom',
    };
    const wrapper = shallow(
      <ColorPicker
        palette={[value]}
        popperProps={popperProps}
        onChange={mockFn}
      />,
    );

    const select = wrapper.find('PopupSelect');

    expect(select.prop('popperProps')).toEqual(popperProps);
  });

  test('should not submit form when click on trigger', () => {
    const mockSubmit = jest.fn();
    const wrapper = shallow(
      <form onSubmit={mockSubmit}>
        <Trigger value="blue" label="Blue" expanded={false} />
      </form>,
    );

    expect(wrapper.find(Trigger).length).toBe(1);
    wrapper.find(Trigger).simulate('click');
    expect(mockSubmit.mock.calls.length).toBe(0);
  });
});
