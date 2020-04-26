import React from 'react';

import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import { JiraWordmark as JiraWordmarkLogo } from '@atlaskit/logo';

import { LinkItem } from '../../components';
import ViewRegistrar from '../common/view-registrar';

const getItems = () => [
  {
    id: 'root/index:header',
    items: [
      { type: 'Wordmark', wordmark: JiraWordmarkLogo, id: 'jira-wordmark' },
    ],
    type: 'HeaderSection',
  },
  {
    id: 'root/index:menu',
    items: [
      {
        // Inline component
        type: 'InlineComponent',
        component: LinkItem,
        id: 'dashboards',
        text: 'Dashboards',
        before: DashboardIcon,
        to: '/',
      },
      {
        // Custom component
        type: 'LinkItem',
        id: 'projects',
        text: 'Projects',
        before: FolderIcon,
        to: '/projects',
      },
      {
        before: IssuesIcon,
        goTo: 'root/issues',
        id: 'issues',
        text: 'Issues',
        type: 'GoToItem',
      },
      {
        before: IssuesIcon,
        goTo: 'root/sortable-issues',
        id: 'sortable-issues',
        text: 'Sortable Issues',
        type: 'GoToItem',
      },
    ],
    nestedGroupKey: 'menu',
    parentId: null,
    type: 'MenuSection',
  },
];

const HomeView = () => (
  <ViewRegistrar
    getItemsFactory={() => getItems}
    type="product"
    viewId="root/index"
  />
);

export default HomeView;
