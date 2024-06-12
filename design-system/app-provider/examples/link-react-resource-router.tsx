import React, { forwardRef, type Ref } from 'react';

import {
	createBrowserHistory,
	Link,
	type LinkProps,
	RouteComponent,
	Router,
} from 'react-resource-router';

import { Box } from '@atlaskit/primitives';

import AppProvider, { type RouterLinkComponentProps } from '../src';
import useRouterLink from '../src/router-link-provider/hooks/use-router-link';

type LinkConfig = Pick<LinkProps, 'to' | 'href' | 'replace'>;

const MyRouterLinkComponent = forwardRef(
	(
		{ href, children, ...rest }: RouterLinkComponentProps<LinkConfig>,
		ref: Ref<HTMLAnchorElement>,
	) => {
		if (typeof href === 'string') {
			return (
				<Link data-testid="react-resource-router-link" href={href} {...rest}>
					{children}
				</Link>
			);
		}

		return (
			<Link
				data-testid="react-resource-router-link"
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

function LinkReactResourceRouter() {
	const RouterLink = useRouterLink();

	if (!RouterLink) {
		return null;
	}

	return (
		<Box padding="space.200">
			<p>
				The <RouterLink href="/">router link component</RouterLink> is configured to render a React
				Resource Router link.
			</p>
		</Box>
	);
}

const history = createBrowserHistory();

const appRoutes = [
	{
		name: 'home',
		path: '',
		exact: true,
		component: LinkReactResourceRouter,
		navigation: null,
	},
];

function LinkReactResourceRouterExample() {
	return (
		<AppProvider routerLinkComponent={MyRouterLinkComponent}>
			<Router routes={appRoutes} history={history}>
				<RouteComponent />
			</Router>
		</AppProvider>
	);
}

export default LinkReactResourceRouterExample;
