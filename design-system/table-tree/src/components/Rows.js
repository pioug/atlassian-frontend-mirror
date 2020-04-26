import React, { Component } from 'react';

import Items from './Items';

export default class Rows extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const { items, render } = this.props;
    return (
      <div>
        <Items items={items} render={render} />
      </div>
    );
  }
}
