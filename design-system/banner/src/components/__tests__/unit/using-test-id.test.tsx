import React from 'react';

import { render } from '@testing-library/react';

import Banner from '../../banner';

describe('Banner should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const testId = 'the-banner';
    const { getByTestId } = render(
      <Banner isOpen testId="the-banner">
        Your license is about to expire. Please renew your license within the
        next week.
      </Banner>,
    );

    expect(getByTestId(testId)).toBeTruthy();
  });
});
