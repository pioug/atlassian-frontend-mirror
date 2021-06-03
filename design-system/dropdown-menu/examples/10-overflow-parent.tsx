import React, { Component } from 'react';

import styled from 'styled-components';

import Button from '@atlaskit/button/standard-button';
import { N20 } from '@atlaskit/theme/colors';

import { DropdownItem, DropdownItemGroup, DropdownMenuStateless } from '../src';

const windowScroll = 1000;

const Description = styled.p`
  margin-bottom: 8px;
`;

const OverflowParentHidden = styled.div`
  display: flex;
  position: relative;
  padding: 20px;
  overflow: hidden;
  background-color: ${N20};
`;

const ButtonSpacer = styled.div`
  margin-left: 20px;
`;

type State = { isMenuFixed: boolean; isMenuOpen: boolean };

export default class OverflowParentExample extends Component<{}, State> {
  state = {
    isMenuFixed: false,
    isMenuOpen: false,
  };

  ref?: HTMLElement;

  toggleMenuPosition = () => {
    this.setState((state) => ({ isMenuFixed: !state.isMenuFixed }));
    this.toggleMenuOpen();
  };

  toggleMenuOpen = () => {
    this.setState((state) => ({ isMenuOpen: !state.isMenuOpen }));
  };

  renderDropdown() {
    const { isMenuFixed, isMenuOpen } = this.state;

    return (
      <DropdownMenuStateless
        triggerType="button"
        trigger="Page action"
        isMenuFixed={isMenuFixed}
        isOpen={isMenuOpen}
        onOpenChange={this.toggleMenuOpen}
      >
        <DropdownItemGroup>
          <DropdownItem>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenuStateless>
    );
  }

  componentDidMount() {
    window.scrollTo(0, windowScroll);
  }

  render() {
    const { isMenuFixed } = this.state;

    return (
      <div style={{ height: 2000, paddingTop: windowScroll }}>
        <Description>
          The grey box below is the containing block of the dropdown with an
          overflow.
          <br />
          {`The list ${
            isMenuFixed ? 'will' : 'will not'
          } be visible outside of it when open.`}
          <br />
          Note that the menu will detach itself from the trigger during scroll
          when setting isMenuFixed so you will need to handle that case by
          blocking scroll or similar.
        </Description>
        <OverflowParentHidden>
          {this.renderDropdown()}
          <ButtonSpacer>
            <Button onClick={this.toggleMenuPosition}>
              {`isMenuFixed: ${String(isMenuFixed)}`}
            </Button>
          </ButtonSpacer>
        </OverflowParentHidden>
      </div>
    );
  }
}
