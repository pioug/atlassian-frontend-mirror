import React from 'react';
import { Component } from 'react';
import {
  FrontArea,
  MainArea,
  TOTAL_CIRCLE_SIZE,
} from './lineWidthButtonStyles';
import { THICKNESS_MAX, THICKNESS_MIN } from '../popups/lineWidthPopup';

export interface LineWidthButtonProps {
  readonly isActive: boolean;
  readonly lineWidth: number;
  readonly onLineWidthClick: (lineWidth: number) => void;
}

export class LineWidthIcon extends Component<LineWidthButtonProps> {
  private getCircleSize = () => {
    // Here we convert from input range (4-20) to circle size range (4-16)
    const { lineWidth } = this.props;
    const localMin = 4;
    const localMax = 16;
    const localRange = localMax - localMin;
    const incomingRange = THICKNESS_MAX - THICKNESS_MIN;
    let circleSize = Math.floor(
      (lineWidth - THICKNESS_MIN) * (localRange / incomingRange) + 4,
    );
    // Circle size should be an even number. Odd size makes it moves off center.
    if (circleSize % 2 > 0) {
      circleSize -= 1;
    }
    return circleSize;
  };

  render() {
    const { lineWidth, isActive, onLineWidthClick } = this.props;
    const onClick = () => onLineWidthClick(lineWidth);

    const innerCircleSize = this.getCircleSize();
    const style = {
      width: `${innerCircleSize}px`,
      height: `${innerCircleSize}px`,
      borderRadius: `${innerCircleSize * 2}px`,
    };

    const mainAreaStyle = {
      padding: `${(TOTAL_CIRCLE_SIZE - innerCircleSize) / 2}px`,
    };

    return (
      <MainArea onClick={onClick} isActive={isActive} style={mainAreaStyle}>
        <FrontArea style={style} isActive={isActive} />
      </MainArea>
    );
  }
}
