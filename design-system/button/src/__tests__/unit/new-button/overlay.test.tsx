import React from 'react';

import { render } from '@testing-library/react';

import variants from '../../../utils/variants';
import testEventBlocking from '../_util/test-event-blocking';

variants.forEach(async ({ name, Component, elementType }) => {
  describe(`${name}: overlay`, async () => {
    testEventBlocking(Component, {
      overlay: 'hello',
    });

    it('is not focusable', () => {
      const { getByTestId } = render(
        <Component testId="button" overlay="hello">
          Hello
        </Component>,
      );
      const button = getByTestId('button');

      button.focus();

      expect(button).not.toBe(document.activeElement);
    });

    if (elementType === HTMLAnchorElement) {
      it('<a> should remove href attribute when there is an overlay', () => {
        const { getByTestId, rerender } = render(
          <Component testId="button" href="http://foo.com">
            Hello
          </Component>,
        );
        const button = getByTestId('button');

        expect(button.hasAttribute('href')).toBe(true);

        rerender(
          <Component testId="button" href="http://foo.com" overlay="hey">
            Hello
          </Component>,
        );

        expect(button.hasAttribute('href')).toBe(false);
      });
    }
  });
});
