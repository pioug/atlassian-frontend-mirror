import React, { Component, MouseEvent } from 'react';

import {
  AppearanceType,
  getProps,
  SizeType,
  withPseudoState,
} from '@atlaskit/avatar';

import { Inner, Outer } from '../styled/MoreIndicator';

export interface MoreIndicatorProps {
  /** Used to override the default border color of the presence indicator.
   Accepts any color argument that the border-color CSS property accepts. */
  borderColor?: string;
  /** The total number excess of avatars */
  count?: number;
  /** When true, provides a gutter for the adjacent avatar */
  isStack?: boolean;
  /** Handle user interaction */
  onClick?: (event: MouseEvent) => void;
  /** Defines the size of the indicator */
  size?: SizeType;
  appearance?: AppearanceType;
  isActive?: boolean;
  isFocus?: boolean;
  isHover?: boolean;
  testId?: string;
}

const MAX_DISPLAY_COUNT = 99;

class MoreIndicator extends Component<MoreIndicatorProps> {
  static defaultProps = {
    count: 0,
    appearance: 'circle' as AppearanceType,
    size: 'medium' as SizeType,
  };

  render() {
    const outerProps = getProps(this);
    const {
      appearance,
      isActive,
      isFocus,
      isHover,
      size,
      count,
      testId,
    } = this.props;

    const displayCount = count! > MAX_DISPLAY_COUNT ? MAX_DISPLAY_COUNT : count;

    return (
      <Outer {...outerProps} isInteractive data-testid={testId}>
        <Inner
          appearance={appearance!}
          isActive={isActive}
          isFocus={isFocus}
          isHover={isHover}
          size={size!}
        >
          +{displayCount}
        </Inner>
      </Outer>
    );
  }
}

export default withPseudoState(MoreIndicator);
