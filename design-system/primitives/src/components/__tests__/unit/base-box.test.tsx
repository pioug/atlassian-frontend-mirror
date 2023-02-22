import React from 'react';

import { render } from '@testing-library/react';

import { BaseBox } from '../../internal/base-box.partial';

const testId = 'test-BaseBox';

describe('BaseBox component', () => {
  it('should render BaseBox', () => {
    const { getByText } = render(<BaseBox>BaseBox</BaseBox>);
    expect(getByText('BaseBox')).toBeInTheDocument();
  });

  it('should render with a given test id', () => {
    const { getByTestId } = render(
      <BaseBox testId={testId}>BaseBox with testid</BaseBox>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
  });

  it('should render div by default', () => {
    const { getByTestId } = render(
      <BaseBox testId={testId}>BaseBox as div default</BaseBox>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('DIV');
  });

  it('should render given `as` element', () => {
    const { getByTestId } = render(
      <BaseBox testId={testId} as="span">
        BaseBox as span
      </BaseBox>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SPAN');
  });

  it('should render with plaintext', () => {
    const { getByText } = render(
      <BaseBox testId={testId}>BaseBox plaintext</BaseBox>,
    );
    const element = getByText('BaseBox plaintext');
    expect(element).toBeInTheDocument();
  });

  it('should render children', () => {
    const { getByTestId } = render(
      <BaseBox testId={testId}>
        <BaseBox testId="BaseBox-child">Child BaseBox</BaseBox>
      </BaseBox>,
    );
    const parent = getByTestId(testId);
    expect(parent).toBeInTheDocument();
    const child = getByTestId('BaseBox-child');
    expect(child).toBeInTheDocument();
  });

  it('should apply HTML/aria attributes', () => {
    const { getByTestId } = render(
      <BaseBox testId={testId} role="region" aria-label="test BaseBox">
        BaseBox with HTML attributes
      </BaseBox>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element.getAttribute('role')).toBe('region');
    expect(element.getAttribute('aria-label')).toBe('test BaseBox');
  });
});

describe('specific BaseBox behavior', () => {
  it('should apply className', () => {
    const { getByTestId } = render(
      <BaseBox className="test-className" testId={testId}>
        BaseBox className
      </BaseBox>,
    );

    const element = getByTestId(testId);
    expect(element.className.includes('test-className')).toBeTruthy();
  });
});
