import React from 'react';

import { render } from '@testing-library/react';

import Pagination from '../../index';

describe('Pagination should be found by data-testid', () => {
  const setup = () => {
    const testId = 'testing';

    const renderResult = render(
      <Pagination pages={[1, 2, 3, 4]} testId={testId} />,
    );

    return {
      testId,
      renderResult,
    };
  };

  it('Root element is accessible via data-testid', () => {
    const { renderResult, testId } = setup();

    expect(renderResult.getByTestId(testId)).toBeTruthy();
  });
});
