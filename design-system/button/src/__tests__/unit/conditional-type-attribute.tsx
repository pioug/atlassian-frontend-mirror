import React from 'react';

import { render } from '@testing-library/react';

import forEachType from './_util/for-each-type';

forEachType(({ name, Component }) => {
  describe(`Conditional type attribute with button: ${name}`, () => {
    it('should add a type="button" prop to button elements when not type is provided', () => {
      const { getByTestId } = render(
        <Component testId="button">Hello</Component>,
      );
      const button: HTMLElement = getByTestId('button');

      expect(button.tagName.toLowerCase()).toBe('button');
      expect(button.getAttribute('type')).toBe('button');
    });

    it('should respect a provided "type" prop', () => {
      const { getByTestId } = render(
        <Component testId="button" type="submit">
          Hello
        </Component>,
      );
      const button: HTMLElement = getByTestId('button');

      expect(button.tagName.toLowerCase()).toBe('button');
      expect(button.getAttribute('type')).toBe('submit');
    });

    it('should not apply a default "type" to anchors', () => {
      const { getByTestId } = render(
        <Component testId="button" href="http://google.com">
          Hello
        </Component>,
      );
      const button: HTMLElement = getByTestId('button');

      expect(button.tagName.toLowerCase()).toBe('a');
      expect(button.hasAttribute('type')).toBe(false);
    });
  });
});
