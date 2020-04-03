import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GatewayRegistry from './GatewayRegistry';

export default class GatewayProvider extends Component {
  gatewayRegistry;

  static childContextTypes = {
    gatewayRegistry: PropTypes.instanceOf(GatewayRegistry).isRequired,
  };

  static defaultProps = {
    component: 'div',
  };

  constructor(props, context) {
    super(props, context);
    this.gatewayRegistry = new GatewayRegistry();
  }

  getChildContext() {
    return {
      gatewayRegistry: this.gatewayRegistry,
    };
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { children, component: Tag } = this.props;

    return <Tag>{children}</Tag>;
  }
}
