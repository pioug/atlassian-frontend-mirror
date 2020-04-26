import React from 'react';

import { shallow } from 'enzyme';

import RenderBlocker from '../../RenderBlocker';

describe('RenderBlocker', () => {
  let renderSpy;

  afterEach(() => {
    if (renderSpy) {
      renderSpy.mockRestore();
    }
  });
  it('should render children', () => {
    const wrapper = shallow(<RenderBlocker>test</RenderBlocker>);

    expect(wrapper.text()).toBe('test');
  });

  it('should NOT re-render if no non-children props change', () => {
    const wrapper = shallow(
      <RenderBlocker myProp="foo" anotherProp="bar">
        test
      </RenderBlocker>,
    );

    renderSpy = jest.spyOn(wrapper.instance(), 'render');

    wrapper.setProps({});

    expect(renderSpy).not.toHaveBeenCalled();
  });

  it('should render if any supplied props have changed', () => {
    const wrapper = shallow(
      <RenderBlocker myProp="foo" anotherProp="bar">
        test
      </RenderBlocker>,
    );

    renderSpy = jest.spyOn(wrapper.instance(), 'render');

    wrapper.setProps({ myProp: 'baz' });

    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should NOT render if props change deeply but not shallow', () => {
    const myObj = { foo: 'bar' };
    const wrapper = shallow(
      <RenderBlocker myProp={myObj} anotherProp="bar">
        test
      </RenderBlocker>,
    );

    renderSpy = jest.spyOn(wrapper.instance(), 'render');

    myObj.foo = 'baz';
    wrapper.setProps({ myProp: myObj });

    expect(renderSpy).not.toHaveBeenCalled();
  });

  describe('when blockOnChange is set, behaves the opposite', () => {
    it('should re-render if no props change', () => {
      const wrapper = shallow(
        <RenderBlocker blockOnChange myProp="foo" anotherProp="bar">
          test
        </RenderBlocker>,
      );

      renderSpy = jest.spyOn(wrapper.instance(), 'render');

      wrapper.setProps({});

      expect(renderSpy).toHaveBeenCalledTimes(1);

      renderSpy.mockRestore();
    });

    it('should NOT render if any supplied props have changed', () => {
      const wrapper = shallow(
        <RenderBlocker blockOnChange myProp="foo" anotherProp="bar">
          test
        </RenderBlocker>,
      );

      renderSpy = jest.spyOn(wrapper.instance(), 'render');

      wrapper.setProps({ myProp: 'baz' });

      expect(renderSpy).not.toHaveBeenCalled();

      renderSpy.mockRestore();
    });

    it('should render if props change deeply but not shallow', () => {
      const myObj = { foo: 'bar' };
      const wrapper = shallow(
        <RenderBlocker blockOnChange myProp={myObj} anotherProp="bar">
          test
        </RenderBlocker>,
      );

      renderSpy = jest.spyOn(wrapper.instance(), 'render');

      myObj.foo = 'baz';
      wrapper.setProps({ myProp: myObj });

      expect(renderSpy).toHaveBeenCalledTimes(1);

      renderSpy.mockRestore();
    });
  });
});
