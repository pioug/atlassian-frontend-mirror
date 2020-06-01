import React from 'react';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { ToolTipContent } from '../../../../keymaps';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { ExpandIconWrapper } from '../../../../ui/styles';
import { TriggerWrapper } from './styles';
import { BlockMenuItem } from './create-items';

export interface DropDownButtonProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: React.MouseEventHandler;
  spacing: 'none' | 'default';
  handleRef(el: ToolbarButton, items: BlockMenuItem[]): void;
  items: BlockMenuItem[];
}

const DropDownButtonIcon: React.StatelessComponent<{
  label: string;
}> = React.memo(props => (
  <TriggerWrapper>
    <AddIcon label={props.label} />
    <ExpandIconWrapper>
      <ExpandIcon label={props.label} />
    </ExpandIconWrapper>
  </TriggerWrapper>
));

export const DropDownButton: React.StatelessComponent<DropDownButtonProps> = React.memo(
  props => {
    const { handleRef, items } = props;

    const handleRefCb = React.useCallback(
      (ref: ToolbarButton) => handleRef(ref, items),
      [handleRef, items],
    );

    return (
      <ToolbarButton
        ref={handleRefCb}
        selected={props.selected}
        disabled={props.disabled}
        onClick={props.onClick}
        spacing={props.spacing}
        iconBefore={<DropDownButtonIcon label={props.label} />}
        title={
          <ToolTipContent description={props.label} shortcutOverride="/" />
        }
      />
    );
  },
);
