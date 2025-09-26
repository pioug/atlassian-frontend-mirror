import React, { forwardRef, type Ref } from 'react';

import { Link, type LinkProps, RouteComponent, Router } from 'react-resource-router';

import AppProvider, { type RouterLinkComponentProps } from '@atlaskit/app-provider';

type ReactResourceRouterLinkConfig = Pick<LinkProps, 'to' | 'href' | 'replace'>;

const MyRouterLinkComponent: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<RouterLinkComponentProps<ReactResourceRouterLinkConfig>> &
		React.RefAttributes<HTMLAnchorElement>
> = forwardRef(
	(
		{ href, children, ...rest }: RouterLinkComponentProps<ReactResourceRouterLinkConfig>,
		ref: Ref<HTMLAnchorElement>,
	) => {
		// A basic link by passing a string as the component's `href` prop.
		if (typeof href === 'string') {
			return (
				<Link ref={ref} href={href} {...rest}>
					{children}
				</Link>
			);
		}

		// Advanced link configuration by passing an object as the
		// component's `href` prop
		return (
			<Link ref={ref} href={href.href} to={href.to} replace={href.replace} {...rest}>
				{children}
			</Link>
		);
	},
);

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
		<AppProvider routerLinkComponent={MyRouterLinkComponent}>
			<Router routes={routes}>
				<RouteComponent />
			</Router>
		</AppProvider>
	);
}

const CodeBlock = `import React, { forwardRef, type Ref } from 'react';
import {
  Link,
  type LinkProps,
  RouteComponent,
  Router,
} from 'react-resource-router';
import AppProvider, { type RouterLinkComponentProps } from '@atlaskit/app-provider';

type ReactResourceRouterLinkConfig = Pick<LinkProps, 'to' | 'href' | 'replace'>;

const MyRouterLinkComponent = forwardRef(
  (
    {
      href,
      children,
      ...rest
    }: RouterLinkComponentProps<ReactResourceRouterLinkConfig>,
    ref: Ref<HTMLAnchorElement>,
  ) => {
    // A basic link by passing a string as the component's \`href\` prop.
    if (typeof href === 'string') {
      return (
        <Link ref={ref} href={href} {...rest}>
          {children}
        </Link>
      );
    }

    // Advanced link configuration by passing an object as the
    // component's \`href\` prop
    return (
      <Link
        ref={ref}
        href={href.href}
        to={href.to}
        replace={href.replace}
        {...rest}
      >
        {children}
      </Link>
    );
  },
);

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
    <AppProvider routerLinkComponent={MyRouterLinkComponent}>
      <Router routes={routes}>
        <RouteComponent />
      </Router>
    </AppProvider>
  );
}`;

export default { example: App, code: CodeBlock };
