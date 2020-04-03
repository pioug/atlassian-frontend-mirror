import React from 'react';
import { mount } from 'enzyme';
import Blanket from '@atlaskit/blanket';
import EmojiIcon from '@atlaskit/icon/glyph/emoji';

import Drawer from '../../index';
import DrawerPrimitive from '../../primitives';

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
    const wrapper = mount(
      <Drawer isOpen={false} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    expect(findKeydownListenerCall(window.addEventListener)).toBeUndefined();

    wrapper.setProps({ isOpen: true });

    const listenerCall = findKeydownListenerCall(window.addEventListener);
    expect(listenerCall).toBeTruthy();

    const eventHandler = listenerCall[1];
    expect(typeof eventHandler).toBe('function');
  });

  it('should add a keydown listener when drawer is mounted as opened', () => {
    mount(
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
    const wrapper = mount(
      <Drawer isOpen width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    expect(findKeydownListenerCall(window.removeEventListener)).toBeUndefined();

    wrapper.setProps({ isOpen: false });

    const [, eventHandler] = findKeydownListenerCall(
      window.removeEventListener,
    );
    expect(typeof eventHandler).toBe('function');
  });

  it('should remove a keydown listener when the component is unmounted', () => {
    mount(
      <Drawer isOpen width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    ).unmount();

    expect(global.window.removeEventListener).toHaveBeenCalled();
  });

  it('should call onClose if user press ESC', () => {
    const onClose = jest.fn();
    const event = { key: 'Escape' };

    mount(
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

    const wrapper = mount(
      <Drawer isOpen={false} onClose={onClose} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    escKeyDown();
    expect(onClose).not.toHaveBeenCalled();

    wrapper.setProps({ isOpen: true });

    escKeyDown();
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when blanket is clicked', () => {
    const onClose = jest.fn();
    const wrapper = mount(
      <Drawer isOpen onClose={onClose} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    expect(onClose).not.toHaveBeenCalled();
    wrapper.find(Blanket).simulate('click');
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when back button is clicked', () => {
    const onClose = jest.fn();
    const wrapper = mount(
      <Drawer isOpen onClose={onClose} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    expect(onClose).not.toHaveBeenCalled();
    wrapper.find('button').simulate('click');
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when custom back button is clicked', () => {
    const onClose = jest.fn();
    const wrapper = mount(
      <Drawer isOpen icon={EmojiIcon} onClose={onClose} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    expect(onClose).not.toHaveBeenCalled();
    wrapper.find('button').simulate('click');
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onCloseComplete when DrawerPrimitive calls onCloseComplete', () => {
    const onCloseComplete = jest.fn();
    const wrapper = mount(
      <Drawer isOpen width="wide" onCloseComplete={onCloseComplete}>
        <code>Drawer contents</code>
      </Drawer>,
    );

    const node = 'div';
    const callsBeforeOnCloseComplete = ([] as any[]).concat(
      onCloseComplete.mock.calls,
    );
    (wrapper.find(DrawerPrimitive).props() as any).onCloseComplete(node);
    const callsAfterOnCloseComplete = onCloseComplete.mock.calls;

    expect({ callsBeforeOnCloseComplete, callsAfterOnCloseComplete }).toEqual({
      callsBeforeOnCloseComplete: [],
      callsAfterOnCloseComplete: [[node]],
    });
  });

  it('should call onOpenComplete when DrawerPrimitive calls onOpenComplete', () => {
    const onOpenComplete = jest.fn();
    const wrapper = mount(
      <Drawer isOpen width="wide" onOpenComplete={onOpenComplete}>
        <code>Drawer contents</code>
      </Drawer>,
    );

    const node = document.createElement('div');
    const callback = wrapper.find(DrawerPrimitive).props().onOpenComplete;
    if (callback) callback(node);
    expect(onOpenComplete).toHaveBeenCalledWith(node);
  });

  it('should call onKeyDown if user press ESC', () => {
    const onKeyDown = jest.fn();
    const event = { key: 'Escape' };

    mount(
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

    mount(
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
    const wrapper = mount(
      <Drawer isOpen width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    expect(
      (wrapper
        .find('Slide')
        .find('Transition')
        .props() as any).unmountOnExit,
    ).toBeTruthy();
  });

  // this funtionality is currently broken and
  // will be fixed by https://ecosystem.atlassian.net/projects/AK/queues/issue/AK-6444
  it.skip('should retain Drawer contents when shouldUnmountOnExit is passed', () => {
    const wrapper = mount(
      <Drawer isOpen width="wide" shouldUnmountOnExit={false}>
        <code>Drawer contents</code>
      </Drawer>,
    );

    expect(
      (wrapper
        .find('Slide')
        .find('Transition')
        .props() as any).unmountOnExit,
    ).toBeFalsy();
  });
});
