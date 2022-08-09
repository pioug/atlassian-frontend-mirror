import React from 'react';

import { render } from '@testing-library/react';

import { UNSAFE_Box as Box, UNSAFE_Inline as Inline } from '../../../index';

describe('Inline component', () => {
  const testId = 'test';

  it('should render inline', () => {
    const { getByText } = render(
      <Inline gap="sp-50">
        <Box>1</Box>
        <Box>2</Box>
      </Inline>,
    );
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
  });

  it('should render inline with dividers', () => {
    const { getByText } = render(
      <Inline gap="sp-50" divider="/">
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
      <Inline gap="sp-50" testId={testId}>
        <Box>1</Box>
        <Box>2</Box>
      </Inline>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
  });
});
