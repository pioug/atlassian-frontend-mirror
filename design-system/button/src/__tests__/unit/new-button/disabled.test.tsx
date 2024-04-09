import React from 'react';

import { render, screen } from '@testing-library/react';

import variants from '../../../utils/variants';
import testEventBlocking from '../_util/test-event-blocking';

variants.forEach(({ name, Component, elementType }) => {
  if (elementType === HTMLButtonElement) {
    describe(`Loading ${name}`, () => {
      testEventBlocking(Component, { isDisabled: true });

      it('is not focusable', () => {
        render(
          <Component testId="button" isLoading>
            Hello
          </Component>,
        );
        const button = screen.getByTestId('button');

        button.focus();

        expect(button).not.toHaveFocus();
      });

      it('disables buttons', async () => {
        const { rerender } = render(
          <Component testId="button">Hello</Component>,
        );
        const button = screen.getByTestId('button');

        expect(button).toBeEnabled();

        rerender(
          <Component testId="button" isLoading>
            Hello
          </Component>,
        );

        expect(button).toBeDisabled();

        // should not add unnecessary `aria-disabled`
        expect(button).not.toHaveAttribute('aria-disabled');
      });
    });
  }
});
