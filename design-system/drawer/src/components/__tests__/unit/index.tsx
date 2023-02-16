import React from 'react';

import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EmojiIcon from '@atlaskit/icon/glyph/emoji';

import Drawer from '../../index';

declare var global: any;

const findKeydownListenerCall = (listenerFn: any) =>
  listenerFn.mock.calls.find((e: any) => e[0] === 'keydown');

const escKeyDown = () => {
  const event = new KeyboardEvent('keydown', {
    key: 'Escape',
  });
  global.window.dispatchEvent(event);
};

describe('Drawer Transitions', () => {
  beforeEach(() => {
    jest.spyOn(global.window, 'addEventListener');
    jest.spyOn(global.window, 'removeEventListener');
  });

  afterEach(() => {
    global.window.addEventListener.mockRestore();
    global.window.removeEventListener.mockRestore();
  });

  it('should add a keydown listener only when drawer is opened', () => {
    const { rerender } = render(
      <Drawer isOpen={false} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    expect(findKeydownListenerCall(window.addEventListener)).toBeUndefined();

    rerender(
      <Drawer isOpen={true} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    const listenerCall = findKeydownListenerCall(window.addEventListener);
    expect(listenerCall).toBeTruthy();

    const eventHandler = listenerCall[1];
    expect(typeof eventHandler).toBe('function');
  });

  it('should add a keydown listener when drawer is mounted as opened', () => {
    render(
      <Drawer isOpen width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    const listenerCall = findKeydownListenerCall(window.addEventListener);
    expect(listenerCall).toBeTruthy();

    const eventHandler = listenerCall[1];
    expect(typeof eventHandler).toBe('function');
  });

  it('should remove a keydown listener when drawer is closed', () => {
    const { rerender } = render(
      <Drawer isOpen width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    expect(findKeydownListenerCall(window.removeEventListener)).toBeUndefined();

    rerender(
      <Drawer isOpen={false} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    const [, eventHandler] = findKeydownListenerCall(
      window.removeEventListener,
    );
    expect(typeof eventHandler).toBe('function');
  });

  it('should remove a keydown listener when the component is unmounted', () => {
    const { unmount } = render(
      <Drawer isOpen width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );
    unmount();

    expect(global.window.removeEventListener).toHaveBeenCalled();
  });

  it('should call onClose if user press ESC', () => {
    const onClose = jest.fn();
    const event = { key: 'Escape' };

    render(
      <Drawer isOpen onClose={onClose} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    const [, eventHandler] = findKeydownListenerCall(window.addEventListener);

    eventHandler(event);

    expect(onClose.mock.calls[0][0]).toBe(event);
  });

  it('should not call onClose if user press ESC while the drawer is closed', () => {
    const onClose = jest.fn();

    const { rerender } = render(
      <Drawer isOpen={false} onClose={onClose} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    escKeyDown();
    expect(onClose).not.toHaveBeenCalled();

    rerender(
      <Drawer isOpen={true} onClose={onClose} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    escKeyDown();
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when blanket is clicked', async () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Drawer isOpen onClose={onClose} width="wide" testId="test-drawer">
        <code>Drawer contents</code>
      </Drawer>,
    );

    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(getByTestId('test-drawer--blanket')); // Blanket
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when back button is clicked', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Drawer isOpen onClose={onClose} width="wide" testId="test-drawer">
        <code>Drawer contents</code>
      </Drawer>,
    );

    expect(onClose).not.toHaveBeenCalled();
    getByTestId('DrawerPrimitiveSidebarCloseButton').click();
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when custom back button is clicked', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Drawer
        isOpen
        icon={EmojiIcon}
        onClose={onClose}
        width="wide"
        testId="test-drawer"
      >
        <code>Drawer contents</code>
      </Drawer>,
    );

    expect(onClose).not.toHaveBeenCalled();
    getByTestId('DrawerPrimitiveSidebarCloseButton').click();
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onCloseComplete when DrawerPrimitive calls onCloseComplete', () => {
    jest.useFakeTimers();
    const onCloseComplete = jest.fn();
    const { rerender } = render(
      <Drawer
        isOpen
        width="wide"
        onCloseComplete={onCloseComplete}
        testId="test-drawer"
      >
        <code>Drawer contents</code>
      </Drawer>,
    );

    rerender(
      <Drawer
        isOpen={false}
        width="wide"
        onCloseComplete={onCloseComplete}
        testId="test-drawer"
      >
        <code>Drawer contents</code>
      </Drawer>,
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(onCloseComplete).toHaveBeenCalled();
  });

  it('should call onOpenComplete when DrawerPrimitive calls onOpenComplete', () => {
    jest.useFakeTimers();
    const onOpenComplete = jest.fn();
    render(
      <Drawer isOpen width="wide" onOpenComplete={onOpenComplete}>
        <code>Drawer contents</code>
      </Drawer>,
    );

    act(() => {
      jest.runAllTimers();
    });
    expect(onOpenComplete).toHaveBeenCalled();
  });

  it('should call onKeyDown if user press ESC', () => {
    const onKeyDown = jest.fn();
    const event = { key: 'Escape' };

    render(
      <Drawer isOpen onKeyDown={onKeyDown} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );
    const [eventName, eventHandler] = findKeydownListenerCall(
      window.addEventListener,
    );

    eventHandler(event);

    expect(eventName).toBe('keydown');
    expect(onKeyDown).toHaveBeenCalledWith(event);
  });

  it("should NOT call onClose if user doesn't press ESC", () => {
    const onClose = jest.fn();
    const event = { key: 'another-key' };

    render(
      <Drawer isOpen onClose={onClose} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );
    const [, eventHandler] = findKeydownListenerCall(window.addEventListener);

    eventHandler(event);

    expect(onClose).not.toHaveBeenCalled();
  });
  // this funtionality is currently broken and
  // will be fixed by https://ecosystem.atlassian.net/projects/AK/queues/issue/AK-6444
  it.skip('should NOT retain Drawer contents by default', () => {
    render(
      <Drawer isOpen width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    // TODO: rewrite assertion with RTL once functionality is fixed.
    // expect(
    //   (wrapper.find('Slide').find('Transition').props() as any).unmountOnExit,
    // ).toBeTruthy();
  });

  // this funtionality is currently broken and
  // will be fixed by https://ecosystem.atlassian.net/projects/AK/queues/issue/AK-6444
  it.skip('should retain Drawer contents when shouldUnmountOnExit is passed', () => {
    render(
      <Drawer isOpen width="wide" shouldUnmountOnExit={false}>
        <code>Drawer contents</code>
      </Drawer>,
    );

    // expect(
    //   (wrapper.find('Slide').find('Transition').props() as any).unmountOnExit,
    // ).toBeFalsy();
  });
});
