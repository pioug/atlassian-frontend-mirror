import React, { Component } from 'react';

import styled from 'styled-components';

import Banner from '@atlaskit/banner';
import Button from '@atlaskit/button/standard-button';
import RoomMenuIcon from '@atlaskit/icon/glyph/room-menu';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Navigation from '@atlaskit/navigation';

import MobileHeader from '../src';

const BANNER_HEIGHT = 52;

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

export default class BannerMobileHeaderDemo extends Component<{}, State> {
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
      <div>
        <Banner
          isOpen
          icon={<WarningIcon label="Warning icon" secondaryColor="inherit" />}
        >
          This is a warning banner
        </Banner>
        <MobileHeader
          drawerState={this.state.drawerState}
          menuIconLabel="Menu"
          navigation={(isOpen) => isOpen && <Navigation onResize={() => {}} />}
          secondaryContent={
            <Button
              iconBefore={<RoomMenuIcon label="Show sidebar" />}
              onClick={this.sidebarOpened}
            />
          }
          sidebar={(isOpen) =>
            isOpen && <FakeSideBar>Sidebar goes here...</FakeSideBar>
          }
          pageHeading="Page heading"
          onNavigationOpen={this.navOpened}
          onDrawerClose={this.drawerClosed}
          topOffset={BANNER_HEIGHT}
        />
      </div>
    );
  }
}
