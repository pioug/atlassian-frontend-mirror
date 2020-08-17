import React, { PureComponent } from 'react';

export default class Caption extends PureComponent {
  render() {
    return <div>{this.props.children}</div>;
  }
}
