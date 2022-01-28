import React from 'react';
import { PureComponent } from 'react';

import ToolbarButton from '../../ToolbarButton';
import { AlignmentState } from '../../../plugins/alignment/pm-plugins/types';
import { ToolTipContent, Keymap } from '../../../keymaps';

export interface Props {
  value: AlignmentState;
  label: string;
  isSelected?: boolean;
  onClick: (value: AlignmentState) => void;
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
        aria-label={label}
        aria-pressed={isSelected}
        onClick={this.onClick}
        iconBefore={content}
      />
    );
  }

  onClick = (e: any) => {
    const { onClick, value } = this.props;
    e.preventDefault();
    onClick(value);
  };
}

export default AlignmentButton;
