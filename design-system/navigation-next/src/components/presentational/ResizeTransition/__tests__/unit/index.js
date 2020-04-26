import React from 'react';

import { mount } from 'enzyme';

import ResizeTransition from '../../index';

const defaultProps = {
  from: [0],
  in: true,
  productNavWidth: 100,
  properties: ['paddingLeft'],
  to: [100],
  userIsDragging: true,
};

describe('ResizeTransition', () => {
  it('should not trigger animations on first-page load', () => {
    const wrapper = mount(
      <ResizeTransition {...defaultProps}>
        {() => <span>content</span>}
      </ResizeTransition>,
    );

    expect(wrapper.find('Transition').props().timeout).toBe(0);

    wrapper.setProps({ userIsDragging: false });

    expect(wrapper.find('Transition').props().timeout).toBe(300);
  });
});
