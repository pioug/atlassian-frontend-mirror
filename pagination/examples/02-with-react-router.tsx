import React, { Component } from 'react';
import { gridSize } from '@atlaskit/theme';
import { HashRouter, Link, Route, Switch } from 'react-router-dom';
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
  <div>
    <h1>Dashboard</h1>
    <PaginationWithSelectPage pageSelected={0} />
  </div>
);
const About = () => (
  <div>
    <h1>About page</h1>
    <PaginationWithSelectPage pageSelected={1} />
  </div>
);
const Contact = () => (
  <div>
    <h1>Contact page</h1>
    <PaginationWithSelectPage pageSelected={2} />
  </div>
);

interface Props {
  disabled: boolean;
  page: any;
  pages: any[];
  selectedIndex: number;
  style: object;
}

function renderLink(pageType: string) {
  return class extends Component<Props> {
    render() {
      const { disabled, page, pages, selectedIndex, ...rest } = this.props;
      let href;
      if (pageType === 'page') {
        // eslint-disable-next-line
        href = page.href;
      } else if (pageType === 'previous') {
        href = selectedIndex > 1 ? pages[selectedIndex - 1].href : '';
      } else {
        href =
          selectedIndex < pages.length - 1 ? pages[selectedIndex + 1].href : '';
      }
      // We need this styling on the navigator since when using icons as children we need extra padding
      const style =
        pageType === 'page'
          ? undefined
          : {
              paddingLeft: `${gridSize() / 2}px`,
              paddingRight: `${gridSize() / 2}px`,
            };
      return disabled ? (
        <div {...rest} style={style} />
      ) : (
        <Link {...rest} style={style} to={href} />
      );
    }
  };
}

const PaginationWithSelectPage = ({
  pageSelected,
}: {
  pageSelected: number;
}) => (
  <div style={{ marginTop: `${gridSize() * 3} px` }}>
    <Pagination
      innerStyles={{ marginTop: '24px' }}
      getPageLabel={(page: any) =>
        typeof page === 'object' ? page.label : page
      }
      selectedIndex={pageSelected}
      pages={PAGES}
      components={{
        Page: renderLink('page'),
        Previous: renderLink('previous'),
        Next: renderLink('next'),
      }}
    />
  </div>
);

// eslint-disable-next-line react/no-multi-comp
export default class WithReactRouterLink extends Component<{}> {
  render() {
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
}
