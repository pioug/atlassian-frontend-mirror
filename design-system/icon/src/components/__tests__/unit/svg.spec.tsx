import React from 'react';
import { cleanup, render } from '@testing-library/react';

import SVG from '../../svg';

const testId = 'test';

describe('@atlaskit/icon', () => {
  afterEach(cleanup);
  describe('SVG', () => {
    it(`has role="presentation" and no aria-label with label=""`, () => {
      const { getByTestId } = render(<SVG label="" testId={testId} />);

      const icon = getByTestId(testId);
      expect(icon).toHaveAttribute('role', 'presentation');
      expect(icon).not.toHaveAttribute('aria-label');
    });

    it(`has role="img" and aria-label with label="test"`, () => {
      const { getByTestId } = render(<SVG label={'test'} testId={testId} />);

      const icon = getByTestId(testId);
      expect(icon).toHaveAttribute('role', 'img');
      expect(icon).toHaveAttribute('aria-label', 'test');
    });
  });
});
