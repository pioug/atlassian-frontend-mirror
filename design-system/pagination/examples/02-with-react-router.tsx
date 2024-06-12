import React from 'react';

import { HashRouter, Link, Route, Switch } from 'react-router-dom';

import Heading from '@atlaskit/heading';
import { Box, Stack } from '@atlaskit/primitives';

import Pagination from '../src';

interface Pages {
	href: string;
	label: string;
}

const PAGES = [
	{
		href: '/',
		label: '1',
	},
	{
		href: '/about',
		label: '2',
	},
	{
		href: '/contact',
		label: '3',
	},
];

const Dashboard = () => (
	<Stack>
		<Heading level="h800">Dashboard</Heading>
		<PaginationWithSelectPage pageSelected={0} />
	</Stack>
);
const About = () => (
	<Stack>
		<Heading level="h800">About page</Heading>
		<PaginationWithSelectPage pageSelected={1} />
	</Stack>
);
const Contact = () => (
	<Stack>
		<Heading level="h800">Contact page</Heading>
		<PaginationWithSelectPage pageSelected={2} />
	</Stack>
);

interface LinkProps {
	isDisabled: boolean;
	page: any;
	selectedIndex: number;
	style: object;
}

function renderLink(pageType: string, selectedIndex: number, pages: Pages[]) {
	return function PageItem({ isDisabled, page, style, ...rest }: LinkProps) {
		let href;
		if (pageType === 'page') {
			href = page.href;
		} else if (pageType === 'previous') {
			href = selectedIndex > 1 ? pages[selectedIndex - 1].href : '';
		} else {
			href = selectedIndex < pages.length - 1 ? pages[selectedIndex + 1].href : '';
		}
		return isDisabled ? (
			// eslint-disable-next-line @atlaskit/design-system/use-primitives, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={style} {...rest} />
		) : (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<Link style={style} {...rest} to={href} />
		);
	};
}

const PaginationWithSelectPage = ({ pageSelected }: { pageSelected: number }) => (
	<Box paddingBlock="space.300">
		<Pagination
			testId="pagination"
			getPageLabel={(page: any) => (typeof page === 'object' ? page.label : page)}
			selectedIndex={pageSelected}
			pages={PAGES}
			components={{
				Page: renderLink('page', pageSelected, PAGES),
				Previous: renderLink('previous', pageSelected, PAGES),
				Next: renderLink('next', pageSelected, PAGES),
			}}
			nextLabel="Next"
			label="React Router Page"
			pageLabel="Page"
			previousLabel="Previous"
		/>
	</Box>
);

export default function WithReactRouterLink() {
	return (
		<HashRouter>
			<Switch>
				<Route path="/about" component={About} />
				<Route path="/contact" component={Contact} />
				<Route path="/" isExact component={Dashboard} />
			</Switch>
		</HashRouter>
	);
}
