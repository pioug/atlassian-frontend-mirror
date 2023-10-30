import React from 'react';

import { render, screen } from '@testing-library/react';

import variants from '../../../utils/variants';
import testEventBlocking from '../_util/test-event-blocking';

variants.forEach(({ name, Component, elementType }) => {
  describe(`Disabled ${name}`, () => {
    testEventBlocking(Component, { isDisabled: true });

    it('is not focusable', () => {
      render(
        <Component testId="button" isDisabled>
          Hello
        </Component>,
      );
      const button = screen.getByTestId('button');

      button.focus();

      expect(button).not.toHaveFocus();
    });

    if (elementType === HTMLButtonElement) {
      it('disables buttons with valid HTML attributes', async () => {
        const { rerender } = render(
          <Component testId="button" href="http://foo.com">
            Hello
          </Component>,
        );
        const button = screen.getByTestId('button');

        expect(button).toBeEnabled();

        rerender(
          <Component testId="button" href="http://foo.com" isDisabled>
            Hello
          </Component>,
        );

        expect(button).toBeDisabled();

        // should not add unnecessary `aria-disabled`
        expect(button).not.toHaveAttribute('aria-disabled');
      });
    } else if (elementType === HTMLAnchorElement) {
      it('disables link buttons with accessible and valid HTML attributes', async () => {
        const { rerender } = render(
          <Component testId="button" href="http://foo.com">
            Hello
          </Component>,
        );
        const button = screen.getByTestId('button');

        expect(button).toHaveAttribute('href');
        expect(button).not.toHaveAttribute('aria-disabled');
        expect(button).not.toHaveAttribute('role');

        rerender(
          <Component testId="button" href="http://foo.com" isDisabled>
            Hello
          </Component>,
        );

        expect(button).not.toHaveAttribute('href');
        expect(button).toHaveAttribute('aria-disabled');
        expect(button).toHaveAttribute('role', 'link');

        // `disabled` is not a valid <a> attribute
        expect(button).toBeEnabled();
      });
    }
  });
});
