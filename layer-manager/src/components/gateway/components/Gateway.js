/* eslint-disable react/prop-types */
import { Component } from 'react';
import PropTypes from 'prop-types';
import GatewayRegistry from './GatewayRegistry';

export default class Gateway extends Component {
  gatewayRegistry;

  id = '';

  static contextTypes = {
    gatewayRegistry: PropTypes.instanceOf(GatewayRegistry).isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.gatewayRegistry = context.gatewayRegistry;
  }

  UNSAFE_componentWillMount() {
    this.id = this.gatewayRegistry.register(
      this.props.into,
      this.props.children,
    );
    this.renderIntoGatewayNode(this.props);
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (!props.shouldBlockRender) {
      this.gatewayRegistry.clearChild(this.props.into, this.id);
      this.renderIntoGatewayNode(props);
    }
  }

  componentWillUnmount() {
    this.gatewayRegistry.unregister(this.props.into, this.id);
  }

  renderIntoGatewayNode(props) {
    this.gatewayRegistry.addChild(this.props.into, this.id, props.children);
  }

  render() {
    return null;
  }
}
