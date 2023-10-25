import React from 'react';

import {
  Link,
  type LinkProps,
  RouteComponent,
  Router,
} from 'react-resource-router';

import AppProvider, { type RouterLinkComponentProps } from '../../src';

type ReactResourceRouterLinkConfig = Pick<LinkProps, 'to' | 'href' | 'replace'>;

const MyRouterLink = ({
  href,
  children,
  ...rest
}: RouterLinkComponentProps<ReactResourceRouterLinkConfig>) => {
  // A basic link by passing a string as the component's `href` prop.
  if (typeof href === 'string') {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  // Advanced link configuration by passing an object as the
  // component's `href` prop
  return (
    <Link href={href.href} to={href.to} replace={href.replace} {...rest}>
      {children}
    </Link>
  );
};

const routes = [
  {
    name: 'home',
    path: '',
    exact: true,
    component: () => <div>Home page component</div>,
  },
];

function App() {
  return (
    <AppProvider routerLinkComponent={MyRouterLink}>
      <Router routes={routes}>
        <RouteComponent />
      </Router>
    </AppProvider>
  );
}

export default App;
