import React from 'react';

import { render, screen } from '@testing-library/react';

import { Box, Stack, xcss } from '../../../../src';

const testId = 'test';
const styles = xcss({
  justifyContent: 'space-around',
  alignItems: 'start',
  flexWrap: 'nowrap',
  flexGrow: '42',
  gap: 'space.100',
});

describe('Stack', () => {
  it('should render stack', () => {
    render(
      <Stack space="space.050">
        <Box>1</Box>
        <Box>2</Box>
      </Stack>,
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render with a given test id', () => {
    render(
      <Stack space="space.050" testId={testId}>
        <Box>1</Box>
        <Box>2</Box>
      </Stack>,
    );
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
  });

  test('`xcss` should result in expected css', () => {
    render(
      <Stack
        testId={testId}
        alignInline="end"
        alignBlock="end"
        spread="space-between"
        grow="fill"
        space="space.0"
        xcss={styles}
      >
        child
      </Stack>,
    );
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();

    expect(element).toHaveCompiledCss({
      // Every value in here overrides the props values
      // eg. `props.alignInline="end"` is overridden by `xcss.justifyContent: 'start'`
      alignItems: 'start',
      justifyContent: 'space-around',
      flexWrap: 'nowrap',
      flexGrow: '42',
      gap: 'var(--ds-space-100, 8px)',
    });
  });
});
