/* eslint-disable @repo/internal/react/use-primitives */
/** @jsx jsx */

import { Component } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';

import Drawer from '../src';

interface State {
  isDrawerOpen: boolean;
}

export default class DrawersExample extends Component<{}, State> {
  state = {
    isDrawerOpen: true,
  };

  openDrawer = () =>
    this.setState({
      isDrawerOpen: true,
    });

  closeDrawer = () =>
    this.setState({
      isDrawerOpen: false,
    });

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer
          onClose={this.closeDrawer}
          isOpen={this.state.isDrawerOpen}
          width="wide"
        >
          <div id="drawer-contents">
            <p id="paragraph">
              The drawer should not set a new stacking context by using a
              transform CSS property as this causes issues for fixed positioned
              elements such as @atlaskit/dropdown-menu.
            </p>
            {/* The position here is used by the withDropdown integration test. */}
            <div style={{ position: 'fixed', left: 100, top: 200 }}>
              <DropdownMenu
                testId="dropdown"
                trigger={({ triggerRef, ...providedProps }) => (
                  <Button id="trigger" ref={triggerRef} {...providedProps}>
                    Choices
                  </Button>
                )}
              >
                <DropdownItemGroup>
                  <DropdownItem>Sydney</DropdownItem>
                  <DropdownItem>Melbourne</DropdownItem>
                </DropdownItemGroup>
              </DropdownMenu>
            </div>
          </div>
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}
