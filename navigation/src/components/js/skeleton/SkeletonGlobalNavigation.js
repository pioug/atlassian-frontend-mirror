/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { WithRootTheme } from '../../../theme/util';

import SkeletonGlobalTopItems from './SkeletonGlobalTopItems';
import SkeletonGlobalBottomItems from './SkeletonGlobalBottomItems';

import SkeletonGlobalNavigationInner from './styled/SkeletonGlobalNavigationInner';
import SkeletonNavigationContentOuter from './styled/SkeletonNavigationContentOuter';

export default class SkeletonGlobalNavigation extends Component {
  static defaultProps = {
    isCollapsed: false,
  };

  render() {
    return (
      <WithRootTheme
        provided={this.props.theme}
        isCollapsed={this.props.isCollapsed}
      >
        <SkeletonGlobalNavigationInner>
          <SkeletonNavigationContentOuter>
            <SkeletonGlobalTopItems />
            <SkeletonGlobalBottomItems />
          </SkeletonNavigationContentOuter>
        </SkeletonGlobalNavigationInner>
      </WithRootTheme>
    );
  }
}
