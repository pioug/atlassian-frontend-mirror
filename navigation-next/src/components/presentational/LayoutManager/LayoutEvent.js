import React, { Component } from 'react';

const noop = () => {};

const { Provider, Consumer } = React.createContext({
  emitItemDragStart: noop,
  emitItemDragEnd: noop,
});

export { Consumer as LayoutEventEmitter };

export class LayoutEventListener extends Component {
  emitters;

  static defaultProps = {
    onItemDragStart: noop,
    onItemDragEnd: noop,
  };

  constructor(props) {
    super(props);
    this.emitters = {
      emitItemDragStart: this.emitItemDragStart,
      emitItemDragEnd: this.emitItemDragEnd,
    };
  }

  emitItemDragStart = () => {
    this.props.onItemDragStart();
  };

  emitItemDragEnd = () => {
    this.props.onItemDragEnd();
  };

  render() {
    return <Provider value={this.emitters}>{this.props.children}</Provider>;
  }
}
