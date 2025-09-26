import React, { forwardRef, type Ref } from 'react';

import { Link, type LinkProps, RouteComponent, Router } from 'react-resource-router';

import AppProvider, { type RouterLinkComponentProps } from '@atlaskit/app-provider';
import { Anchor } from '@atlaskit/primitives/compiled';

export type ReactResourceRouterLinkConfig = Pick<LinkProps, 'to' | 'href' | 'replace'>;

const HomePage = () => {
	return (
		<>
			{/* Internal link: Will render a router link */}
			<Anchor href="/about">Internal link</Anchor>
			{/* Advanced usage */}
			<Anchor<ReactResourceRouterLinkConfig>
				href={{
					to: '/about',
					replace: true,
				}}
			>
				Advanced link
			</Anchor>
			{/* External link: Will not render a router link */}
			<Anchor href="https://www.atlassian.com">External link</Anchor>
			{/* Non-HTTP-based: Will not render a router link */}
			<Anchor href="mailto:test@example.com">Email link</Anchor>
		</>
	);
};

/**
 * Configures a router link for the app provider.
 */
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

export default function RouterLinkConfiguration() {
	return (
		<AppProvider routerLinkComponent={MyRouterLinkComponent}>
			<Router
				routes={[
					{
						name: 'home',
						path: '',
						exact: true,
						component: HomePage,
					},
				]}
			>
				<RouteComponent />
			</Router>
		</AppProvider>
	);
}
