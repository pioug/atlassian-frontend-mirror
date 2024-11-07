import React, { forwardRef, type Ref } from 'react';

import { BrowserRouter, Link, type LinkProps, Route, Switch } from 'react-router-dom';

import AppProvider, { type RouterLinkComponentProps, useRouterLink } from '@atlaskit/app-provider';
import { Box } from '@atlaskit/primitives';

export type LinkConfig = Pick<LinkProps, 'to' | 'replace'>;

const MyRouterLinkComponent = forwardRef(
	(
		{ href, children, ...rest }: RouterLinkComponentProps<LinkConfig>,
		ref: Ref<HTMLAnchorElement>,
	) => {
		if (typeof href === 'string') {
			return (
				<Link data-testid="react-router-link" to={href} {...rest}>
					{children}
				</Link>
			);
		}

		return (
			<Link data-testid="react-router-link" to={href.to} replace={href.replace} {...rest}>
				{children}
			</Link>
		);
	},
);

function LinkReactRouter() {
	const RouterLink = useRouterLink();

	if (!RouterLink) {
		return null;
	}

	return (
		<Box padding="space.200">
			<p>
				The <RouterLink href="/">router link component</RouterLink> is configured to render a React
				Router link.
			</p>
		</Box>
	);
}

function LinkReactRouterExample() {
	return (
		<AppProvider routerLinkComponent={MyRouterLinkComponent}>
			<BrowserRouter>
				<Switch>
					<Route component={LinkReactRouter} />
				</Switch>
			</BrowserRouter>
		</AppProvider>
	);
}

export default LinkReactRouterExample;
