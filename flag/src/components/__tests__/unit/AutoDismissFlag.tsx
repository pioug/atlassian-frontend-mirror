import React from 'react';
import { mount } from 'enzyme';
import { AUTO_DISMISS_SECONDS } from '../../AutoDismissFlag';
import Flag, { AutoDismissFlag } from '../../..';
import { AutoDismissFlagProps } from '../../../types';

describe('Auto dismiss flag', () => {
  // Helper function to generate <Flag /> with base required props
  const GenerateAutoDismissFlag = (
    extraProps: Partial<AutoDismissFlagProps>,
  ) => <AutoDismissFlag id="" icon={<div />} title="Flag" {...extraProps} />;

  describe('AutoDismissFlag', () => {
    it('should instantiate', () => {
      const wrapper = mount(<GenerateAutoDismissFlag />);
      expect(wrapper.exists()).toBe(true);
    });

    it('should render a <Flag />', () => {
      const wrapper = mount(<GenerateAutoDismissFlag />);
      expect(wrapper.find(Flag).exists()).toBe(true);
    });

    it('should use 8 seconds as the timer value', () => {
      expect(AUTO_DISMISS_SECONDS).toBe(8);
    });

    describe('timer tests', () => {
      const runTimer = () => jest.runTimersToTime(AUTO_DISMISS_SECONDS * 1000);
      let onDismissedSpy: () => void;

      beforeEach(() => {
        onDismissedSpy = jest.fn();
        jest.useFakeTimers();
      });

      it('should auto dismiss after 8 seconds if isDismissAllowed and onDismissed are set on mount', () => {
        mount(
          <GenerateAutoDismissFlag
            isDismissAllowed
            onDismissed={onDismissedSpy}
          />,
        );
        expect(onDismissedSpy).not.toBeCalled();
        runTimer();
        expect(onDismissedSpy).toBeCalled();
      });

      it('should not auto dismiss after 8 seconds if isDismissAllowed is not set on mount', () => {
        mount(<GenerateAutoDismissFlag id="" onDismissed={onDismissedSpy} />);
        expect(onDismissedSpy).not.toBeCalled();
        runTimer();
        expect(onDismissedSpy).not.toBeCalled();
      });

      it('should auto dismiss after 8 seconds if isDismissAllowed and onDismissed props are set after mount', () => {
        const wrapper = mount(<GenerateAutoDismissFlag />);
        runTimer();
        expect(onDismissedSpy).not.toBeCalled();
        wrapper.setProps({
          onDismissed: onDismissedSpy,
          isDismissAllowed: true,
        });
        runTimer();
        expect(onDismissedSpy).toBeCalled();
      });

      it('should not auto dismiss after 8 seconds if isDismissAllowed prop is set on mount but then removed', () => {
        const wrapper = mount(
          <GenerateAutoDismissFlag
            isDismissAllowed
            onDismissed={onDismissedSpy}
          />,
        );
        wrapper.setProps({ isDismissAllowed: false });
        runTimer();
        expect(onDismissedSpy).not.toBeCalled();
      });

      it('should pause the dismiss timer on Flag mouseover, and resume on mouseout', () => {
        const wrapper = mount(
          <GenerateAutoDismissFlag
            isDismissAllowed
            onDismissed={onDismissedSpy}
          />,
        );
        wrapper.find(Flag).simulate('mouseover');
        runTimer();
        expect(onDismissedSpy).not.toBeCalled();
        wrapper.find(Flag).simulate('mouseout');
        runTimer();
        expect(onDismissedSpy).toBeCalled();
      });

      it('should pause the dismiss timer on Flag focus, and resume on blur', () => {
        const wrapper = mount(
          <GenerateAutoDismissFlag
            isDismissAllowed
            onDismissed={onDismissedSpy}
          />,
        );
        wrapper.find(Flag).simulate('focus');
        runTimer();
        expect(onDismissedSpy).not.toBeCalled();
        wrapper.find(Flag).simulate('blur');
        runTimer();
        expect(onDismissedSpy).toBeCalled();
      });
    });
  });
});
