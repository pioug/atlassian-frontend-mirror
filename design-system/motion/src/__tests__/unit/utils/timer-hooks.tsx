import React from 'react';

import { render } from '@testing-library/react';

import {
  useRequestAnimationFrame,
  useSetTimeout,
} from '../../../utils/timer-hooks';
import * as raf from '../../__utils__/raf';

raf.replace();

describe('timer hooks', () => {
  beforeEach(() => jest.useRealTimers());

  describe('useRequestAnimationFrame()', () => {
    const Component = (props: {
      callback?: Function;
      cleanup: 'next-effect' | 'unmount';
      receiveHookResult?: (func: any) => void;
    }) => {
      const requestAnimationFrame = useRequestAnimationFrame({
        cleanup: props.cleanup,
      });
      props.receiveHookResult && props.receiveHookResult(requestAnimationFrame);
      requestAnimationFrame(() => props.callback && props.callback());
      return null;
    };

    it('should not callback immediately', () => {
      const callback = jest.fn();

      render(<Component cleanup="unmount" callback={callback} />);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should callback next frame', () => {
      const callback = jest.fn();
      render(<Component cleanup="unmount" callback={callback} />);

      raf.step();

      expect(callback).toHaveBeenCalled();
    });

    it('should not callback when the effect is cleared', () => {
      const callback = jest.fn();
      const { rerender } = render(
        <Component cleanup="next-effect" callback={callback} />,
      );
      rerender(<Component cleanup="next-effect" callback={jest.fn()} />);

      raf.step();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should not callback when the effect is unmounted', () => {
      const callback = jest.fn();
      const { unmount } = render(
        <Component cleanup="unmount" callback={callback} />,
      );

      unmount();
      raf.step();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should have a stable reference', () => {
      const callback = jest.fn();
      const markup = () => (
        <Component receiveHookResult={callback} cleanup="unmount" />
      );
      const { rerender } = render(markup());

      rerender(markup());
      rerender(markup());

      expect(callback.mock.calls[0][0]).toBe(callback.mock.calls[1][0]);
      expect(callback.mock.calls[1][0]).toBe(callback.mock.calls[2][0]);
    });
  });

  describe('useSetTimeout()', () => {
    const Component = (props: {
      callback?: Function;
      cleanup: 'next-effect' | 'unmount';
      receiveHookResult?: (func: any) => void;
    }) => {
      const setTimeout = useSetTimeout({ cleanup: props.cleanup });
      props.receiveHookResult && props.receiveHookResult(requestAnimationFrame);
      setTimeout(() => props.callback && props.callback(), 100);
      return null;
    };

    it('should not callback immediately', () => {
      const callback = jest.fn();

      render(<Component cleanup="unmount" callback={callback} />);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should callback next frame', () => {
      jest.useFakeTimers();
      const callback = jest.fn();
      render(<Component cleanup="unmount" callback={callback} />);

      jest.runAllTimers();

      expect(callback).toHaveBeenCalled();
    });

    it('should not callback when the effect is cleared', () => {
      jest.useFakeTimers();
      const callback = jest.fn();
      const { rerender } = render(
        <Component cleanup="next-effect" callback={callback} />,
      );
      rerender(<Component cleanup="next-effect" callback={jest.fn()} />);

      jest.runAllTimers();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should not callback when the effect is unmounted', () => {
      jest.useFakeTimers();
      const callback = jest.fn();
      const { unmount } = render(
        <Component cleanup="unmount" callback={callback} />,
      );

      unmount();
      jest.runAllTimers();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should have a stable reference', () => {
      const callback = jest.fn();
      const markup = () => (
        <Component receiveHookResult={callback} cleanup="unmount" />
      );
      const { rerender } = render(markup());

      rerender(markup());
      rerender(markup());

      expect(callback.mock.calls[0][0]).toBe(callback.mock.calls[1][0]);
      expect(callback.mock.calls[1][0]).toBe(callback.mock.calls[2][0]);
    });
  });
});
