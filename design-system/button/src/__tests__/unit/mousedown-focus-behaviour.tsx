import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Button from '../../index';

const types: React.ElementType[] = ['button', 'a', 'span'];

types.forEach((tag: React.ElementType) => {
  describe(`focus behaviour [type: <${tag}>]`, () => {
    // Note: this behaviour sucks but it is so engrained in usages of button that it will be really hard to unwind
    it('should call event.prevent default on mouse down to prevent the button getting focus', () => {
      // create a random button that will have focus
      const el: HTMLElement = document.createElement('button');
      document.body.appendChild(el);
      el.focus();
      expect(el).toBe(document.activeElement);

      const { getByTestId } = render(
        <Button testId="button" component={tag}>
          Hello
        </Button>,
      );
      const button: HTMLElement = getByTestId('button');

      // event prevented
      const allowed: boolean = fireEvent.mouseDown(button);
      expect(allowed).toBe(false);

      // focus not lost from original element
      expect(el).toBe(document.activeElement);
    });
  });
});
