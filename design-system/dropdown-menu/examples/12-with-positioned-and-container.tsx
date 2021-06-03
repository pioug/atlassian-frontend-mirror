import React, { Component } from 'react';

import styled from 'styled-components';

import {
  DropdownItemGroupRadio,
  DropdownItemRadio,
  DropdownMenuStateless,
} from '../src';

interface State {
  isDropdownOpen: boolean;
}

const ReallyBigDiv = styled.div`
  height: 400px;
  width: 400px;
  border: 2px dotted blue;
`;

export default class StatelessMenuExample extends Component<{}, State> {
  state = { isDropdownOpen: false };

  render() {
    return (
      <div>
        <ReallyBigDiv />
        <DropdownMenuStateless
          isOpen={this.state.isDropdownOpen}
          onOpenChange={(attrs) => {
            this.setState({ isDropdownOpen: attrs.isOpen });
          }}
          trigger="Filter cities"
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
