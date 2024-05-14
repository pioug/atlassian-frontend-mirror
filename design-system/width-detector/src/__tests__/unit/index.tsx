import React from 'react';
import WidthDetector from '../..';
import { render, waitFor } from '@testing-library/react';

// requestAnimationFrame is stubbed with `raf-stub`
const requestAnimationFrame = window.requestAnimationFrame as any;

describe('@atlaskit/width-detector', () => {
  const createChildWithSpy = (spy: Function) => (args: any) => spy(args);

  beforeAll(() => {
    requestAnimationFrame.reset();
  });

  afterEach(() => {
    requestAnimationFrame.reset();
  });

  it('should pass width to child function', async () => {
    const spy = jest.fn();
    render(<WidthDetector>{createChildWithSpy(spy)}</WidthDetector>);
    requestAnimationFrame.step();
    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(2);
    });
    expect(spy).toHaveBeenCalledWith(0);
  });

  it('should use requestAnimationFrame to queue resize measurements', async () => {
    const spy = jest.fn();
    render(<WidthDetector>{createChildWithSpy(spy)}</WidthDetector>);
    expect(spy).toHaveBeenCalledTimes(1);
    requestAnimationFrame.step();
    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  it('should call cancelAnimationFrame when unmounted', () => {
    const spy = jest.fn();
    const { unmount } = render(
      <WidthDetector>{createChildWithSpy(spy)}</WidthDetector>,
    );
    // initial frame is queued
    expect(spy).toHaveBeenCalledTimes(1);
    unmount();
    requestAnimationFrame.flush();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
