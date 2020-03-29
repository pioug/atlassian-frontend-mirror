import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { shouldReportItemHeight } from './shared-variables';

export default class OverflowHeightReportEnabler extends Component {
  static childContextTypes = {
    [shouldReportItemHeight]: PropTypes.bool,
  };

  getChildContext() {
    return {
      [shouldReportItemHeight]: true,
    };
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
