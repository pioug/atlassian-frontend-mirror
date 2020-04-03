/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';
import { HashRouter, Link, Route, Switch } from 'react-router-dom';
import GlobalNavigation from '@atlaskit/global-navigation';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import ComponentIcon from '@atlaskit/icon/glyph/component';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import IssueIcon from '@atlaskit/icon/glyph/issue';
import PageIcon from '@atlaskit/icon/glyph/page';
import PortfolioIcon from '@atlaskit/icon/glyph/portfolio';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import { JiraIcon, JiraWordmark } from '@atlaskit/logo';
import {
  ItemAvatar,
  LayoutManagerWithViewController,
  NavigationProvider,
  // ViewController was coming as type.
  // eslint-disable-next-line no-unused-vars
  ViewController,
  withNavigationViewController,
} from '../../../src';

const MyGlobalNavigation = () => (
  <GlobalNavigation
    productIcon={() => <JiraIcon size="medium" />}
    onProductClick={() => {}}
  />
);

const LinkItem = ({ components: { Item }, to, ...props }) => {
  return (
    <Route
      render={({ location: { pathname } }) => (
        <Item
          component={({ children, className }) => (
            <Link className={className} to={to}>
              {children}
            </Link>
          )}
          isSelected={pathname === to}
          {...props}
        />
      )}
    />
  );
};

const productHomeView = {
  id: 'product/home',
  type: 'product',
  getItems: () => [
    {
      type: 'HeaderSection',
      id: 'product/home:header',
      items: [
        {
          type: 'Wordmark',
          wordmark: JiraWordmark,
          id: 'jira-wordmark',
        },
      ],
    },
    {
      type: 'MenuSection',
      nestedGroupKey: 'menu',
      id: 'product/home:menu',
      parentId: null,
      items: [
        {
          type: 'InlineComponent',
          component: LinkItem,
          id: 'dashboards',
          before: DashboardIcon,
          text: 'Dashboards',
          to: '/',
        },
        { type: 'Item', id: 'projects', before: FolderIcon, text: 'Projects' },
        {
          type: 'Item',
          id: 'issues-and-filters',
          goTo: 'product/issues',
          before: IssueIcon,
          text: 'Issues and filters',
        },
        {
          type: 'Item',
          id: 'portfolio',
          before: PortfolioIcon,
          text: 'Portfolio',
        },
      ],
    },
  ],
};

const productIssuesView = {
  id: 'product/issues',
  type: 'product',
  getItems: () =>
    new Promise(resolve =>
      setTimeout(
        () =>
          resolve([
            {
              type: 'HeaderSection',
              id: 'product/issues:header',
              items: [
                {
                  type: 'Wordmark',
                  wordmark: JiraWordmark,
                  id: 'jira-wordmark',
                },
                {
                  type: 'BackItem',
                  id: 'back-item',
                  goTo: 'product/home',
                  text: 'Back to Jira',
                },
              ],
            },
            {
              type: 'MenuSection',
              nestedGroupKey: 'menu',
              id: 'product/issues:menu',
              parentId: 'product/home:menu',
              alwaysShowScrollHint: true,
              items: [
                {
                  type: 'SectionHeading',
                  text: 'Issues and filters',
                  id: 'issues-and-filters-heading',
                },
                {
                  type: 'InlineComponent',
                  component: LinkItem,
                  id: 'search-issues',
                  text: 'Search issues',
                  to: '/issues',
                },
                { type: 'GroupHeading', id: 'other-heading', text: 'Other' },
                { type: 'Item', text: 'My open issues', id: 'my-open-issues' },
                { type: 'Item', text: 'Reported by me', id: 'reported-by-me' },
                { type: 'Item', text: 'All issues', id: 'all-issues' },
                { type: 'Item', text: 'Open issues', id: 'open-issues' },
                { type: 'Item', text: 'Done issues', id: 'done-issues' },
                {
                  type: 'Item',
                  text: 'Viewed recently',
                  id: 'viewed-recently',
                },
                {
                  type: 'Item',
                  text: 'Created recently',
                  id: 'created-recently',
                },
                {
                  type: 'Item',
                  text: 'Resolved recently',
                  id: 'resolved-recently',
                },
                {
                  type: 'Item',
                  text: 'Updated recently',
                  id: 'updated-recently',
                },
                { type: 'Separator', id: 'separator' },
                {
                  type: 'Item',
                  text: 'View all filters',
                  id: 'view-all-filters',
                },
              ],
            },
          ]),
        1000,
      ),
    ),
};

