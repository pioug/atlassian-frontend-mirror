import React from 'react';

import { HashRouter, Link, Route, Switch } from 'react-router-dom';

import Box from '@atlaskit/ds-explorations/box';
import Heading from '@atlaskit/heading';

import Pagination from '../src';

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
  <Box flexDirection="column">
    <Heading level="h800">Dashboard</Heading>
    <PaginationWithSelectPage pageSelected={0} />
  </Box>
);
const About = () => (
  <Box flexDirection="column">
    <Heading level="h800">About page</Heading>
    <PaginationWithSelectPage pageSelected={1} />
  </Box>
);
const Contact = () => (
  <Box flexDirection="column">
    <Heading level="h800">Contact page</Heading>
    <PaginationWithSelectPage pageSelected={2} />
  </Box>
);

interface LinkProps {
  isDisabled: boolean;
  page: any;
  pages: any[];
  selectedIndex: number;
  style: object;
}

function renderLink(pageType: string, selectedIndex: number) {
  return function PageItem({
    isDisabled,
    page,
    pages,
    style,
    ...rest
  }: LinkProps) {
    let href;
    if (pageType === 'page') {
      href = page.href;
    } else if (pageType === 'previous') {
      href = selectedIndex > 1 ? pages[selectedIndex - 1].href : '';
    } else {
      href =
        selectedIndex < pages.length - 1 ? pages[selectedIndex + 1].href : '';
    }
    return isDisabled ? (
      <Box UNSAFE_style={style} {...rest} />
    ) : (
      <Link style={style} {...rest} to={href} />
    );
  };
}

const PaginationWithSelectPage = ({
  pageSelected,
}: {
  pageSelected: number;
}) => (
  <Box paddingBlock="space.300">
    <Pagination
      testId="pagination"
      getPageLabel={(page: any) =>
        typeof page === 'object' ? page.label : page
      }
      selectedIndex={pageSelected}
      pages={PAGES}
      components={{
        Page: renderLink('page', pageSelected),
        Previous: renderLink('previous', pageSelected),
        Next: renderLink('next', pageSelected),
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
