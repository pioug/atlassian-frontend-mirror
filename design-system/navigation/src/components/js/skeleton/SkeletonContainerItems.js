/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import SkeletonContainerItem from './SkeletonContainerItem';

import SkeletonNavigationItems from './styled/SkeletonNavigationItems';

export default class SkeletonContainerItems extends Component {
  static defaultProps = {
    isCollapsed: false,
  };

  render() {
    const { isCollapsed, itemTextWidth } = this.props;
    return (
      <SkeletonNavigationItems>
        <SkeletonContainerItem
          isCollapsed={isCollapsed}
          itemTextWidth={itemTextWidth}
        />
        <SkeletonContainerItem
          isCollapsed={isCollapsed}
          itemTextWidth={itemTextWidth}
        />
        <SkeletonContainerItem
          isCollapsed={isCollapsed}
          itemTextWidth={itemTextWidth}
        />
        <SkeletonContainerItem
          isCollapsed={isCollapsed}
          itemTextWidth={itemTextWidth}
        />
        <SkeletonContainerItem
          isCollapsed={isCollapsed}
          itemTextWidth={itemTextWidth}
        />
      </SkeletonNavigationItems>
    );
  }
}
