import React from 'react';

import {
  BrowserRouter,
  Link,
  type LinkProps,
  Route,
  Switch,
} from 'react-router-dom';

import { Box } from '@atlaskit/primitives';

import AppProvider, { type RouterLinkComponentProps } from '../src';
import useRouterLink from '../src/router-link-provider/hooks/use-router-link';

export type LinkConfig = Pick<LinkProps, 'to' | 'replace'>;

const MyRouterLink = ({
  href,
  children,
  ...rest
}: RouterLinkComponentProps<LinkConfig>) => {
  if (typeof href === 'string') {
    return (
      <Link data-testid="react-router-link" to={href} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <Link
      data-testid="react-router-link"
      to={href.to}
      replace={href.replace}
      {...rest}
    >
      {children}
    </Link>
  );
};

function LinkReactRouter() {
  const RouterLink = useRouterLink();

  if (!RouterLink) {
    return null;
  }

  return (
    <Box padding="space.200">
      <p>
        The <RouterLink href="/">router link component</RouterLink> is
        configured to render a React Router link.
      </p>
    </Box>
  );
}

function LinkReactRouterExample() {
  return (
    <AppProvider routerLinkComponent={MyRouterLink}>
      <BrowserRouter>
        <Switch>
          <Route component={LinkReactRouter} />
        </Switch>
      </BrowserRouter>
    </AppProvider>
  );
}

export default LinkReactRouterExample;
