import React from 'react';

import { render } from '@testing-library/react';

import { Box, Inline } from '../../../../src';

describe('Inline', () => {
  const testId = 'test';

  it('should render inline', () => {
    const { getByText } = render(
      <Inline space="050">
        <Box>1</Box>
        <Box>2</Box>
      </Inline>,
    );
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
  });

  it('should render inline with separators', () => {
    const { getByText } = render(
      <Inline space="050" separator="/">
        <Box>1</Box>
        <Box>2</Box>
      </Inline>,
    );
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('/')).toBeInTheDocument();
  });

  it('should render with a given test id', () => {
    const { getByTestId } = render(
      <Inline space="050" testId={testId}>
        <Box>1</Box>
        <Box>2</Box>
      </Inline>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
  });
});
