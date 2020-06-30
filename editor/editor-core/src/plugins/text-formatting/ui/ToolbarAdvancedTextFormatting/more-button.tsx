import React from 'react';

import MoreIcon from '@atlaskit/icon/glyph/editor/more';

import { TriggerWrapper } from '../../../../ui/styles';
import ToolbarButton from '../../../../ui/ToolbarButton';

export interface MoreButtonProps {
  disabled: boolean;
  onClick: React.MouseEventHandler;
  selected?: boolean;
  spacing: 'default' | 'compact' | 'none';
  title: string;
}

export const MoreButton: React.StatelessComponent<MoreButtonProps> = props => {
  const { title } = props;

  const more = React.useMemo(
    () => (
      <TriggerWrapper>
        <MoreIcon label={title} />
      </TriggerWrapper>
    ),
    [title],
  );

  return (
    <ToolbarButton
      disabled={props.disabled}
      iconBefore={more}
      onClick={props.onClick}
      selected={props.selected}
      spacing={props.spacing}
      title={title}
    />
  );
};
