/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import { Skeleton as SkeletonIcon } from '@atlaskit/icon';

import { HiddenWhenCollapsed } from './ToggleWhenCollapsed';

import SkeletonContainerItemWrapper from './styled/SkeletonContainerItemWrapper';
import SkeletonContainerItemText from './styled/SkeletonContainerItemText';
import SkeletonIconWrapper from './styled/SkeletonIconWrapper';

export default class SkeletonContainerItem extends Component {
  static defaultProps = {
    isCollapsed: false,
  };

  render() {
    return (
      <SkeletonContainerItemWrapper>
        <SkeletonIconWrapper>
          <SkeletonIcon />
        </SkeletonIconWrapper>
        <HiddenWhenCollapsed isCollapsed={this.props.isCollapsed}>
          <SkeletonContainerItemText textWidth={this.props.itemTextWidth} />
        </HiddenWhenCollapsed>
      </SkeletonContainerItemWrapper>
    );
  }
}
