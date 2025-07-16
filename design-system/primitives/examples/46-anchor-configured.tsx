import React, { forwardRef, type Ref } from 'react';

import AppProvider, { type RouterLinkComponentProps } from '@atlaskit/app-provider';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Anchor, Box } from '@atlaskit/primitives';

type MyRouterLinkConfig = {
	to: string;
	customProp?: string;
};

const MyRouterLinkComponent = forwardRef(
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
					<th
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							width: '25%',
						}}
					>
						Link value
					</th>
					<th
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							width: '25%',
						}}
					>
						Link type
					</th>
					<th
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							width: '25%',
						}}
					>
						Should this use a router link?
					</th>
					<th
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							width: '25%',
						}}
					>
						Result
					</th>
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

export default function Configured() {
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
