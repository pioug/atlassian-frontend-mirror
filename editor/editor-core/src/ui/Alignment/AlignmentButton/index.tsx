import React from 'react';
import { PureComponent } from 'react';

import ToolbarButton from '../../ToolbarButton';
import { AlignmentState } from '../../../plugins/alignment/pm-plugins/types';

export interface Props {
  value: AlignmentState;
  label: string;
  isSelected?: boolean;
  onClick: (value: AlignmentState) => void;
  content: React.ReactElement<any>;
}

class AlignmentButton extends PureComponent<Props> {
  render() {
    const { label, isSelected, content } = this.props;
    return (
      <ToolbarButton
        disabled={false}
        selected={isSelected}
        title={label}
        aria-label={label}
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
