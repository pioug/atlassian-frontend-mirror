import { render } from '@testing-library/react';
import React from 'react';
import Badge from '../..';

describe('Badge should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const testId = 'the-badge';
    const { getByTestId } = render(
      <Badge appearance="added" max={99} testId={testId}>
        3000
      </Badge>,
    );

    expect(getByTestId(testId)).toBeTruthy();
  });

  test('Using container snapshot', () => {
    const testId = 'the-badge';
    const { container } = render(
      <Badge appearance="added" max={99} testId={testId}>
        3000
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });
});
