import React from 'react';
import { mount } from 'enzyme';
import SizeDetector from '../..';
import { name } from '../../version.json';

describe(name, () => {
  const createChildWithSpy = spy => args => spy(args);

  beforeAll(() => {
    requestAnimationFrame.reset();
  });

  afterEach(() => {
    requestAnimationFrame.reset();
  });

  it('should call the children with null values at first and update with actual value as soon as object is loaded', () => {
    const spy = jest.fn();
    mount(<SizeDetector>{createChildWithSpy(spy)}</SizeDetector>);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ height: null, width: null });
    // clear calls from the mock and object is loaded here to stepping over RAF
    spy.mockClear();
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toBeCalledWith({ height: 0, width: 0 });
  });

  it('should use requestAnimationFrame to queue the subsequent resize measurements', () => {
    const spy = jest.fn();
    mount(<SizeDetector>{createChildWithSpy(spy)}</SizeDetector>);
    expect(spy).toHaveBeenCalledTimes(1);
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should call cancelAnimationFrame when unmounted', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <SizeDetector>{createChildWithSpy(spy)}</SizeDetector>,
    );
    // initial call is done with adding it to RAF queue and the call after object onload is queued
    expect(spy).toHaveBeenCalledWith({ height: null, width: null });
    spy.mockClear();
    wrapper.unmount();
    requestAnimationFrame.flush();
    // frame is queue after object element load is not called
    expect(spy).not.toHaveBeenCalled();
  });

  // NOTE: enzyme doesn't fully mock object.contentDocument, so we cannot simulate
  // a resize event in the normal way. Triggering the called function is the alternative.
  it('should pass updated size measurements to the child function on resize after an animationFrame', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <SizeDetector>{createChildWithSpy(spy)}</SizeDetector>,
    );
    expect(spy).toHaveBeenCalledTimes(1);
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(2);
    wrapper.instance().handleResize();
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(3);
    wrapper.instance().handleResize();
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(4);
  });

  // NOTE: Enzyme does not seem to support offsetWidth/offsetHeight on elements, so we cannot
  // reliably simulate detection of width/height changes for now. Suggestions welcome!
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should call the child function with updated width and height on resize', () => {});
});
