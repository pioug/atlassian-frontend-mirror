/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import { Skeleton as SkeletonAvatar } from '@atlaskit/avatar';

import { HiddenWhenCollapsed } from './ToggleWhenCollapsed';

import SkeletonContainerHeaderText from './styled/SkeletonContainerHeaderText';
import SkeletonDefaultContainerHeaderInner from './styled/SkeletonDefaultContainerHeaderInner';

export default class SkeletonDefaultContainerHeader extends Component {
  static defaultProps = {
    isCollapsed: false,
    isAvatarHidden: false,
  };

  render() {
    return (
      <SkeletonDefaultContainerHeaderInner
        isAvatarHidden={this.props.isAvatarHidden}
      >
        {!this.props.isAvatarHidden && (
          <SkeletonAvatar appearance="square" size="large" weight="strong" />
        )}

        <HiddenWhenCollapsed isCollapsed={this.props.isCollapsed}>
          <SkeletonContainerHeaderText
            isAvatarHidden={this.props.isAvatarHidden}
          />
        </HiddenWhenCollapsed>
      </SkeletonDefaultContainerHeaderInner>
    );
  }
}
