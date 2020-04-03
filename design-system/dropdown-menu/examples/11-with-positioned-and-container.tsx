import React, { Component } from 'react';
import styled from 'styled-components';
import {
  DropdownMenuStateless,
  DropdownItemGroupRadio,
  DropdownItemRadio,
} from '../src';

interface State {
  isDropdownOpen: boolean;
}

const ReallyBigDiv = styled.div`
  height: 800px;
  width: 400px;
  background-color: blue;
`;

export default class StatelessMenuExample extends Component<{}, State> {
  state = { isDropdownOpen: false };

  render() {
    return (
      <div>
        <ReallyBigDiv />
        <DropdownMenuStateless
          isOpen={this.state.isDropdownOpen}
          onOpenChange={attrs => {
            this.setState({ isDropdownOpen: attrs.isOpen });
          }}
          trigger="Choose"
          triggerType="button"
          isMenuFixed
        >
          <DropdownItemGroupRadio id="cities">
            <DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
            <DropdownItemRadio id="melbourne">Melbourne</DropdownItemRadio>
          </DropdownItemGroupRadio>
        </DropdownMenuStateless>
      </div>
    );
  }
}
