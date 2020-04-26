import React from 'react';

import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import ShipIcon from '@atlaskit/icon/glyph/ship';

import ViewRegistrar from '../../common/view-registrar';
import { ProjectSwitcherItem } from '../common/project-switcher-item';

const getItems = () => [
  {
    id: 'container/project/index:header',
    items: [ProjectSwitcherItem],
    type: 'HeaderSection',
  },
  {
    id: 'container/project/index:menu',
    nestedGroupKey: 'menu',
    items: [
      {
        before: BacklogIcon,
        id: 'backlog',
        text: 'Backlog',
        to: '/projects/endeavour',
        type: 'LinkItem',
      },
      {
        before: BoardIcon,
        id: 'active-sprints',
        text: 'Active sprints',
        type: 'Item',
      },
      {
        before: GraphLineIcon,
        id: 'reports',
        text: 'Reports',
        type: 'Item',
      },
      {
        before: ShipIcon,
        id: 'releases',
        text: 'Releases',
        type: 'Item',
      },
      {
        before: IssuesIcon,
        goTo: 'container/project/issues',
        id: 'issues',
        text: 'Issues',
        type: 'GoToItem',
      },
      {
        before: IssuesIcon,
        goTo: 'container/project/sortable-issues',
        id: 'sortable-issues',
        text: 'Sortable Issues',
        type: 'GoToItem',
      },
    ],
    type: 'MenuSection',
  },
];

const HomeView = () => (
  <ViewRegistrar
    getItemsFactory={() => getItems}
    type="container"
    viewId="container/project/index"
  />
);

export default HomeView;
