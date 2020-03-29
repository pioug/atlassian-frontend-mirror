import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import withContextFromProps from '../../withContextFromProps';

const contextTypes = {
  blockChildGatewayRender: PropTypes.bool,
};

const ContextProvider = withContextFromProps(contextTypes, null);

export default class GatewayRegistry {
  containers = {};

  children = {};

  currentId = 0; // Unique key for children of a gateway

  /**
   *   NOTE: this is where we deviate from cloudflare/react-gateway
   *   https://github.com/cloudflare/react-gateway/blob/master/src/GatewayRegistry.js#L10
   *
   *   Rather than passing children through directly, they're cloned with:
   *   - stackIndex
   *   - stackTotal
   */
  renderContainer(name, addedGateway) {
    if (!this.containers[name] || !this.children[name]) {
      return;
    }

    const childrenKeys = Object.keys(this.children[name]).sort();
    const stackTotal = childrenKeys.length;
    const addedGatewayIndex = childrenKeys.indexOf(addedGateway);

    this.containers[name].setState({
      children: childrenKeys.map((key, i) => {
        const stackIndex = stackTotal - (i + 1);
        const element = cloneElement(this.children[name][key].child, {
          stackIndex,
          stackTotal,
        });
        // Do not re-render nested gateways when a gateway is added to prevent an infinite loop
        // caused by an added gateway triggering a re-render of its parent and then itself.
        const blockChildGatewayRender =
          addedGateway != null && i < addedGatewayIndex;

        return (
          <ContextProvider
            blockChildGatewayRender={blockChildGatewayRender}
            key={key}
          >
            {element}
          </ContextProvider>
        );
      }),
    });
  }

  addContainer(name, container) {
    this.containers[name] = container;
    this.renderContainer(name);
  }

  removeContainer(name) {
    this.containers[name] = null;
  }

  addChild(name, gatewayId, child) {
    this.children[name][gatewayId] = {
      child,
    };
    this.renderContainer(name, gatewayId);
  }

  clearChild(name, gatewayId) {
    delete this.children[name][gatewayId];
  }

  register(name, child) {
    this.children[name] = this.children[name] || {};

    const gatewayId = `${name}_${this.currentId}`;
    this.children[name][gatewayId] = {
      child,
    };
    this.currentId += 1;

    return gatewayId;
  }

  unregister(name, gatewayId) {
    this.clearChild(name, gatewayId);
    this.renderContainer(name);
  }
}
