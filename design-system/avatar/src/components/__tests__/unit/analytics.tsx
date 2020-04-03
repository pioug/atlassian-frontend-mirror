import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import React from 'react';
import { mount } from 'enzyme';

import Avatar from '../../Avatar';

describe('Avatar', () => {
  it('should call onClick analytics event when onClick is not provided', () => {
    const mockFn = jest.fn();
    const wrapper = mount(<Avatar onClick={mockFn} />);
    const inner = wrapper.find('Inner');

    inner.prop('onClick')!({} as React.MouseEvent<HTMLButtonElement>);

    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn.mock.calls[0][1]).toBeInstanceOf(UIAnalyticsEvent);
  });
  it('should not call onClick analytics event when onClick is not provided', () => {
    const wrapper = mount(<Avatar />);
    const inner = wrapper.find('Inner');

    expect(inner.prop('onClick')).toBeUndefined();
  });
});
