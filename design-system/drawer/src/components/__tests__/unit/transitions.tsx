import React from 'react';

import { mount } from 'enzyme';

import { transitionDurationMs } from '../../../constants';
import { Fade, Slide } from '../../transitions';

describe('Drawer Transitions', () => {
  describe('Slide', () => {
    let wrapper: any;

    beforeEach(() => {
      jest.useFakeTimers();
      wrapper = mount(<Slide in component="some-test-data" />);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should use the default styles to start the animation', () => {
      const { defaultStyles } = wrapper.find('TransitionHandler').props();

      expect(defaultStyles).toMatchObject({
        transition:
          'transform 220ms cubic-bezier(0.2, 0, 0, 1), width 220ms cubic-bezier(0.2, 0, 0, 1)',
        transform: 'translate3d(-100%,0,0)',
      });
    });

    it('should add the other element props', () => {
      const { ...otherProps } = wrapper.find('TransitionHandler').props();
      expect(otherProps).toMatchObject({ component: 'some-test-data' });
    });

    it('should use the transition styles', () => {
      const { transitionStyles } = wrapper.find('TransitionHandler').props();

      expect(transitionStyles).toMatchObject({
        entered: { transform: null },
        exited: { transform: 'translate3d(-100%,0,0)' },
      });
    });

    it('should set "unmountOnExit" to true as default', () => {
      const { unmountOnExit } = wrapper.find('Transition').props();

      expect(unmountOnExit).toBeTruthy();
    });

    it('should update "unmountOnExit"', () => {
      const wrapper: any = mount(<Slide in shouldUnmountOnExit={false} />);

      const { unmountOnExit } = wrapper.find('Transition').props();
      expect(unmountOnExit).toBeFalsy();
    });

    it('should pass onExited to the Transition', () => {
      const onExited = jest.fn();
      const slide = mount(<Slide in onExited={onExited} />);

      expect(slide.find('Transition').props()).toMatchObject({ onExited });
    });

    it('should not call onEntered during the enter transition', () => {
      const onEntered = jest.fn();

      const slide = mount(<Slide in={false} onEntered={onEntered} />);
      slide.setProps({ in: true });

      jest.advanceTimersByTime(transitionDurationMs - 20);
      expect(onEntered).not.toHaveBeenCalled();
    });

    it('should call onEntered after the enter transition has finished', () => {
      const onEntered = jest.fn();

      const slide = mount(<Slide in={false} onEntered={onEntered} />);
      slide.setProps({ in: true });

      jest.advanceTimersByTime(transitionDurationMs);
      expect(onEntered).toHaveBeenCalled();
    });

    it('should not call onEntered if the enter transition never completes', () => {
      const onEntered = jest.fn();

      const slide = mount(<Slide in={false} onEntered={onEntered} />);
      slide.setProps({ in: true });
      jest.advanceTimersByTime(transitionDurationMs - 20);
      slide.setProps({ in: false });
      jest.advanceTimersByTime(20);

      expect(onEntered).not.toHaveBeenCalled();
    });

    it('should not call onExited during the exit transition', () => {
      const onExited = jest.fn();

      const slide = mount(<Slide in={true} onExited={onExited} />);
      slide.setProps({ in: false });

      jest.advanceTimersByTime(transitionDurationMs - 20);
      expect(onExited).not.toHaveBeenCalled();
    });

    it('should call onExited after the exit transition has finished', () => {
      const onExited = jest.fn();

      const slide = mount(<Slide in={true} onExited={onExited} />);
      slide.setProps({ in: false });

      jest.advanceTimersByTime(transitionDurationMs);
      expect(onExited).toHaveBeenCalled();
    });
  });

  it('should not call onExited if the exit transition never completes', () => {
    const onExited = jest.fn();

    const slide = mount(<Slide in={true} onExited={onExited} />);
    slide.setProps({ in: false });
    jest.advanceTimersByTime(transitionDurationMs - 20);
    slide.setProps({ in: true });
    jest.advanceTimersByTime(20);

    expect(onExited).not.toHaveBeenCalled();
  });

  describe('Fade', () => {
    let wrapper: any;

    beforeEach(() => {
      wrapper = mount(<Fade in component="some-test-data" />);
    });

    it('should use the default styles to start the animation', () => {
      const { defaultStyles } = wrapper.find('TransitionHandler').props();

      expect(defaultStyles).toMatchObject({
        opacity: 0,
        position: 'fixed',
        zIndex: 500,
      });
    });

    it('should add the other element props', () => {
      const { ...otherProps } = wrapper.find('TransitionHandler').props();
      expect(otherProps).toMatchObject({ component: 'some-test-data' });
    });

    it('should use the transition styles', () => {
      const { transitionStyles } = wrapper.find('TransitionHandler').props();

      expect(transitionStyles).toMatchObject({
        entering: { opacity: 0 },
        entered: { opacity: 1 },
      });
    });

    it('should set "unmountOnExit" to true as default', () => {
      const { unmountOnExit } = wrapper.find('Transition').props();

      expect(unmountOnExit).toBeTruthy();
    });

    it('should pass onExited to the Transition', () => {
      const onExited = jest.fn();
      const fade = mount(<Fade in onExited={onExited} />);

      expect(fade.find('Transition').props()).toMatchObject({ onExited });
    });
  });
});
