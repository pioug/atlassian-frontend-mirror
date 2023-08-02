/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import Item from './item';
import LoaderItem from './loader-item';

interface ItemsProps<Item = any> {
  parentData?: any;
  depth: number;
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  items?: Item[];
  render: (arg: Item) => React.ReactNode;
}

interface State {
  isLoaderShown: boolean;
}

export default class Items<Item> extends Component<ItemsProps<Item>, State> {
  static defaultProps = {
    depth: 0,
  };

  state: State = {
    isLoaderShown: false,
  };

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (!nextProps.items && !prevState.isLoaderShown) {
      return {
        isLoaderShown: true,
      };
    }
    return null;
  }

  handleLoaderComplete = () => {
    this.setState({
      isLoaderShown: false,
    });
  };

  renderLoader() {
    const { depth, items } = this.props;
    return (
      <LoaderItem
        isCompleting={!!(items && items.length)}
        onComplete={this.handleLoaderComplete}
        depth={depth + 1}
      />
    );
  }

  renderItems() {
    const { render, items, depth = 0 } = this.props;
    return (
      items &&
      items.map((itemData, index) => (
        <Item
          data={itemData}
          depth={depth + 1}
          key={(itemData && (itemData as any).id) || index}
          render={render}
        />
      ))
    );
  }

  render() {
    const { isLoaderShown } = this.state;
    const busyAttrs = isLoaderShown
      ? ({ 'aria-busy': true, 'aria-live': 'polite' } as const)
      : {};
    return (
      <div {...busyAttrs}>
        {isLoaderShown ? this.renderLoader() : this.renderItems()}
      </div>
    );
  }
}
