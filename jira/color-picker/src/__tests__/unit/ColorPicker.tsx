import React from 'react';
import { shallow } from 'enzyme';

import {
  ColorPickerWithoutAnalytics as ColorPicker,
  ColorPickerProps,
} from '../..';

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
});
