import React from 'react';

import { mount } from 'enzyme';

import InteractionStateManager from '../../index';

describe('InteractionStateManager', () => {
  it('should pass the default state values to children', () => {
    const wrapper = mount(
      <InteractionStateManager>
        {({ isActive, isHover, isFocused }) => (
          <div className="children">
            {isActive && <span className="active" />}
            {isHover && <span className="hover" />}
            {isFocused && <span className="focus" />}
          </div>
        )}
      </InteractionStateManager>,
    );

    expect(wrapper.find('.active')).toHaveLength(0);
    expect(wrapper.find('.hover')).toHaveLength(0);
    expect(wrapper.find('.focus')).toHaveLength(0);
  });

  it('should change hover state when mouse is over the element', () => {
    const wrapper = mount(
      <InteractionStateManager>
        {({ isActive, isHover }) => (
          <div className="children">
            {isActive && <span className="active" />}
            {isHover && <span className="hover" />}
          </div>
        )}
      </InteractionStateManager>,
    );

    wrapper.simulate('mouseenter');

    expect(wrapper.state()).toEqual({
      isHover: true,
      isActive: false,
      isFocused: false,
    });
  });

  it('should change hover and active states when mouse is over and user starts click event on the element', () => {
    const wrapper = mount(
      <InteractionStateManager>
        {({ isActive, isHover }) => (
          <div className="children">
            {isActive && <span className="active" />}
            {isHover && <span className="hover" />}
          </div>
        )}
      </InteractionStateManager>,
    );
    const preventDefault = jest.fn();
    wrapper.simulate('mouseenter');
    wrapper.simulate('mousedown', { preventDefault });

    expect(wrapper.state()).toEqual({
      isHover: true,
      isActive: true,
      isFocused: false,
    });
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it('should return to hover state after the element is clicked', () => {
    const wrapper = mount(
      <InteractionStateManager>
        {({ isActive, isHover }) => (
          <div className="children">
            {isActive && <span className="active" />}
            {isHover && <span className="hover" />}
          </div>
        )}
      </InteractionStateManager>,
    );

    const preventDefault = jest.fn();
    wrapper.simulate('mouseenter');
    wrapper.simulate('mousedown', { preventDefault });
    wrapper.simulate('mouseup', { preventDefault });

    expect(wrapper.state()).toEqual({
      isHover: true,
      isActive: false,
      isFocused: false,
    });
    expect(preventDefault).toHaveBeenCalledTimes(2);
  });

  it('should change isFocused state when the element is focused or blurred', () => {
    const wrapper = mount(
      <InteractionStateManager>
        {() => <div>Focus</div>}
      </InteractionStateManager>,
    );

    wrapper.simulate('focus');
    expect(wrapper.state()).toEqual({
      isHover: false,
      isActive: false,
      isFocused: true,
    });

    wrapper.simulate('blur');
    expect(wrapper.state()).toEqual({
      isHover: false,
      isActive: false,
      isFocused: false,
    });
  });
});
