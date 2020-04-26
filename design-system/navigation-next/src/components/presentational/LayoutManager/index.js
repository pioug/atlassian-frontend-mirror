import React, { Component } from 'react';

import { withNavigationUIController } from '../../../ui-controller';

import LayoutManager from './LayoutManager';

function defaultTooltipContent(isCollapsed) {
  return isCollapsed
    ? { text: 'Expand', char: '[' }
    : { text: 'Collapse', char: '[' };
}

const LayoutManagerWithNavigationUIController = withNavigationUIController(
  LayoutManager,
);

export default class ConnectedLayoutManager extends Component {
  static defaultProps = {
    collapseToggleTooltipContent: defaultTooltipContent,
    experimental_alternateFlyoutBehaviour: false,
    experimental_flyoutOnHover: false,
    experimental_fullWidthFlyout: false,
    experimental_hideNavVisuallyOnCollapse: false,
    experimental_horizontalGlobalNav: false,
    topOffset: 0,
  };

  render() {
    return <LayoutManagerWithNavigationUIController {...this.props} />;
  }
}
