import React, { Component } from 'react';

import styled from 'styled-components';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import DetailViewIcon from '@atlaskit/icon/glyph/detail-view';
import Navigation from '@atlaskit/navigation';

import MobileHeader from '../src';

const FakeSideBar = styled.div`
  background-color: white;
  height: 100vh;
  padding-top: 32px;
  text-align: center;
  width: 264px;
`;

interface State {
  drawerState: 'none' | 'navigation' | 'sidebar' | string;
  isOpen: boolean;
}

class MobileHeaderDemo extends Component<{}, State> {
  state = {
    drawerState: 'none',
    isOpen: false,
  };

  navOpened = () => {
    this.setState({ drawerState: 'navigation', isOpen: true });
  };

  sidebarOpened = () => {
    this.setState({ drawerState: 'sidebar', isOpen: true });
  };

  drawerClosed = () => {
    this.setState({ drawerState: 'none', isOpen: false });
  };

  render() {
    const isHeaderOpen = this.state.isOpen;
    return (
      <div>
        <Button onClick={this.sidebarOpened}>Open Mobile Header</Button>
        {isHeaderOpen && (
          <MobileHeader
            drawerState={this.state.drawerState}
            menuIconLabel="Menu"
            navigation={(isOpen) =>
              isOpen && <Navigation onResize={() => {}} />
            }
            secondaryContent={
              <ButtonGroup>
                <Button>One</Button>
                <Button
                  iconBefore={<DetailViewIcon label="Show sidebar" />}
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
        )}
      </div>
    );
  }
}

export default function Example() {
  return <MobileHeaderDemo />;
}
