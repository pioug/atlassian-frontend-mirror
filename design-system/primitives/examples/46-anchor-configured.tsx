/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { forwardRef, type Ref } from 'react';

import AppProvider from '@atlaskit/app-provider/app-provider';
import type { RouterLinkComponentProps } from '@atlaskit/app-provider/router-link-provider';
import { cssMap, jsx } from '@atlaskit/css';
import { Anchor } from '@atlaskit/primitives/compiled/anchor';
import { Box } from '@atlaskit/primitives/compiled/box';

type MyRouterLinkConfig = {
	to: string;
	customProp?: string;
};

const styles = cssMap({
	tableHeader: { width: '25%' },
});

const MyRouterLinkComponent: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<RouterLinkComponentProps<MyRouterLinkConfig>> &
		React.RefAttributes<HTMLAnchorElement>
> = forwardRef(
	(
		{ href, children, ...rest }: RouterLinkComponentProps<MyRouterLinkConfig>,
		ref: Ref<HTMLAnchorElement>,
	) => {
		const label = <>{children} (Router link)</>;

		// A simple link by passing a string as the `href` prop
		if (typeof href === 'string') {
			return (
				// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
				<a ref={ref} data-test-link-type="simple" href={href} {...rest}>
					{label}
				</a>
			);
		}

		// A configured link by passing an object as the `href` prop
		return (
			// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
			<a
				ref={ref}
				data-test-link-type="advanced"
				data-custom-attribute={href.customProp}
				href={href.to}
				{...rest}
			>
				{label}
			</a>
		);
	},
);

const Table = ({
	title,
	hasRouterLinkSet,
	id,
}: {
	id: string;
	title: string;
	hasRouterLinkSet?: boolean;
}) => {
	return (
		<table>
			<caption>{title}</caption>
			<thead>
				<tr>
					<th css={styles.tableHeader}>Link value</th>
					<th css={styles.tableHeader}>Link type</th>
					<th css={styles.tableHeader}>Should this use a router link?</th>
					<th css={styles.tableHeader}>Result</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<code>/home</code>
					</td>
					<td>Internal link</td>
					<td>{hasRouterLinkSet ? 'Yes ✅' : 'No ❌'}</td>
					<td>
						<Anchor testId={`${id}-internal-link`} href="/home">
							Hello world
						</Anchor>
					</td>
				</tr>
				<tr>
					<td>
						<code>http://atlassian.com</code>
					</td>
					<td>External link (http)</td>
					<td>No ❌</td>
					<td>
						<Anchor testId={`${id}-external-link-http`} href="http://atlassian.com">
							Hello world
						</Anchor>
					</td>
				</tr>
				<tr>
					<td>
						<code>https://atlassian.com</code>
					</td>
					<td>External link (https)</td>
					<td>No ❌</td>
					<td>
						<Anchor testId={`${id}-external-link-https`} href="https://atlassian.com">
							Hello world
						</Anchor>
					</td>
				</tr>
				<tr>
					<td>
						<code>mailto:test@example.com</code>
					</td>
					<td>Email</td>
					<td>No ❌</td>
					<td>
						<Anchor testId={`${id}-mailto-link`} href="mailto:test@example.com">
							Hello world
						</Anchor>
					</td>
				</tr>
				<tr>
					<td>
						<code>tel:0400-000-000</code>
					</td>
					<td>Telephone</td>
					<td>No ❌</td>
					<td>
						<Anchor testId={`${id}-tel-link`} href="tel:0400-000-000">
							Hello world
						</Anchor>
					</td>
				</tr>
				<tr>
					<td>
						<code>sms:0400-000-000?&body=foo</code>
					</td>
					<td>SMS</td>
					<td>No ❌</td>
					<td>
						<Anchor testId={`${id}-sms`} href="sms:0400-000-000?&body=foo">
							Hello world
						</Anchor>
					</td>
				</tr>
				<tr id={`hash-${id}`}>
					<td>
						<code>#hash</code>
					</td>
					<td>Hash link (on current page)</td>
					<td>No ❌</td>
					<td>
						<Anchor testId={`${id}-hash-link-current-page`} href={`#hash-${id}`}>
							Hello world
						</Anchor>
					</td>
				</tr>
				<tr>
					<td>
						<code>/home#hash</code>
					</td>
					<td>Hash link (on internal page)</td>
					<td>{hasRouterLinkSet ? 'Yes ✅' : 'No ❌'}</td>
					<td>
						<Anchor testId={`${id}-hash-link-internal`} href="/home#hash">
							Hello world
						</Anchor>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default function Configured(): React.JSX.Element {
	return (
		<Box padding="space.200">
			<Table title="Anchor primitives outside an AppProvider" id="outside-app-provider" />
			<AppProvider>
				<Table
					title="Anchor primitives inside an AppProvider, with no routerLinkComponent set"
					id="in-app-provider-no-component"
				/>
			</AppProvider>
			<AppProvider routerLinkComponent={MyRouterLinkComponent}>
				<Table
					title="Anchor primitives inside an AppProvider, with a routerLinkComponent set"
					id="in-app-provider-with-component"
					hasRouterLinkSet
				/>
			</AppProvider>
		</Box>
	);
}
