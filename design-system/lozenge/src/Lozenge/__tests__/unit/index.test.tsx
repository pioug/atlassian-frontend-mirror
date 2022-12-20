import React from 'react';

import { render } from '@testing-library/react';

import Lozenge from '../../../index';

describe('Lozenge', () => {
  describe('maxWidth property', () => {
    it('should set default max width to 200px', () => {
      const { getByTestId } = render(
        <Lozenge appearance="new" testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByTestId('lozenge--text')).toHaveStyle(
        `max-width: calc(200px - var(--ds-space-100, 8px))`,
      );
    });

    it('should set custom numeric max width', () => {
      const { getByTestId } = render(
        <Lozenge appearance="new" maxWidth={120} testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByTestId('lozenge--text')).toHaveStyle(
        `max-width: calc(120px - var(--ds-space-100, 8px))`,
      );
    });

    it('should set custom string max width - percentage', () => {
      const { getByTestId } = render(
        <Lozenge appearance="new" maxWidth="99%" testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByTestId('lozenge--text')).toHaveStyle(
        `max-width: calc(99% - var(--ds-space-100, 8px))`,
      );
    });

    it('should set custom string max width - none', () => {
      const { getByTestId } = render(
        <Lozenge appearance="new" maxWidth="none" testId="lozenge">
          hello world
        </Lozenge>,
      );

      expect(getByTestId('lozenge--text')).not.toHaveStyleRule('max-width');
    });
  });
});
