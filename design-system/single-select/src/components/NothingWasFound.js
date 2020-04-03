import React, { PureComponent } from 'react';

import NothingWasFoundElement from '../styled/NothingWasFound';

export default class NothingWasFound extends PureComponent {
  render() {
    return (
      <NothingWasFoundElement>
        {/* eslint-disable-next-line react/prop-types */}
        {this.props.noMatchesFound}
      </NothingWasFoundElement>
    );
  }
}
