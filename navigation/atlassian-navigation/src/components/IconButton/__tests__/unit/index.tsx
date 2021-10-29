import React from 'react';

import { render } from '@testing-library/react';

import { IconButton } from '../../index';

describe('<IconButton />', () => {
  it('should pass down test id', () => {
    const { getByTestId } = render(
      <IconButton tooltip="test" icon={<div />} testId="icon" />,
    );

    expect(() => getByTestId('icon')).not.toThrow();
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
    const { queryByTestId } = render(
      <IconButton
        tooltip="test"
        icon={<div />}
        testId="icon"
        component={MyComponent}
        href={href}
      />,
    );

    expect(queryByTestId('custom')).toHaveAttribute('href', href);
  });
});
