import React, { Component } from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import IssueIcon from '@atlaskit/icon/glyph/issue';
import PortfolioIcon from '@atlaskit/icon/glyph/portfolio';
import { JiraIcon, JiraWordmark } from '@atlaskit/logo';
import {
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
          type: 'Item',
          id: 'dashboards',
          before: DashboardIcon,
          text: 'Dashboards',
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
  getItems: () => [
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
        { type: 'Item', text: 'Search issues', id: 'search-issues' },
        { type: 'GroupHeading', id: 'other-heading', text: 'Other' },
        { type: 'Item', text: 'My open issues', id: 'my-open-issues' },
        { type: 'Item', text: 'Reported by me', id: 'reported-by-me' },
        { type: 'Item', text: 'All issues', id: 'all-issues' },
        { type: 'Item', text: 'Open issues', id: 'open-issues' },
        { type: 'Item', text: 'Done issues', id: 'done-issues' },
        { type: 'Item', text: 'Viewed recently', id: 'viewed-recently' },
        { type: 'Item', text: 'Created recently', id: 'created-recently' },
        { type: 'Item', text: 'Resolved recently', id: 'resolved-recently' },
        { type: 'Item', text: 'Updated recently', id: 'updated-recently' },
        { type: 'Separator', id: 'separator' },
        { type: 'Item', text: 'View all filters', id: 'view-all-filters' },
      ],
    },
  ],
};

class App extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props;
    navigationViewController.addView(productHomeView);
    navigationViewController.addView(productIssuesView);
    navigationViewController.setView(productHomeView.id);
  }

  render() {
    return (
      <LayoutManagerWithViewController globalNavigation={MyGlobalNavigation}>
        <div css={{ padding: 30 }}>Page content goes here.</div>
      </LayoutManagerWithViewController>
    );
  }
}
const AppWithNavigationViewController = withNavigationViewController(App);

export default () => (
  <NavigationProvider>
    <AppWithNavigationViewController />
  </NavigationProvider>
);
