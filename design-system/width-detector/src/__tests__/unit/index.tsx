import React from 'react';
import { mount } from 'enzyme';
import WidthDetector from '../..';
import { name } from '../../version.json';

// requestAnimationFrame is stubbed with `raf-stub`
const requestAnimationFrame = window.requestAnimationFrame as any;

describe(name, () => {
  const createChildWithSpy = (spy: Function) => (args: any) => spy(args);

  beforeAll(() => {
    requestAnimationFrame.reset();
  });

  afterEach(() => {
    requestAnimationFrame.reset();
  });

  it('should pass width to child function', () => {
    const spy = jest.fn();
    mount(<WidthDetector>{createChildWithSpy(spy)}</WidthDetector>);
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(0);
  });

  it('should use requestAnimationFrame to queue resize measurements', () => {
    const spy = jest.fn();
    mount(<WidthDetector>{createChildWithSpy(spy)}</WidthDetector>);
    expect(spy).toHaveBeenCalledTimes(1);
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should call cancelAnimationFrame when unmounted', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <WidthDetector>{createChildWithSpy(spy)}</WidthDetector>,
    );
    // initial frame is queued
    expect(spy).toHaveBeenCalledTimes(1);
    wrapper.unmount();
    requestAnimationFrame.flush();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // // NOTE: enzyme doesn't fully mock object.contentDocument, so we cannot simulate
  // // a resize event in the normal way. Triggering the called function is the alternative.
  it('should pass updated size measurements to the child function on resize after an animationFrame', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <WidthDetector>{createChildWithSpy(spy)}</WidthDetector>,
    );
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(2);
    (wrapper.instance() as WidthDetector).handleResize();
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(3);
    (wrapper.instance() as WidthDetector).handleResize();
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(4);
  });

  // // NOTE: Enzyme does not seem to support offsetWidth/offsetHeight on elements, so we cannot
  // // reliably simulate detection of width/height changes for now. Suggestions welcome!
  // // eslint-disable-next-line jest/no-disabled-tests
  // it.skip('should call the child function with updated width and height on resize', () => {});
});
