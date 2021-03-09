import React from 'react';
import { mount } from 'enzyme';

import { MultiSelectStateless } from '../..';

describe('@atlaskit/multi-select - stateless', () => {
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  describe('behavior', () => {
    let select;
    let rootElement;

    /**
     * These tests check the focused element via `document.activeElement`.
     *
     * The default `mount()` method mounts into a div but doesn't attach it to the DOM.
     *
     * In order for `document.activeElement` to function as intended we need to explicitly
     * mount it into the DOM. We do this using the `attachTo` property.
     *
     * We mount to a div instead of `document.body` directly to avoid a react render warning.
     */
    beforeAll(() => {
      rootElement = document.createElement('div');
      document.body.appendChild(rootElement);
    });

    beforeEach(() => {
      select = mount(<MultiSelectStateless />, { attachTo: rootElement });
    });

    afterEach(() => {
      select.unmount();
      select = undefined;
    });

    afterAll(() => {
      document.body.removeChild(rootElement);
      rootElement = undefined;
    });

    describe('focus', () => {
      it('should focus the input field if shouldFocus is set to true', () => {
        const input = select.find('input');
        expect(document.activeElement).not.toBe(input.instance());
        select.setProps({ shouldFocus: true });
        expect(document.activeElement).toBe(input.instance());
      });
    });
  });
});
