import React from 'react';

import { render, screen } from '@testing-library/react';

import { IconButton } from '../../index';

describe('<IconButton />', () => {
  it('should pass down test id', () => {
    const label = 'label';
    render(
      <IconButton tooltip="test" label={label} icon={<div />} testId="icon" />,
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should pass `label` prop to `aria-label`', () => {
    const label = 'label';
    render(
      <IconButton tooltip={label} label={label} icon={<div />} testId="icon" />,
    );

    expect(screen.getByTestId('icon')).toHaveAttribute('aria-label', label);
  });

  it('can be used with custom components', () => {
    const MyComponent = React.forwardRef(
      ({ href, children, ...rest }: any, ref) => (
        <a href={href} ref={ref} {...rest} data-testid="custom">
          {children}
        </a>
      ),
    );

    const href = 'some/test/path';
    render(
      <IconButton
        tooltip="test"
        icon={<div />}
        testId="icon"
        label="Home"
        component={MyComponent}
        href={href}
      />,
    );

    expect(screen.queryByTestId('custom')).toHaveAttribute('href', href);
  });
});
