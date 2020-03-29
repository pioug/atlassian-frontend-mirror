/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { Transition } from 'react-transition-group';

import NestedNavigationPage from '../../styled/NestedNavigationPage';
import NestedNavigationWrapper from '../../styled/NestedNavigationWrapper';

export default class ContainerNavigationNested extends PureComponent {
  state = {
    stack: this.props.stack,
    traversalDirection: 'down',
  };

  UNSAFE_componentWillReceiveProps({ stack }) {
    const traversalDirection = (() => {
      if (stack.length !== this.props.stack.length) {
        return stack.length < this.props.stack.length ? 'up' : 'down';
      }
      return this.state.traversalDirection;
    })();

    this.setState({ traversalDirection }, () => {
      this.setState({ stack });
    });
  }

  handleAnimationEnd = () => {
    if (this.props.onAnimationEnd) {
      this.props.onAnimationEnd({
        traversalDirection: this.state.traversalDirection,
      });
    }
  };

  renderChildren = () => (
    <Transition
      addEndListener={(node, done) => {
        node.addEventListener('animationend', done);
      }}
      key={this.state.stack.length}
      onExited={this.handleAnimationEnd}
    >
      {transitionState => (
        <NestedNavigationPage
          transitionState={transitionState}
          traversalDirection={this.state.traversalDirection}
        >
          {this.state.stack[this.state.stack.length - 1]}
        </NestedNavigationPage>
      )}
    </Transition>
  );

  render() {
    return (
      <NestedNavigationWrapper
        component="div"
        traversalDirection={this.state.traversalDirection}
      >
        {this.renderChildren()}
      </NestedNavigationWrapper>
    );
  }
}
