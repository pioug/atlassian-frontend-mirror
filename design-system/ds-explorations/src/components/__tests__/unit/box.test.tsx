import React from 'react';

import { render } from '@testing-library/react';

import { UNSAFE_Box as Box } from '../../../index';

describe('Box component', () => {
  const testId = 'test';

  it('should render box', () => {
    const { getByText } = render(<Box>Box</Box>);
    expect(getByText('Box')).toBeInTheDocument();
  });

  it('should render with a given test id', () => {
    const { getByTestId } = render(<Box testId={testId}>Box with testid</Box>);
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
  });
});
