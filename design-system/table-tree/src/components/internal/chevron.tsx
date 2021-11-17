/* eslint-disable @repo/internal/react/consistent-props-definitions */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

import { ChevronContainer, ChevronIconContainer, iconColor } from './styled';

interface ChevronProps {
  expandLabel: string;
  collapseLabel: string;
  isExpanded?: boolean;
  ariaControls?: string;
  onExpandToggle?: Function;
}

export default class Chevron extends Component<ChevronProps> {
  static defaultProps = {
    expandLabel: 'Expand',
    collapseLabel: 'Collapse',
  };

  handleClick = () => {
    if (this.props.onExpandToggle) {
      this.props.onExpandToggle();
    }
  };

  render() {
    const { isExpanded, ariaControls, collapseLabel, expandLabel } = this.props;
    const iconProps = {
      size: 'medium',
      primaryColor: iconColor,
    } as const;
    return (
      <ChevronContainer>
        <Button
          spacing="none"
          appearance="subtle"
          aria-controls={ariaControls}
          onClick={this.handleClick}
        >
          <ChevronIconContainer>
            {isExpanded ? (
              <ChevronDownIcon label={collapseLabel} {...iconProps} />
            ) : (
              <ChevronRightIcon label={expandLabel} {...iconProps} />
            )}
          </ChevronIconContainer>
        </Button>
      </ChevronContainer>
    );
  }
}
