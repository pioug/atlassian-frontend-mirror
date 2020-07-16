import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import { AutoDismissFlag, FlagGroup } from '../../index';
import { AutoDismissFlagProps } from '../../types';
import { AUTO_DISMISS_SECONDS } from '../../auto-dismiss-flag';

describe('Auto dismiss flag', () => {
  // Helper function to generate <Flag /> with base required props
  const generateAutoDismissFlag = (
    extraProps?: Partial<AutoDismissFlagProps>,
  ) => <AutoDismissFlag id="" icon={<div />} title="Flag" {...extraProps} />;

  describe('AutoDismissFlag', () => {
    it('should render a <Flag />', () => {
      const { queryByText } = render(generateAutoDismissFlag());
      expect(queryByText('Flag')).not.toBeNull();
    });

    describe('timer tests', () => {
      const runTimer = () =>
        act(() => jest.runTimersToTime(AUTO_DISMISS_SECONDS * 1000));

      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('should auto dismiss after 8 seconds', () => {
        const onDismissedSpy = jest.fn();
        render(
          <FlagGroup onDismissed={onDismissedSpy}>
            {generateAutoDismissFlag()}
          </FlagGroup>,
        );
        expect(onDismissedSpy).not.toBeCalled();
        runTimer();
        expect(onDismissedSpy).toBeCalled();
      });

      it('should auto dismiss first flag after 8 seconds if there are 2 AutoDismissFlags', () => {
        const onDismissedSpy = jest.fn();
        render(
          <FlagGroup onDismissed={onDismissedSpy}>
            {generateAutoDismissFlag({ id: '0' })}
            {generateAutoDismissFlag({ id: '1' })}
          </FlagGroup>,
        );
        expect(onDismissedSpy).not.toBeCalled();
        runTimer();
        expect(onDismissedSpy).toBeCalledWith('0', expect.anything());
      });

      it('should auto dismiss second flag after 16 seconds if there are 2 AutoDismissFlags', () => {
        const onDismissedSpy = jest.fn();
        const { rerender } = render(
          <FlagGroup onDismissed={onDismissedSpy}>
            {generateAutoDismissFlag({ id: '0' })}
            {generateAutoDismissFlag({ id: '1' })}
          </FlagGroup>,
        );
        expect(onDismissedSpy).not.toBeCalled();
        runTimer();
        rerender(
          <FlagGroup onDismissed={onDismissedSpy}>
            {generateAutoDismissFlag({ id: '1' })}
          </FlagGroup>,
        );
        runTimer();
        expect(onDismissedSpy).toBeCalledWith('1', expect.anything());
      });

      it('should not dismiss after 8 seconds if another flag is added', () => {
        const onDismissedSpy = jest.fn();
        const { rerender } = render(
          <FlagGroup onDismissed={onDismissedSpy}>
            {generateAutoDismissFlag({ id: '1' })}
          </FlagGroup>,
        );
        act(() => jest.runTimersToTime((AUTO_DISMISS_SECONDS / 2) * 1000));
        rerender(
          <FlagGroup onDismissed={onDismissedSpy}>
            {generateAutoDismissFlag({ id: '0' })}
            {generateAutoDismissFlag({ id: '1' })}
          </FlagGroup>,
        );
        act(() => jest.runTimersToTime((AUTO_DISMISS_SECONDS / 2) * 1000));
        expect(onDismissedSpy).not.toBeCalled();
      });

      it('should pause the dismiss timer on Flag mouseover, and resume on mouseout', () => {
        const onDismissedSpy = jest.fn();
        const { getByTestId } = render(
          <FlagGroup onDismissed={onDismissedSpy}>
            {generateAutoDismissFlag({ testId: 'autodismiss-flag' })}
          </FlagGroup>,
        );
        const flag = getByTestId('autodismiss-flag');
        fireEvent.mouseOver(flag);
        runTimer();
        expect(onDismissedSpy).not.toBeCalled();
        fireEvent.mouseOut(flag);
        runTimer();
        expect(onDismissedSpy).toBeCalled();
      });

      it('should pause the dismiss timer on Flag focus, and resume on blur', () => {
        const onDismissedSpy = jest.fn();
        const { getByTestId } = render(
          <FlagGroup onDismissed={onDismissedSpy}>
            {generateAutoDismissFlag({ testId: 'autodismiss-flag' })}
          </FlagGroup>,
        );
        const flag = getByTestId('autodismiss-flag');
        fireEvent.focus(flag);
        runTimer();
        expect(onDismissedSpy).not.toBeCalled();
        fireEvent.blur(flag);
        runTimer();
        expect(onDismissedSpy).toBeCalled();
      });
    });
  });
});
