/* eslint-disable react/prop-types */
import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import GatewayRegistry from './GatewayRegistry';

export default class GatewayDest extends Component {
  gatewayRegistry;

  static contextTypes = {
    gatewayRegistry: PropTypes.instanceOf(GatewayRegistry).isRequired,
  };

  static defaultProps = {
    component: 'div',
  };

  state = {
    children: null,
  };

  constructor(props, context) {
    super(props, context);
    this.gatewayRegistry = context.gatewayRegistry;
  }

  UNSAFE_componentWillMount() {
    this.gatewayRegistry.addContainer(this.props.name, this);
  }

  componentWillUnmount() {
    this.gatewayRegistry.removeContainer(this.props.name);
  }

  render() {
    const { component, ...attrs } = this.props;
    delete attrs.name;

    return createElement(component, attrs, this.state.children);
  }
}
