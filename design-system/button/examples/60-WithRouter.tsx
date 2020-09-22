import React from 'react';

import { Link, MemoryRouter } from 'react-router-dom';

import Button, { ButtonProps } from '../src';

const Component = React.forwardRef<HTMLElement, ButtonProps>(function Component(
  { href = '', children, ...rest },
  ref: any,
) {
  return (
    <Link {...(rest as any)} to={href} innerRef={ref}>
      {children}
    </Link>
  );
});

const ButtonWithRouter = () => (
  <div>
    <MemoryRouter>
      <Button appearance="subtle-link" href="/" component={Component}>
        Button Using Routing
      </Button>
    </MemoryRouter>
  </div>
);

export default ButtonWithRouter;
