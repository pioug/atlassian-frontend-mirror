/* eslint-disable @repo/internal/react/consistent-props-definitions */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

import { ChevronContainer } from './styled';

interface ChevronProps {
  expandLabel: string;
  collapseLabel: string;
  isExpanded?: boolean;
  ariaControls?: string;
  onExpandToggle?: Function;
  rowId: string;
  extendedLabel?: string;
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
    const {
      isExpanded,
      ariaControls,
      collapseLabel,
      expandLabel,
      rowId,
      extendedLabel,
    } = this.props;
    const getLabel = (defaultLabel: string) =>
      extendedLabel
        ? `${defaultLabel} ${extendedLabel} row`
        : `${defaultLabel} row ${rowId}`;
    return (
      <ChevronContainer>
        <IconButton
          appearance="subtle"
          onClick={this.handleClick}
          spacing="compact"
          icon={isExpanded ? ChevronDownIcon : ChevronRightIcon}
          aria-controls={ariaControls}
          label={isExpanded ? getLabel(collapseLabel) : getLabel(expandLabel)}
        />
      </ChevronContainer>
    );
  }
}
