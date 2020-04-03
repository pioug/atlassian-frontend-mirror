/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import SkeletonNavigationOuter from './styled/SkeletonNavigationOuter';
import SkeletonNavigationInner from './styled/SkeletonNavigationInner';

import SkeletonGlobalNavigation from './SkeletonGlobalNavigation';
import SkeletonContainerNavigation from './SkeletonContainerNavigation';
import SkeletonDefaultContainerHeader from './SkeletonDefaultContainerHeader';
import { HiddenWhenCollapsed } from './ToggleWhenCollapsed';

import { defaultContainerTheme, defaultGlobalTheme } from '../../../theme/util';

export default class SkeletonNavigation extends Component {
  static defaultProps = {
    isCollapsed: false,
    containerHeaderComponent: SkeletonDefaultContainerHeader,
  };

  render() {
    const {
      isCollapsed,
      globalTheme,
      containerTheme,
      containerHeaderComponent,
    } = this.props;

    return (
      <SkeletonNavigationOuter isCollapsed={isCollapsed}>
        <SkeletonNavigationInner>
          <HiddenWhenCollapsed isCollapsed={isCollapsed}>
            <SkeletonGlobalNavigation theme={defaultGlobalTheme(globalTheme)} />
          </HiddenWhenCollapsed>
          <SkeletonContainerNavigation
            theme={defaultContainerTheme(containerTheme)}
            isCollapsed={isCollapsed}
            containerHeaderComponent={containerHeaderComponent}
          />
        </SkeletonNavigationInner>
      </SkeletonNavigationOuter>
    );
  }
}
