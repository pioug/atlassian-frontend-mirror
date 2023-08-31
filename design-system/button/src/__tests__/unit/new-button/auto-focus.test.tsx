import React from 'react';

import { render } from '@testing-library/react';

import variants from '../../../utils/variants';

variants.forEach(({ name, Component }) => {
  describe(name, () => {
    it('should not focus on the element if autoFocus is not set', () => {
      const { getByTestId } = render(
        <Component testId="button">Hello</Component>,
      );
      const button = getByTestId('button');
      expect(button).not.toBe(document.activeElement);
    });

    it('should focus on the element if autoFocus is set', () => {
      const { getByTestId } = render(
        <Component testId="button" autoFocus>
          Hello
        </Component>,
      );
      const button = getByTestId('button');
      expect(button).toBe(document.activeElement);
    });

    it('should only set auto focus based on initial render', () => {
      const { getByTestId, rerender } = render(
        <Component testId="button">Hello</Component>,
      );
      const button = getByTestId('button');
      expect(button).not.toBe(document.activeElement);

      // setting autoFocus to true after an initial render
      rerender(
        <Component testId="button" autoFocus>
          Hello
        </Component>,
      );
      expect(button).not.toBe(document.activeElement);
    });
  });
});
