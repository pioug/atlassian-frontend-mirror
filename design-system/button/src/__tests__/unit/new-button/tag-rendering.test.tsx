import React from 'react';

import { render, screen } from '@testing-library/react';

import variants from '../../../utils/variants';

/**
 * Validate expected HTML element / tag rendering from Button variants
 */
variants.forEach(({ name, Component, elementType }) => {
  describe(name, () => {
    if (elementType === HTMLButtonElement) {
      it('should render a `<button>` tag`', () => {
        render(<Component testId="button">Hello</Component>);
        const button = screen.getByTestId('button');

        expect(button.tagName.toLowerCase()).toBe('button');
      });
    } else if (elementType === HTMLAnchorElement) {
      it('should render a `<a>` tag', () => {
        render(
          <Component testId="button" href="http://google.com">
            Hello
          </Component>,
        );
        const button = screen.getByTestId('button');

        expect(button.tagName.toLowerCase()).toBe('a');
      });
    }
  });
});
