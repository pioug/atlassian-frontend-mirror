import React from 'react';

import { render } from '@testing-library/react';

import { Box } from '../../../index';

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

  it('should render div by default', () => {
    const { getByTestId } = render(
      <Box testId={testId}>Box as div default</Box>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('DIV');
  });

  it('should render given `as` element', () => {
    const { getByTestId } = render(
      <Box testId={testId} as="span">
        Box as span
      </Box>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SPAN');
  });

  it('should render with plaintext', () => {
    const { getByText } = render(<Box testId={testId}>Box plaintext</Box>);
    const element = getByText('Box plaintext');
    expect(element).toBeInTheDocument();
  });

  it('should render children', () => {
    const { getByTestId } = render(
      <Box testId={testId}>
        <Box testId="box-child">Child box</Box>
      </Box>,
    );
    const parent = getByTestId(testId);
    expect(parent).toBeInTheDocument();
    const child = getByTestId('box-child');
    expect(child).toBeInTheDocument();
  });

  it('should apply HTML/aria attributes', () => {
    const { getByTestId } = render(
      <Box testId={testId} role="region" aria-label="test box">
        Box with HTML attributes
      </Box>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element.getAttribute('role')).toBe('region');
    expect(element.getAttribute('aria-label')).toBe('test box');
  });
});
