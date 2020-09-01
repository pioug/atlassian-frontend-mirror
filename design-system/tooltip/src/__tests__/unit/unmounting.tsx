import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import Tooltip from '../../Tooltip';

describe('Unmounting tooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should remove the tooltip when unmounting', () => {
    jest.spyOn(global.console, 'error');
    const { getByTestId, queryByTestId, unmount } = render(
      <Tooltip testId="tooltip" content="hello world" position="left">
        <button data-testid="trigger">focus me</button>
      </Tooltip>,
    );

    const trigger = getByTestId('trigger');

    unmount();
    fireEvent.focus(trigger);
    act(() => {
      jest.runAllTimers();
    });

    expect(queryByTestId('tooltip')).toBeNull();
    // eslint-disable-next-line no-console
    expect(console.error).not.toHaveBeenCalled();
    (global.console.error as jest.Mock).mockRestore();
  });

  it('should never show the tooltip if unmounted while waiting to show', () => {
    jest.spyOn(global.console, 'error');
    const { getByTestId, queryByTestId, unmount } = render(
      <Tooltip testId="tooltip" content="hello world" position="left">
        <button data-testid="trigger">focus me</button>
      </Tooltip>,
    );

    const trigger = getByTestId('trigger');

    fireEvent.mouseOver(trigger);
    act(() => {
      // Takes 300ms to change to 'shown' from 'waiting-to-show'
      jest.runTimersToTime(290);
    });
    unmount();

    expect(queryByTestId('tooltip')).toBeNull();
    // eslint-disable-next-line no-console
    expect(console.error).not.toHaveBeenCalled();
    (global.console.error as jest.Mock).mockRestore();
  });

  it('should remove a visible tooltip when unmounted', () => {
    jest.spyOn(global.console, 'error');
    const { getByTestId, queryByTestId, unmount } = render(
      <Tooltip testId="tooltip" content="hello world" position="left">
        <button data-testid="trigger">focus me</button>
      </Tooltip>,
    );

    const trigger = getByTestId('trigger');

    fireEvent.mouseOver(trigger);
    act(() => {
      // Takes 300ms to change to 'shown' from 'waiting-to-show'
      jest.runTimersToTime(400);
    });
    unmount();

    expect(queryByTestId('tooltip')).toBeNull();
    // eslint-disable-next-line no-console
    expect(console.error).not.toHaveBeenCalled();
    (global.console.error as jest.Mock).mockRestore();
  });

  it('should remove a tooltip that is waiting to hide when unmounted', () => {
    jest.spyOn(global.console, 'error');
    const { getByTestId, queryByTestId, unmount } = render(
      <Tooltip testId="tooltip" content="hello world" position="left">
        <button data-testid="trigger">focus me</button>
      </Tooltip>,
    );

    const trigger = getByTestId('trigger');

    fireEvent.mouseOver(trigger);
    act(() => {
      jest.runAllTimers();
    });

    expect(queryByTestId('tooltip')).toBeTruthy();

    act(() => {
      fireEvent.mouseOut(trigger);
      // Takes 300ms to change to 'waiting-to-hide' from 'hide-animating'
      jest.runTimersToTime(290);
      unmount();
    });

    expect(queryByTestId('tooltip')).toBeNull();
    // eslint-disable-next-line no-console
    expect(console.error).not.toHaveBeenCalled();
    (global.console.error as jest.Mock).mockRestore();
  });

  it('should remove a tooltip that is hiding when unmounted', () => {
    jest.spyOn(global.console, 'error');
    const { getByTestId, queryByTestId, unmount } = render(
      <Tooltip testId="tooltip" content="hello world" position="left">
        <button data-testid="trigger">focus me</button>
      </Tooltip>,
    );

    const trigger = getByTestId('trigger');

    fireEvent.mouseOver(trigger);
    act(() => {
      jest.runAllTimers();
    });

    expect(queryByTestId('tooltip')).toBeTruthy();

    act(() => {
      fireEvent.mouseOut(trigger);
      // Takes 300ms to change to 'waiting-to-hide' from 'hide-animating'
      // This will flush the delay but not motion
      jest.runOnlyPendingTimers();
    });
    unmount();

    expect(queryByTestId('tooltip')).toBeNull();
    // eslint-disable-next-line no-console
    expect(console.error).not.toHaveBeenCalled();
    (global.console.error as jest.Mock).mockRestore();
  });
});
