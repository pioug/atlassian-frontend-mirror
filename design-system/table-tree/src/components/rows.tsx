import React, { Component } from 'react';

import Items from './internal/items';

type WithChildren<T> = T & { children?: T[] | null };

export interface RowsProps<T> {
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  items?: WithChildren<T>[];
  render: (args: WithChildren<T>) => React.ReactNode;
}

export default class Rows<T> extends Component<RowsProps<T>> {
  render() {
    const { items, render } = this.props;
    return (
      <div>
        <Items items={items} render={render} />
      </div>
    );
  }
}
