/**
 * NOTE: This GlobalNavigation is the layout primitive, which will be wrapped by
 * the more opinionated @atlaskit/global-navigation component.
 */

import React, { Component } from 'react';

// eslint-disable-next-line import/no-named-as-default
import { withGlobalTheme } from '../../../theme';
import GlobalItem from '../GlobalItem';

import GlobalNavigation from './GlobalNavigation';

const GlobalNavigationWithTheme = withGlobalTheme(GlobalNavigation);

export default class ConnectedGlobalNavigation extends Component {
  static defaultProps = {
    itemComponent: GlobalItem,
  };

  render() {
    return <GlobalNavigationWithTheme {...this.props} />;
  }
}
