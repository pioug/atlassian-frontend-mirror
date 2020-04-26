/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

import { ChevronContainer, ChevronIconContainer, iconColor } from '../styled';

export default class Chevron extends Component {
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
    };
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
