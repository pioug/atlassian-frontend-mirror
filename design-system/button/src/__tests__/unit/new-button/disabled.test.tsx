import React from 'react';

import { render } from '@testing-library/react';

import variants from '../../../utils/variants';
import testEventBlocking from '../_util/test-event-blocking';

variants.forEach(({ name, Component, elementType }) => {
  describe(`Disabled ${name}`, () => {
    testEventBlocking(Component, { isDisabled: true });

    it('is not focusable', () => {
      const { getByTestId } = render(
        <Component testId="button" isDisabled>
          Hello
        </Component>,
      );
      const button = getByTestId('button');

      button.focus();

      expect(button).not.toBe(document.activeElement);
    });

    if (elementType === HTMLButtonElement) {
      it('disables buttons with valid HTML attributes', async () => {
        const { getByTestId, rerender } = render(
          <Component testId="button" href="http://foo.com">
            Hello
          </Component>,
        );
        const button = getByTestId('button');

        expect(button.hasAttribute('disabled')).toBe(false);

        rerender(
          <Component testId="button" href="http://foo.com" isDisabled>
            Hello
          </Component>,
        );

        expect(button.hasAttribute('disabled')).toBe(true);

        // should not add unnecessary `aria-disabled`
        expect(button.hasAttribute('aria-disabled')).toBe(false);
      });
    } else if (elementType === HTMLAnchorElement) {
      it('disables link buttons with accessible and valid HTML attributes', async () => {
        const { getByTestId, rerender } = render(
          <Component testId="button" href="http://foo.com">
            Hello
          </Component>,
        );
        const button = getByTestId('button');

        expect(button.hasAttribute('href')).toBe(true);
        expect(button.hasAttribute('aria-disabled')).toBe(false);
        expect(button.hasAttribute('role')).toBe(false);

        rerender(
          <Component testId="button" href="http://foo.com" isDisabled>
            Hello
          </Component>,
        );

        expect(button.hasAttribute('href')).toBe(false);
        expect(button.getAttribute('aria-disabled')).toBe('true');
        expect(button.getAttribute('role')).toBe('link');

        // `disabled` is not a valid <a> attribute
        expect(button.hasAttribute('disabled')).toBe(false);
      });
    }
  });
});