const projectHomeView = {
  id: 'project/home',
  type: 'container',
  getItems: () => [
    {
      type: 'HeaderSection',
      id: 'project/home:header',
      items: [
        {
          type: 'ContainerHeader',
          before: itemState => (
            <ItemAvatar
              itemState={itemState}
              appearance="square"
              size="large"
            />
          ),
          text: 'My project',
          subText: 'Project description',
          id: 'project-header',
        },
      ],
    },
    {
      type: 'MenuSection',
      nestedGroupKey: 'menu',
      id: 'project/home:menu',
      parentId: null,
      items: [
        {
          type: 'InlineComponent',
          component: LinkItem,
          before: BacklogIcon,
          text: 'Backlog',
          to: '/projects/my-project',
          id: 'backlog',
        },
        {
          type: 'Item',
          before: BoardIcon,
          text: 'Active sprints',
          id: 'active-sprints',
        },
        { type: 'Item', before: GraphLineIcon, text: 'Reports', id: 'reports' },
        { type: 'Separator', id: 'separator' },
        { type: 'Item', before: ShipIcon, text: 'Releases', id: 'releases' },
        {
          type: 'Item',
          before: IssueIcon,
          text: 'Issues and filters',
          id: 'issues-and-filters',
        },
        { type: 'Item', before: PageIcon, text: 'Pages', id: 'pages' },
        {
          type: 'Item',
          before: ComponentIcon,
          text: 'Components',
          id: 'components',
        },
      ],
    },
  ],
};

class DashboardsRouteBase extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props;
    navigationViewController.setView(productHomeView.id);
  }

  render() {
    return (
      <div css={{ padding: 30 }}>
        <h1>Dashboards</h1>
        <h3>Projects:</h3>
        <ul>
          <li>
            <Link to="/projects/my-project">My Project</Link>
          </li>
        </ul>
      </div>
    );
  }
}
const DashboardsRoute = withNavigationViewController(DashboardsRouteBase);

class IssuesAndFiltersRouteBase extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props;
    navigationViewController.setView(productIssuesView.id);
  }

  render() {
    return (
      <div css={{ padding: 30 }}>
        <h1>Issues and filters</h1>
      </div>
    );
  }
}
const IssuesAndFiltersRoute = withNavigationViewController(
  IssuesAndFiltersRouteBase,
);

class ProjectBacklogRouteBase extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props;
    navigationViewController.setView(projectHomeView.id);
  }

  render() {
    return (
      <div css={{ padding: 30 }}>
        <h1>My Project</h1>
        <p>
          <Link to="/">Back to Dashboards</Link>
        </p>
      </div>
    );
  }
}
const ProjectBacklogRoute = withNavigationViewController(
  ProjectBacklogRouteBase,
);

class App extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props;
    navigationViewController.addView(productHomeView);
    navigationViewController.addView(productIssuesView);
    navigationViewController.addView(projectHomeView);
  }

  render() {
    return (
      <LayoutManagerWithViewController globalNavigation={MyGlobalNavigation}>
        <Switch>
          <Route path="/projects/my-project" component={ProjectBacklogRoute} />
          <Route path="/issues" component={IssuesAndFiltersRoute} />
          <Route path="/" component={DashboardsRoute} />
        </Switch>
      </LayoutManagerWithViewController>
    );
  }
}
const AppWithNavigationViewController = withNavigationViewController(App);

export default () => (
  <HashRouter>
    <NavigationProvider>
      <AppWithNavigationViewController />
    </NavigationProvider>
  </HashRouter>
);
