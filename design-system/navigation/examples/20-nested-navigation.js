import React, { Component } from 'react';

import Navigation, {
  AkNavigationItem,
  AkContainerNavigationNested,
} from '../src';

export default class NavigationPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stack: [
        [
          {
            title: 'Foo',
            children: [
              {
                title: 'bar',
              },
            ],
          },
        ],
      ],
    };
  }

  stackPush = item => {
    const stack = [...this.state.stack, item];
    this.setState({ stack });
  };

  stackPop = () => {
    if (this.state.stack.length > 1) {
      const stack = this.state.stack.slice(0, this.state.stack.length - 1);
      this.setState({ stack });
    }
  };

  renderBackButton() {
    return <AkNavigationItem onClick={this.stackPop} text="Back" key="Back" />;
  }

  renderHeader = () => {
    const items = [];

    if (this.state.stack.length > 1) {
      items.push(this.renderBackButton());
    }

    return items;
  };

  renderItem = item => {
    const onClick = item.children && (() => this.stackPush(item.children));

    return (
      <AkNavigationItem text={item.title} onClick={onClick} key={item.title} />
    );
  };

  renderStack = () =>
    this.state.stack.map(page => page.map(item => this.renderItem(item)));

  render() {
    return (
      <Navigation containerHeaderComponent={this.renderHeader}>
        <AkContainerNavigationNested
          stack={this.renderStack()}
          onAnimationEnd={(...args) => console.log('animation end', args)}
        />
      </Navigation>
    );
  }
}
