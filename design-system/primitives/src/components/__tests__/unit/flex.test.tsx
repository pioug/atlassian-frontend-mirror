import React from 'react';

import { render, screen } from '@testing-library/react';

import { Flex, xcss } from '../../../index';

const testId = 'test';
const styles = xcss({
  alignItems: 'start',
  justifyContent: 'start',
  gap: 'space.100',
  columnGap: 'space.100',
  rowGap: 'space.100',
  flexDirection: 'row',
  flexWrap: 'wrap',
});

describe('Flex component', () => {
  it('should render with a given test id', () => {
    render(<Flex testId={testId}>Flex with testid</Flex>);
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
  });

  it('should render div by default', () => {
    render(<Flex testId={testId}>Flex as div default</Flex>);
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('DIV');
  });

  it('should render given `as` element', () => {
    render(
      <Flex testId={testId} as="span">
        Flex as span
      </Flex>,
    );
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SPAN');
  });

  it('should render children', () => {
    render(
      <Flex testId={testId}>
        <div data-testid="flex-child">Child text</div>
      </Flex>,
    );
    const parent = screen.getByTestId(testId);
    expect(parent).toBeInTheDocument();
    const child = screen.getByTestId('flex-child');
    expect(child).toBeInTheDocument();
    expect(parent).toContainElement(child);
  });

  test('`xcss` should result in expected css', () => {
    render(
      <Flex
        testId={testId}
        alignItems="end"
        justifyContent="end"
        gap="space.0"
        columnGap="space.0"
        rowGap="space.0"
        direction="column"
        wrap="nowrap"
        xcss={styles}
      >
        child
      </Flex>,
    );
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();

    expect(element).toHaveCompiledCss({
      // Every value in here overrides the props values
      // eg. `props.gap="space.0"` is overridden by `xcss.gap: 'space.100'`
      alignItems: 'start',
      justifyContent: 'start',
      gap: 'var(--ds-space-100, 8px)',
      columnGap: 'var(--ds-space-100, 8px)',
      rowGap: 'var(--ds-space-100, 8px)',
      flexDirection: 'row',
      flexWrap: 'wrap',
    });
  });
});
