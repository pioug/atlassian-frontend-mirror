import React from 'react';

import { render } from '@testing-library/react';

import { UNSAFE_Box as Box, UNSAFE_Stack as Stack } from '../../../index';

describe('Stack component', () => {
  const testId = 'test';

  it('should render stack', () => {
    const { getByText } = render(
      <Stack gap="sp-50">
        <Box>1</Box>
        <Box>2</Box>
      </Stack>,
    );
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
  });

  it('should render with a given test id', () => {
    const { getByTestId } = render(
      <Stack gap="sp-50" testId={testId}>
        <Box>1</Box>
        <Box>2</Box>
      </Stack>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
  });
});
