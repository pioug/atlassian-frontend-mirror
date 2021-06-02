import React from 'react';
import { mount } from 'enzyme';
import { Shortcut } from '../..';

describe('Shortcut', () => {
  const originalEventListener = document.addEventListener;

  afterEach(() => {
    document.addEventListener = originalEventListener;
  });

  it('should de-register the key event listener on unmount', (done) => {
    document.removeEventListener = (name: string) => {
      expect(name).toEqual('keydown');
      done();
    };

    const el = mount(
      <div>
        <Shortcut keyCode={37} handler={() => {}} />
      </div>,
    );

    el.unmount();
  });

  it('should execute handler', (done) => {
    mount(
      <div>
        <Shortcut keyCode={37} handler={done} />
      </div>,
    );

    const e = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      keyCode: 37,
    } as any);
    document.dispatchEvent(e);
    expect(document.dispatchEvent(e)).toBeTruthy();
  });
});
