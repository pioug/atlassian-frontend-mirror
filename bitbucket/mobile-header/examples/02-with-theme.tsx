import React, { Component } from 'react';

import styled from 'styled-components';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import RoomMenuIcon from '@atlaskit/icon/glyph/room-menu';
import Navigation from '@atlaskit/navigation';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { AtlaskitThemeProvider } from '@atlaskit/theme';

import MobileHeader from '../src';

const FakeSideBar = styled.div`
  background-color: white;
  height: 100vh;
  padding-top: 32px;
  text-align: center;
  width: 264px;
`;

interface State {
  drawerState: 'navigation' | 'sidebar' | 'none' | string;
}

class MobileHeaderDemo extends Component<{}, State> {
  state = {
    drawerState: 'none',
  };

  navOpened = () => {
    this.setState({ drawerState: 'navigation' });
  };

  sidebarOpened = () => {
    this.setState({ drawerState: 'sidebar' });
  };

  drawerClosed = () => {
    this.setState({ drawerState: 'none' });
  };

  render() {
    return (
      <MobileHeader
        drawerState={this.state.drawerState}
        menuIconLabel="Menu"
        navigation={isOpen => isOpen && <Navigation onResize={() => {}} />}
        secondaryContent={
          <ButtonGroup>
            <Button>One</Button>
            <Button
              iconBefore={<RoomMenuIcon label="Show sidebar" />}
              onClick={this.sidebarOpened}
            />
          </ButtonGroup>
        }
        sidebar={isOpen =>
          isOpen && <FakeSideBar>Sidebar goes here...</FakeSideBar>
        }
        pageHeading="Page heading"
        onNavigationOpen={this.navOpened}
        onDrawerClose={this.drawerClosed}
      />
    );
  }
}

export default function Example() {
  return (
    <AtlaskitThemeProvider mode="dark">
      <MobileHeaderDemo />
    </AtlaskitThemeProvider>
  );
}
