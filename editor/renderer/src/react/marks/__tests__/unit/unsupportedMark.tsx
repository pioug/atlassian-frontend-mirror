import UnsupportedMark from '../../unsupportedMark';
import { render } from '@testing-library/react';
import React from 'react';

describe('UnsupportedMark', () => {
  const DummyComponent = () => <p>Hello</p>;

  it('should wrap the passed contents in a span', () => {
    const { container, getByText } = render(
      <UnsupportedMark
        dataAttributes={{ 'data-renderer-mark': true }}
        children={<DummyComponent />}
      />,
    );

    const spanElement = container.querySelector('span');
    expect(spanElement).toBeInTheDocument();
    expect(spanElement).toHaveAttribute('data-renderer-mark', 'true');
    expect(getByText('Hello')).toBeInTheDocument();
  });
});
