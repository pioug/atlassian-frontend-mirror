/*
  NOTE
  ----------------------------------------------------------------------------
  This is the source file for the webdriver test. If you make changes here,
  please update the tests to reflect those changes:

  `packages/design-system/navigation-next/src/__tests__/integration/navigation.js`
*/

import React, { Component } from 'react';

import Avatar from '@atlaskit/avatar';
import AddIcon from '@atlaskit/icon/glyph/add';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import SearchIcon from '@atlaskit/icon/glyph/search';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import InlineDialog from '@atlaskit/inline-dialog';
import { JiraIcon, JiraWordmark } from '@atlaskit/logo';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { gridSize as gridSizeFn } from '@atlaskit/theme';
import Toggle from '@atlaskit/toggle';

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
  Wordmark,
} from '../src';

const gridSize = gridSizeFn();

const Item = ({ testKey, ...props }) => {
  const item = <ItemComponent {...props} />;
  return testKey ? <div data-webdriver-test-key={testKey}>{item}</div> : item;
};

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

const TestMark = ({ id, children }) => (
  <div data-webdriver-test-key={id}>{children}</div>
);

/**
 * Content navigation
 */
const ProductNavigation = () => (
  <div data-webdriver-test-key="product-navigation">
    <HeaderSection>
      {({ className }) => (
        <div className={className}>
          <TestMark id="product-header">
            <Wordmark wordmark={JiraWordmark} />
          </TestMark>
        </div>
      )}
    </HeaderSection>
    <MenuSection>
      {({ className }) => (
        <div className={className}>
          <Item
            before={DashboardIcon}
            text="Dashboards"
            testKey="product-item-dashboards"
          />
          <Item
            before={FolderIcon}
            text="Projects"
            testKey="product-item-projects"
          />
          <Item
            before={IssuesIcon}
            text="Issues"
            testKey="product-item-issues"
          />
        </div>
      )}
    </MenuSection>
  </div>
);

export default class Example extends Component {
  state = {
    shouldDisplayContainerNav: true,
    dialogOpen: false,
  };

  toggleContainerNav = () => {
    this.setState((state) => ({
      shouldDisplayContainerNav: !state.shouldDisplayContainerNav,
    }));
  };

  ContainerNavigation = () => (
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
            <ContainerHeader
              before={(itemState) => (
                <ItemAvatar
                  itemState={itemState}
                  appearance="square"
                  size="large"
                />
              )}
              text="My software project"
              subText="Software project"
            />
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
            <InlineDialog
              onClose={() => {
                this.setState({ dialogOpen: false });
              }}
              content={<div>Renders correctly without getting chopped off</div>}
              isOpen={this.state.dialogOpen}
              placement="right"
            >
              <Item
                onClick={() => {
                  this.setState({ dialogOpen: true });
                }}
                before={GraphLineIcon}
                text="Item with InlineDialog"
                testKey="container-item-click"
              />
            </InlineDialog>
          </div>
        )}
      </MenuSection>
    </div>
  );

  render() {
    const { shouldDisplayContainerNav } = this.state;
    return (
      <NavigationProvider>
        <LayoutManager
          globalNavigation={GlobalNavigation}
          productNavigation={ProductNavigation}
          containerNavigation={
            shouldDisplayContainerNav ? this.ContainerNavigation : null
          }
        >
          <div
            data-webdriver-test-key="content"
            style={{ padding: `${gridSize * 4}px ${gridSize * 5}px` }}
          >
            <Toggle
              isChecked={shouldDisplayContainerNav}
              onChange={this.toggleContainerNav}
            />{' '}
            Display container navigation layer
          </div>
        </LayoutManager>
      </NavigationProvider>
    );
  }
}
