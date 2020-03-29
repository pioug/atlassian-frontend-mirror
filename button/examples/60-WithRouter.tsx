import React from 'react';
import { Link, MemoryRouter } from 'react-router-dom';
import Button from '../src';

const ButtonWithRouter = () => (
  <div>
    <MemoryRouter>
      <Button
        appearance="subtle-link"
        href="/"
        component={React.forwardRef<
          HTMLElement,
          React.AllHTMLAttributes<HTMLElement>
        >(({ href = '', children, ...rest }, ref: any) => (
          <Link {...(rest as any)} to={href} innerRef={ref}>
            {children}
          </Link>
        ))}
      >
        Button Using Routing
      </Button>
    </MemoryRouter>
  </div>
);

export default ButtonWithRouter;
