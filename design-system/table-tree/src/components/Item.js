import React, { Component } from 'react';

import toItemId from '../utils/toItemId';

import Items from './Items';

export default class Item extends Component {
  static defaultProps = {
    depth: 0,
  };

  render() {
    // eslint-disable-next-line react/prop-types
    const { depth, data, render } = this.props;

    const renderedRow = render(data);
    if (!renderedRow) {
      return null;
    }
    const { itemId, items } = renderedRow.props;
    return React.cloneElement(renderedRow, {
      depth,
      data,
      renderChildren: () => (
        <div id={toItemId(itemId)}>
          <Items
            parentData={data}
            depth={depth}
            items={items}
            render={render}
          />
        </div>
      ),
    });
  }
}
