import React, { Component } from 'react';
import StyledSkeleton from '../styled/Skeleton';
import { SizeType, AppearanceType } from '../types';

interface SkeletonProps {
  /* Indicates the shape of the skeleton */
  appearance: AppearanceType;
  /* Sets the color of the skeleton. By default it will inherit the current text color. */
  color?: string;
  /* Defines the size of the skeleton */
  size: SizeType;
  /* Determines the opacity of the skeleton */
  weight: 'normal' | 'strong';
}

export default class Skeleton extends Component<SkeletonProps> {
  static defaultProps = {
    appearance: 'circle',
    size: 'medium',
    weight: 'normal',
  };

  render() {
    return <StyledSkeleton {...this.props} />;
  }
}
