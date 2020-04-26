import React, { Component } from 'react';

import {
  DropdownItemGroupRadio,
  DropdownItemRadio,
  DropdownMenuStateless,
} from '../src';
import { OnOpenChangeArgs } from '../src/types';

interface State {
  isDropdownOpen: boolean;
}

export default class StatelessMenuExample extends Component<{}, State> {
  state = { isDropdownOpen: false };

  render() {
    return (
      <div>
        <DropdownMenuStateless
          isOpen={this.state.isDropdownOpen}
          onOpenChange={(attrs: OnOpenChangeArgs) => {
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
