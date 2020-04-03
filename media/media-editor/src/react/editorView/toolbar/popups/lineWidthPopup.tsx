import React from 'react';
import { Component } from 'react';
import InlineDialog from '@atlaskit/inline-dialog';
import FieldRange from '@atlaskit/field-range';
import { LineWidthPopupContainer } from './popupStyles';

export const THICKNESS_MIN = 4;
export const THICKNESS_MAX = 12;

export interface LineWidthPopupProps {
  readonly isOpen: boolean;
  readonly lineWidth: number;
  readonly onLineWidthClick: (lineWidth: number) => void;
  readonly onClose: () => void;
}

export class LineWidthPopup extends Component<LineWidthPopupProps> {
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
    const { isOpen, children, lineWidth, onClose } = this.props;
    const content = (
      <LineWidthPopupContainer
        onMouseLeave={this.closeSoon}
        onMouseEnter={this.cancelCloseSoon}
      >
        <FieldRange
          value={lineWidth}
          step={2}
          min={THICKNESS_MIN}
          max={THICKNESS_MAX}
          onChange={this.onSliderChange}
        />
      </LineWidthPopupContainer>
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

  private onSliderChange = (value: number) => {
    const { onLineWidthClick } = this.props;
    onLineWidthClick(value);
  };
}
