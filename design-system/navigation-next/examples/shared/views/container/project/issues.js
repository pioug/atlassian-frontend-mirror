import React from 'react';

import ViewRegistrar from '../../common/view-registrar';
import { ProjectSwitcherItem } from '../common/project-switcher-item';

const getItems = () => [
  {
    id: 'container/project/issues:header',
    items: [
      ProjectSwitcherItem,
      {
        id: 'back-button',
        items: [
          {
            type: 'BackItem',
            goTo: 'container/project/index',
            id: 'back',
            text: 'Back to project',
          },
        ],
        type: 'Group',
      },
    ],
    type: 'HeaderSection',
  },
  {
    id: 'container/project/issues:menu',
    nestedGroupKey: 'menu',
    parentId: 'container/project/index:menu',
    items: [
      {
        type: 'SectionHeading',
        id: 'section-heading',
        text: 'Issues and filters',
      },
      { type: 'Item', id: 'search-issues', text: 'Search issues' },
      { type: 'GroupHeading', id: 'heading', text: 'Filters' },
      { type: 'Item', id: 'my-open-issues', text: 'My open issues' },
      { type: 'Item', id: 'reported-by-me', text: 'Reported by me' },
      { type: 'Item', id: 'all-issues', text: 'All issues' },
      { type: 'Item', id: 'open-issues', text: 'Open issues' },
      { type: 'Item', id: 'done-issues', text: 'Done issues' },
      { type: 'Item', id: 'viewed-recently', text: 'Viewed recently' },
      { type: 'Item', id: 'created-recently', text: 'Created recently' },
      { type: 'Item', id: 'resolved-recently', text: 'Resolved recently' },
      { type: 'Item', id: 'updated-recently', text: 'Updated recently' },
    ],
    alwaysShowScrollHint: true,
    type: 'MenuSection',
  },
];

const HomeView = () => (
  <ViewRegistrar
    getItemsFactory={() => getItems}
    type="container"
    viewId="container/project/issues"
  />
);

export default HomeView;
