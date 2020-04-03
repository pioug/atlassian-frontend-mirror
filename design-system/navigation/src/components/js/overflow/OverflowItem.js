/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {
  overflowGroupNamespace,
  shouldReportItemHeight,
} from './shared-variables';

export default class OverflowItem extends Component {
  static contextTypes = {
    [overflowGroupNamespace]: PropTypes.object,
    [shouldReportItemHeight]: PropTypes.bool,
  };

  measureHeight = ref => {
    if (ref) {
      this.context[overflowGroupNamespace].reportItemHeightToGroup(
        this.props.overflowItemIndex,
        ref.clientHeight,
      );
    }
  };

  render() {
    if (
      !this.context[overflowGroupNamespace].shouldRenderItem(
        this.props.overflowItemIndex,
      )
    ) {
      return null;
    }

    if (this.context[shouldReportItemHeight]) {
      return <div ref={this.measureHeight}>{this.props.children}</div>;
    }

    return this.props.children;
  }
}
