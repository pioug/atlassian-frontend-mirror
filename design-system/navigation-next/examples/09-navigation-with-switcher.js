/*
  NOTE
  ----------------------------------------------------------------------------
  This is the source file for the webdriver test. If you make changes here,
  please update the tests to reflect those changes:

  `packages/design-system/navigation-next/src/__tests__/integration/navigation.js`
*/

import React from 'react';

import Avatar from '@atlaskit/avatar';
import AddIcon from '@atlaskit/icon/glyph/add';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import ChevD from '@atlaskit/icon/glyph/chevron-down';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import SearchIcon from '@atlaskit/icon/glyph/search';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { JiraIcon } from '@atlaskit/logo';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import {
  ContainerHeader,
  GlobalNav,
  GroupHeading,
  HeaderSection,
  ItemAvatar,
  Item as ItemComponent,
  LayoutManager,
  MenuSection,
  NavigationProvider,
  Separator,
  Switcher,
} from '../src';

const gridSize = gridSizeFn();

const Item = ({ testKey, ...props }) => {
  const item = <ItemComponent {...props} />;
  return testKey ? <div data-webdriver-test-key={testKey}>{item}</div> : item;
};

const projects = [
  {
    label: 'Recent Projects',
    options: [
      {
        avatar: 'endeavour',
        id: 'endeavour',
        pathname: '/projects/endeavour',
        text: 'Endeavour',
        subText: 'Software project',
      },
      {
        avatar: 'design-system-support',
        id: 'design-system-support',
        pathname: '/projects/design-system-support',
        text: 'Design System Support',
        subText: 'Service desk project',
      },
    ],
  },
  {
    label: 'Other Projects',
    options: [
      {
        avatar: 'design-platform',
        id: 'design-platform',
        pathname: '/projects/design-platform',
        text: 'Design Platform',
        subText: 'Software project',
      },
      {
        avatar: 'donut-world',
        id: 'donut-world',
        pathname: '/projects/donut-world',
        text: 'Donut World',
        subText: 'Software project',
      },
      {
        avatar: 'kitkat',
        id: 'kitkat',
        pathname: '/projects/kitkat',
        text: 'KitKat',
        subText: 'Software project',
      },
      {
        avatar: 'tangerine',
        id: 'tangerine',
        pathname: '/projects/tangerine',
        text: 'Tangerine',
        subText: 'Software project',
      },
    ],
  },
];

class MySwitcher extends React.Component {
  state = { selected: projects[0].options[0] };

  create = () => ({
    onClick: () => {
      // eslint-disable-next-line
      const boardName = window.prompt(
        'What would you like to call your new board?',
      );
      if (boardName && boardName.length) {
        // eslint-disable-next-line
        console.log(`You created the board "${boardName}"`);
      }
    },
    text: 'Create board',
  });

  target = ({ id, subText, text }) => {
    const avatar = (s) => (
      <ItemAvatar
        appearance="square"
        href={null}
        isInteractive={false}
        itemState={s}
        onClick={null}
      />
    );

    return (
      <ContainerHeader
        before={avatar}
        after={ChevD}
        id={id}
        subText={subText}
        text={text}
      />
    );
  };

  onChange = (selected) => {
    this.setState({ selected });
  };

  render() {
    const { selected } = this.state;
    return (
      <Switcher
        create={this.create()}
        onChange={this.onChange}
        options={projects}
        target={this.target(selected)}
        value={selected}
      />
    );
  }
}
/**
 * Global navigation
 */
const globalNavPrimaryItems = [
  {
    id: 'jira',
    icon: () => <JiraIcon size="medium" label="Jira" />,
    label: 'Jira',
  },
  { id: 'search', icon: SearchIcon, label: 'Search' },
  { id: 'create', icon: AddIcon, label: 'Add' },
];

const globalNavSecondaryItems = [
  {
    id: '10-composed-navigation',
    icon: QuestionCircleIcon,
    label: 'Help',
    size: 'small',
  },
  {
    id: '10-composed-navigation-2',
    icon: () => <Avatar borderColor="transparent" size="small" />,
    label: 'Profile',
    size: 'small',
  },
];

const GlobalNavigation = () => (
  <div data-webdriver-test-key="global-navigation">
    <GlobalNav
      primaryItems={globalNavPrimaryItems}
      secondaryItems={globalNavSecondaryItems}
    />
  </div>
);

const ContainerNavigation = () => (
  <div data-webdriver-test-key="container-navigation">
    <HeaderSection>
      {({ css }) => (
        <div
          data-webdriver-test-key="container-header"
          css={{
            ...css,
            paddingBottom: gridSize * 2.5,
          }}
        >
          <MySwitcher />
        </div>
      )}
    </HeaderSection>
    <MenuSection>
      {({ className }) => (
        <div className={className}>
          <Item
            before={BacklogIcon}
            text="Backlog"
            isSelected
            testKey="container-item-backlog"
          />
          <Item
            before={BoardIcon}
            text="Active sprints"
            testKey="container-item-sprints"
          />
          <Item
            before={GraphLineIcon}
            text="Reports"
            testKey="container-item-reports"
          />
          <Separator />
          <GroupHeading>Shortcuts</GroupHeading>
          <Item before={ShortcutIcon} text="Project space" />
          <Item before={ShortcutIcon} text="Project repo" />
        </div>
      )}
    </MenuSection>
  </div>
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={GlobalNavigation}
      containerNavigation={ContainerNavigation}
      productNavigation={() => null}
    >
      <div
        data-webdriver-test-key="content"
        style={{ padding: `${gridSize * 4}px ${gridSize * 5}px` }}
      >
        Page content
      </div>
    </LayoutManager>
  </NavigationProvider>
);
