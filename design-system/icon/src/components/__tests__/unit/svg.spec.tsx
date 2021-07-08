import React from 'react';
import { cleanup, render } from '@testing-library/react';

import SVG from '../../svg';

const testId = 'test';

describe('@atlaskit/icon', () => {
  afterEach(cleanup);
  describe('SVG', () => {
    [
      { label: '', role: 'presentation' },
      { label: 'test', role: 'img' },
    ].forEach(({ label, role: expectedRole }) => {
      it(`switches role with label ${label}`, () => {
        const { getByTestId } = render(<SVG label={label} testId={testId} />);
        expect(getByTestId(testId).getAttribute('role')).toEqual(expectedRole);
      });
    });
  });
});
