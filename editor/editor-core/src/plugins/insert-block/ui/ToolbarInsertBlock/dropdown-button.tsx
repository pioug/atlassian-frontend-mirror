import React from 'react';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { ToolTipContent } from '../../../../keymaps';
import ToolbarButton, { ToolbarButtonRef } from '../../../../ui/ToolbarButton';
import { ExpandIconWrapper } from '../../../../ui/styles';
import { TriggerWrapper } from './styles';

export interface DropDownButtonProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: React.MouseEventHandler;
  spacing: 'none' | 'default';
  handleRef(el: ToolbarButtonRef): void;
}

const DropDownButtonIcon: React.StatelessComponent<{
  label: string;
}> = React.memo((props) => (
  <TriggerWrapper>
    <AddIcon label={props.label} />
    <ExpandIconWrapper>
      <ExpandIcon label="" />
    </ExpandIconWrapper>
  </TriggerWrapper>
));

export const DropDownButton: React.StatelessComponent<DropDownButtonProps> = React.memo(
  (props) => (
    <ToolbarButton
      ref={props.handleRef}
      selected={props.selected}
      disabled={props.disabled}
      onClick={props.onClick}
      spacing={props.spacing}
      iconBefore={<DropDownButtonIcon label={props.label} />}
      title={<ToolTipContent description={props.label} shortcutOverride="/" />}
    />
  ),
);
