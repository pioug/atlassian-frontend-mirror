import React, { Component } from 'react';

import Lorem from 'react-lorem-component';

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

const Item = ({ testKey, ...props }) => <ItemComponent {...props} />;

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
  <div>
    <GlobalNav
      primaryItems={globalNavPrimaryItems}
      secondaryItems={globalNavSecondaryItems}
    />
  </div>
);
/**
 * Content navigation
 */
const ProductNavigation = () => (
  <div>
    <HeaderSection>
      {({ className }) => (
        <div className={className}>
          <Wordmark wordmark={JiraWordmark} />
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
    isBannerVisible: true,
    bannerHeight: 52,
  };

  toggleContainerNav = () => {
    this.setState((state) => ({
      shouldDisplayContainerNav: !state.shouldDisplayContainerNav,
    }));
  };

  ContainerNavigation = () => (
    <div>
      <HeaderSection>
        {({ css }) => (
          <div
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
          </div>
        )}
      </MenuSection>
    </div>
  );

  toggleBanner = () => {
    this.setState((state) => ({
      isBannerVisible: !state.isBannerVisible,
    }));
  };

  render() {
    const {
      bannerHeight,
      isBannerVisible,
      shouldDisplayContainerNav,
    } = this.state;
    return (
      <>
        {isBannerVisible && (
          <div
            css={{
              height: `${bannerHeight}px`,
              boxSizing: 'border-box',
              backgroundColor: 'salmon',
              zIndex: 1,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            HTML banner
          </div>
        )}
        <NavigationProvider>
          <LayoutManager
            globalNavigation={GlobalNavigation}
            productNavigation={ProductNavigation}
            containerNavigation={
              shouldDisplayContainerNav ? this.ContainerNavigation : null
            }
            topOffset={isBannerVisible ? bannerHeight : 0}
          >
            <div style={{ padding: `${gridSize * 4}px ${gridSize * 5}px` }}>
              <Toggle
                isChecked={shouldDisplayContainerNav}
                onChange={this.toggleContainerNav}
              />{' '}
              Display container navigation layer
              <div>
                <Toggle
                  isChecked={isBannerVisible}
                  onChange={this.toggleBanner}
                />{' '}
                Show Banner
              </div>
              <Lorem count={45} />
            </div>
          </LayoutManager>
        </NavigationProvider>
      </>
    );
  }
}
