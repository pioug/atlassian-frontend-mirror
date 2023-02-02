import React from 'react';
import { PureComponent } from 'react';

import ToolbarButton from '../../ToolbarButton';
import { AlignmentState } from '../../../plugins/alignment/pm-plugins/types';
import { ToolTipContent, Keymap, tooltip } from '../../../keymaps';
import { getAriaKeyshortcuts } from '@atlaskit/editor-common/keymaps';

export interface Props {
  value: AlignmentState;
  label: string;
  isSelected?: boolean;
  onClick: (value: AlignmentState, shouldClosePopup: boolean) => void;
  content: React.ReactElement<any>;
  shortcut?: Keymap;
}

class AlignmentButton extends PureComponent<Props> {
  render() {
    const { label, isSelected, content, shortcut } = this.props;
    return (
      <ToolbarButton
        disabled={false}
        selected={isSelected}
        title={<ToolTipContent description={label} keymap={shortcut} />}
        aria-label={shortcut ? tooltip(shortcut, label) : label}
        aria-pressed={isSelected}
        aria-keyshortcuts={getAriaKeyshortcuts(shortcut)}
        onClick={this.onClick}
        iconBefore={content}
      />
    );
  }

  onClick = (e: any) => {
    const { onClick, value } = this.props;

    // detect if the click event comes from keyboard where screenX and screenY are 0
    const isMouseEvent = e instanceof MouseEvent;
    e.preventDefault();
    onClick(value, isMouseEvent);
  };
}

export default AlignmentButton;
