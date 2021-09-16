import React from 'react';

import { cleanup, render } from '@testing-library/react';

import { ProgressDotsWithoutAnalytics } from '../../progress-dots';
import { Size, Spacing } from '../../types';

const values = [1, 2, 3];

describe('<ProgressDots />', () => {
  afterEach(cleanup);

  describe('spacing', () => {
    it.each([
      ['compact', '2px'],
      ['cozy', '4px'],
      ['comfortable', '8px'],
    ])('should reflect %s spacing correctly', (size, result) => {
      const { getByTestId } = render(
        <ProgressDotsWithoutAnalytics
          spacing={size as Spacing}
          testId="test"
          selectedIndex={0}
          values={values}
        />,
      );

      // this is the whole component
      const element = getByTestId('test');

      const styles = getComputedStyle(element);
      expect(styles.getPropertyValue('--ds-dots-margin')).toEqual(result);
      expect(element).toHaveStyleDeclaration('gap', 'var(--ds-dots-margin)');
    });
  });

  describe('sizing', () => {
    it.each([
      ['default', '8px'],
      ['small', '4px'],
      ['large', '12px'],
    ])('should reflect %s sizing correctly', (size, result) => {
      const { getByTestId } = render(
        <ProgressDotsWithoutAnalytics
          size={size as Size}
          testId="test"
          selectedIndex={0}
          values={values}
        />,
      );

      // this is the whole component
      const container = getByTestId('test');

      // this is the individual indicator
      const element = getByTestId('test-ind-0');

      const styles = getComputedStyle(container);
      expect(styles.getPropertyValue('--ds-dots-size')).toEqual(result);
      expect(element).toHaveStyleDeclaration('width', 'var(--ds-dots-size)');
      expect(element).toHaveStyleDeclaration('height', 'var(--ds-dots-size)');
    });
  });
});
