import React from 'react';
import { render, screen } from '@testing-library/react';

import SVG from '../../svg';

const testId = 'test';

describe('@atlaskit/icon', () => {
  describe('SVG', () => {
    it(`has role="presentation" and no aria-label with label=""`, () => {
      render(<SVG label="" testId={testId} />);

      const icon = screen.getByRole('presentation');
      expect(icon).not.toHaveAttribute('aria-label');
    });

    it(`has role="img" and aria-label with label="test"`, () => {
      render(<SVG label={'test'} testId={testId} />);

      const icon = screen.getByRole('img');
      expect(icon).toHaveAttribute('aria-label', 'test');
    });
  });
});
