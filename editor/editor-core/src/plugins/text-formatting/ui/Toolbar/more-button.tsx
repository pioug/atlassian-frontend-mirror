import React, { useMemo } from 'react';

import MoreIcon from '@atlaskit/icon/glyph/editor/more';

import { TriggerWrapper } from '../../../../ui/styles';
import ToolbarButton from '../../../../ui/ToolbarButton';

type MoreButtonProps = {
  label: string;
  isReducedSpacing: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  onClick?: () => void;
};
export const MoreButton: React.FC<MoreButtonProps> = React.memo(
  ({ label, isReducedSpacing, isSelected, isDisabled, onClick }) => {
    const more = useMemo(
      () => (
        <TriggerWrapper>
          <MoreIcon label={label} />
        </TriggerWrapper>
      ),
      [label],
    );

    return (
      <ToolbarButton
        disabled={isDisabled}
        selected={isSelected}
        onClick={onClick}
        spacing={isReducedSpacing ? 'none' : 'default'}
        title={label}
        iconBefore={more}
      />
    );
  },
);
