import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import React from 'react';
import { mount } from 'enzyme';

import ColorPicker from '../..';

describe('ColorPicker', () => {
  it('should call onChange analytics event when onChange is not provided', () => {
    const mockFn = jest.fn();
    const value = { value: 'blue', label: 'Blue' };
    const wrapper = mount(<ColorPicker palette={[value]} onChange={mockFn} />);
    const select = wrapper.find('PopupSelect');

    (select.prop('onChange') as any)(value);

    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn).toBeCalledWith(value.value, expect.any(UIAnalyticsEvent));
  });
});
