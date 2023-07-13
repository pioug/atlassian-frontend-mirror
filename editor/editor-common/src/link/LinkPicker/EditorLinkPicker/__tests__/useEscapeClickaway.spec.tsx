import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import { useEscapeClickaway } from '../useEscapeClickaway';

describe('useEscapeClickaway', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('calls `onEscape` when escape is pressed', () => {
    const onEscape = jest.fn();
    const onClickaway = jest.fn();
    renderHook(() => useEscapeClickaway(onEscape, onClickaway));

    expect(onEscape).toHaveBeenCalledTimes(0);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(onClickaway).toHaveBeenCalledTimes(0);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onEscape).toHaveBeenCalledTimes(2);
    expect(onClickaway).toHaveBeenCalledTimes(0);
  });

  it('does not call `onClickaway` when the user clicks the ref', () => {
    const onEscape = jest.fn();
    const onClickaway = jest.fn();
    const { result } = renderHook(() =>
      useEscapeClickaway(onEscape, onClickaway),
    );

    const el = document.createElement('div');
    result.current.current = el;

    fireEvent.click(el);
    expect(onEscape).toHaveBeenCalledTimes(0);
    expect(onClickaway).toHaveBeenCalledTimes(0);
  });

  it('does not call `onClickaway` when the user clicks inside ref', async () => {
    const onEscape = jest.fn();
    const onClickaway = jest.fn();
    const { result } = renderHook(() =>
      useEscapeClickaway(onEscape, onClickaway),
    );

    const el = document.createElement('div');
    result.current.current = el;

    const child = document.createElement('div');
    el.appendChild(child);
    await user.click(child);

    expect(onEscape).toHaveBeenCalledTimes(0);
    expect(onClickaway).toHaveBeenCalledTimes(0);
  });

  it('calls `onClickaway` when the user clicks on element outside the ref', async () => {
    const onEscape = jest.fn();
    const onClickaway = jest.fn();
    const { result } = renderHook(() =>
      useEscapeClickaway(onEscape, onClickaway),
    );

    const el = document.createElement('div');
    result.current.current = el;

    expect(onClickaway).toHaveBeenCalledTimes(0);

    await user.click(document.body);

    expect(onEscape).toHaveBeenCalledTimes(0);
    expect(onClickaway).toHaveBeenCalledTimes(1);

    await user.click(document.body);

    expect(onEscape).toHaveBeenCalledTimes(0);
    expect(onClickaway).toHaveBeenCalledTimes(2);
  });

  it('cleans up event listeners when unmounted', async () => {
    const onEscape = jest.fn();
    const onClickaway = jest.fn();
    const { unmount } = renderHook(() =>
      useEscapeClickaway(onEscape, onClickaway),
    );

    unmount();

    fireEvent.keyDown(document, { key: 'Escape' });
    await user.click(document.body);

    expect(onEscape).toHaveBeenCalledTimes(0);
    expect(onClickaway).toHaveBeenCalledTimes(0);
  });
});
