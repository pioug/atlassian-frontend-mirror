import React from 'react';

import { render } from '@testing-library/react';

import { variants } from '../../../utils/variants';

variants.forEach(({ name, Component, elementType }) => {
  describe(name, () => {
    it('should apply a provided `type` prop', () => {
      const { getByTestId } = render(
        <Component testId="button" type="submit">
          Hello
        </Component>,
      );
      const button = getByTestId('button');

      expect(button.getAttribute('type')).toBe('submit');
    });

    if (elementType === HTMLButtonElement) {
      it('should add a default `type="button"`', () => {
        const { getByTestId } = render(
          <Component testId="button">Hello</Component>,
        );
        const button = getByTestId('button');

        expect(button.getAttribute('type')).toBe('button');
      });
    } else if (elementType === HTMLAnchorElement) {
      it('should not apply a default `type` to link buttons', () => {
        const { getByTestId } = render(
          <Component testId="button" href="http://google.com">
            Hello
          </Component>,
        );
        const button = getByTestId('button');

        expect(button.hasAttribute('type')).toBe(false);
      });
    }
  });
});
