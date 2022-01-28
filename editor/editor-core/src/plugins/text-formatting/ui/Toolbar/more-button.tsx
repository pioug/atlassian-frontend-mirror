import React from 'react';

import MoreIcon from '@atlaskit/icon/glyph/editor/more';

import { TriggerWrapper } from '../../../../ui/styles';
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
          <TriggerWrapper>
            <MoreIcon label="" />
          </TriggerWrapper>
        }
        aria-expanded={ariaExpanded}
        aria-label={label}
        aria-haspopup
      />
    );
  },
);
