import React from 'react';
import { Component } from 'react';
import CheckIcon from '@atlaskit/icon/glyph/check';

import { ColorSample, CheckArea } from './colorButtonStyles';
import { PICKER_COLORS } from './colorPopup';

export interface ColorButtonProps {
  readonly color: string;
  readonly isSelected: boolean;
  readonly onClick: (color: string) => void;
}

export class ColorButton extends Component<ColorButtonProps> {
  render(): JSX.Element {
    const { color, onClick: onColorClick } = this.props;
    const onClick = () => onColorClick(color);
    const style = {
      borderColor: PICKER_COLORS[color],
      backgroundColor: color,
    };

    return (
      <ColorSample style={style} onClick={onClick}>
        {this.checkMark()}
      </ColorSample>
    );
  }

  private checkMark(): JSX.Element | null {
    const { isSelected } = this.props;

    if (isSelected) {
      return (
        <CheckArea>
          <CheckIcon label="check" size="medium" />
        </CheckArea>
      );
    }

    return null;
  }
}
