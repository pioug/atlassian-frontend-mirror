import React from 'react';
import { Component } from 'react';
import InlineDialog from '@atlaskit/inline-dialog';
import * as colors from '@atlaskit/theme/colors';

import { ColorButton } from './colorButton';
import { ColorPopupContentWrapper } from './popupStyles';

interface ColorCombinations {
  [backgroundColor: string]: string;
}
export const PICKER_COLORS: ColorCombinations = {
  [colors.R300]: colors.R200,
  [colors.Y300]: colors.Y200,
  [colors.G300]: colors.G200,
  [colors.B300]: colors.B200,
  [colors.R100]: colors.R75,
  [colors.Y75]: colors.Y50,
  [colors.G100]: colors.G200,
  [colors.B100]: colors.B100,
  [colors.P100]: colors.P75,
  [colors.T300]: colors.T100,
  [colors.N60]: colors.N40,
  [colors.N800]: colors.N200,
};
export const DEFAULT_COLOR = colors.R300;

export interface ColorPopupProps {
  readonly isOpen: boolean;
  readonly color: string;
  readonly onPickColor: (color: string) => void;
  readonly onClose: () => void;
}

export class ColorPopup extends Component<ColorPopupProps> {
  private closeSoonTimeout?: number;

  private closeSoon = () => {
    const { onClose } = this.props;
    this.closeSoonTimeout = window.setTimeout(onClose, 1500);
  };

  private cancelCloseSoon = () => {
    if (this.closeSoonTimeout) {
      window.clearTimeout(this.closeSoonTimeout);
      this.closeSoonTimeout = undefined;
    }
  };

  componentWillUnmount(): void {
    this.cancelCloseSoon();
  }

  render() {
    const { isOpen, children, onClose } = this.props;
    const content = (
      <ColorPopupContentWrapper
        onMouseLeave={this.closeSoon}
        onMouseEnter={this.cancelCloseSoon}
      >
        {this.renderButtons()}
      </ColorPopupContentWrapper>
    );
    return (
      <InlineDialog
        onContentBlur={onClose}
        isOpen={isOpen}
        placement="top-start"
        content={content}
      >
        {children}
      </InlineDialog>
    );
  }

  private renderButtons(): JSX.Element[] {
    const { onPickColor, color: currentColor } = this.props;

    return Object.keys(PICKER_COLORS).map((color, index) => (
      <ColorButton
        key={`${index}`}
        color={color}
        isSelected={currentColor.toLowerCase() === color.toLowerCase()}
        onClick={onPickColor}
      />
    ));
  }
}
