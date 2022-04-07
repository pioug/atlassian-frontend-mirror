/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';

import MoreIcon from '@atlaskit/icon/glyph/editor/more';

import { triggerWrapperStyles } from '../../../../ui/styles';
import ToolbarButton from '../../../../ui/ToolbarButton';

type MoreButtonProps = {
  label: string;
  isReducedSpacing: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  'aria-expanded': React.AriaAttributes['aria-expanded'];
  onClick?: () => void;
};
export const MoreButton: React.FC<MoreButtonProps> = React.memo(
  ({
    label,
    'aria-expanded': ariaExpanded,
    isReducedSpacing,
    isSelected,
    isDisabled,
    onClick,
  }) => {
    return (
      <ToolbarButton
        disabled={isDisabled}
        selected={isSelected}
        onClick={onClick}
        spacing={isReducedSpacing ? 'none' : 'default'}
        title={label}
        iconBefore={
          <div css={triggerWrapperStyles}>
            <MoreIcon label="" />
          </div>
        }
        aria-expanded={ariaExpanded}
        aria-label={label}
        aria-haspopup
      />
    );
  },
);
