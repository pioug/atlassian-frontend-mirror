import React from 'react';
import { type JestFunction } from '@atlaskit/media-test-helpers';
import {
  IframeDwellTracker,
  type IframeDwellTrackerProps,
} from '../components/IframeDwellTracker';
import { render, type RenderResult } from '@testing-library/react';
import { act } from '@testing-library/react';

describe('Iframe Dwell Tracker', () => {
  let iframeTracker: RenderResult;
  const onIframeDwellMock: JestFunction<
    Required<IframeDwellTrackerProps>['onIframeDwell']
  > = jest.fn();
  let props: IframeDwellTrackerProps = {
    isIframeLoaded: false,
    isMouseOver: false,
    isWindowFocused: true,
    onIframeDwell: onIframeDwellMock,
    iframePercentVisible: 0.76,
  };

  beforeEach(() => {
    jest.useFakeTimers();

    props = {
      isIframeLoaded: false,
      isMouseOver: false,
      isWindowFocused: true,
      onIframeDwell: onIframeDwellMock,
      iframePercentVisible: 0.76,
    };

    iframeTracker = render(<IframeDwellTracker {...props} />);
  });

  afterEach(() => {
    if (iframeTracker) {
      iframeTracker.unmount();
    }
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should call back after every 5 seconds of dwelling, with total dwell time', () => {
    mouseEnter();
    iframeLoaded();

    incrementSeconds(5);
    expect(onIframeDwellMock).toHaveBeenLastCalledWith(5, 75);

    incrementSeconds(5);
    expect(onIframeDwellMock).toHaveBeenLastCalledWith(10, 75);

    incrementSeconds(5);
    expect(onIframeDwellMock).toHaveBeenLastCalledWith(15, 75);

    expect(onIframeDwellMock).toHaveBeenCalledTimes(3);
  });

  it('should stop timer on mouse out', () => {
    mouseEnter();
    iframeLoaded();

    incrementSeconds(2);
    mouseLeave();
    incrementSeconds(3);
    expect(onIframeDwellMock).toHaveBeenCalledTimes(0);

    mouseEnter();
    incrementSeconds(2);
    expect(onIframeDwellMock).toHaveBeenCalledTimes(0);

    incrementSeconds(1);
    expect(onIframeDwellMock).toHaveBeenLastCalledWith(5, 75);

    expect(onIframeDwellMock).toHaveBeenCalledTimes(1);
  });

  it('should not start timer until iframe is loaded', () => {
    mouseEnter();

    incrementSeconds(5);
    expect(onIframeDwellMock).toHaveBeenCalledTimes(0);

    incrementSeconds(1);
    iframeLoaded();
    incrementSeconds(4);
    expect(onIframeDwellMock).toHaveBeenCalledTimes(0);

    incrementSeconds(1);
    expect(onIframeDwellMock).toHaveBeenLastCalledWith(5, 75);

    expect(onIframeDwellMock).toHaveBeenCalledTimes(1);
  });

  it('should stop timer when visibility drops, and report last percentage', () => {
    mouseEnter();
    iframeLoaded();

    incrementSeconds(1);
    changeIframeVisibility(0.71);
    incrementSeconds(1);

    changeIframeVisibility(0.86);
    incrementSeconds(1);

    changeIframeVisibility(0.91);
    incrementSeconds(1);

    changeIframeVisibility(0.96);
    incrementSeconds(1);
    expect(onIframeDwellMock).toHaveBeenCalledTimes(0);

    incrementSeconds(1);
    expect(onIframeDwellMock).toHaveBeenLastCalledWith(5, 95);

    expect(onIframeDwellMock).toHaveBeenCalledTimes(1);
  });

  it('should stop timer on window blur', () => {
    mouseEnter();
    iframeLoaded();

    incrementSeconds(2);
    windowBlur();
    incrementSeconds(3);
    expect(onIframeDwellMock).toHaveBeenCalledTimes(0);

    windowFocus();
    incrementSeconds(2);
    expect(onIframeDwellMock).toHaveBeenCalledTimes(0);

    incrementSeconds(1);
    expect(onIframeDwellMock).toHaveBeenLastCalledWith(5, 75);

    expect(onIframeDwellMock).toHaveBeenCalledTimes(1);
  });

  const incrementSeconds = (seconds: number) => {
    act(() => {
      jest.advanceTimersByTime(seconds * 1000);
    });
  };

  const mouseEnter = () => {
    props.isMouseOver = true;
    rerender();
  };

  const mouseLeave = () => {
    props.isMouseOver = false;
    rerender();
  };

  const windowBlur = () => {
    props.isWindowFocused = false;
    rerender();
  };

  const windowFocus = () => {
    props.isWindowFocused = true;
    rerender();
  };

  const iframeLoaded = () => {
    props.isIframeLoaded = true;
    rerender();
  };

  const changeIframeVisibility = (visibility: number) => {
    props.iframePercentVisible = visibility;
    rerender();
  };

  const rerender = () => {
    iframeTracker.rerender(<IframeDwellTracker {...props} />);
  };
});
