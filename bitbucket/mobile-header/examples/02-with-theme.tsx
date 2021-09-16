import React, { Component } from 'react';

import styled, {
  ThemeProvider as StyledThemeProvider,
} from 'styled-components';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import RoomMenuIcon from '@atlaskit/icon/glyph/room-menu';
import Navigation from '@atlaskit/navigation';
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';

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
        navigation={(isOpen) => isOpen && <Navigation onResize={() => {}} />}
        secondaryContent={
          <ButtonGroup>
            <Button>One</Button>
            <Button
              iconBefore={<RoomMenuIcon label="Show sidebar" />}
              onClick={this.sidebarOpened}
            />
          </ButtonGroup>
        }
        sidebar={(isOpen) =>
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
    <DeprecatedThemeProvider mode="dark" provider={StyledThemeProvider}>
      <MobileHeaderDemo />
    </DeprecatedThemeProvider>
  );
}
