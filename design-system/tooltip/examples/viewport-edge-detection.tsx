import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { BigTarget } from './styled';
import { Color } from './styled';
import Tooltip from '../src';
import { PositionTypeBase } from '../src/types';

const VALID_POSITIONS: PositionTypeBase[] = ['top', 'right', 'bottom', 'left'];

const targetHeight = 100;
const targetWidth = 178;

const VIEWPORT_POSITIONS = [
  { top: 0, left: 0 },
  { top: 0, left: `calc(50% - ${targetWidth / 2}px)` },
  { top: 0, right: 0 },
  { top: `calc(50% - ${targetHeight / 2}px)`, right: 0 },
  { bottom: 0, right: 0 },
  { bottom: 0, left: `calc(50% - ${targetWidth / 2}px)` },
  { bottom: 0, left: 0 },
  { top: `calc(50% - ${targetHeight / 2}px)`, left: 0 },
];

const ContainerDiv = styled.div`
  height: calc(100vh - 32px);
  width: calc(100vw - 32px);
  position: relative;
`;

const CenterDiv = styled.div`
  top: calc(50% - 100px);
  left: calc(50% - 250px);
  position: absolute;
  width: 500px;
  height: 200px;
  z-index: 1;
  text-align: center;
`;

const ButtonDiv = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

interface Props {
  color: Color;
}

type PositionType = 'standard' | 'mouse';

interface State {
  position: number;
  positionType: PositionType;
  viewportPosition: number;
  tooltipContent: number;
}

function getTooltipContent(position: PositionTypeBase, index: number) {
  const contentArray = [
    `The position of the tooltip is ${position}.`,
    `The position of the tooltip is ${position}.
     It has a longer content description that wraps multiple lines but is not taller than target.`,
    `The position of the tooltip is ${position}.
     It has a longer content description that wraps multiple lines and is taller than target.
     This should showcase any edge cases related to viewport boundary detection logic. In most
     cases tooltips shouldn't have this much content though.`,
    `The position of the tooltip is ${position}. ThisHasAReallyLongWordWithNoSpacesWhichShouldWrap.`,
  ];

  return contentArray[index];
}

const tooltipSize = ['small', 'medium', 'large', 'long words'];

export default class PositionExample extends React.Component<Props, State> {
  // store the direction as an index and pull it from the list above,
  // just to simplify the `changeDirection` logic
  state = {
    position: 0,
    positionType: 'standard' as PositionType,
    viewportPosition: 0,
    tooltipContent: 0,
  };

  static defaultProps = {
    color: 'blue',
  };

  changeDirection = () => {
    this.setState({
      position: (this.state.position + 1) % VALID_POSITIONS.length,
    });
  };

  togglePositionType = () => {
    this.setState({
      positionType:
        this.state.positionType === 'standard' ? 'mouse' : 'standard',
    });
  };

  changeViewportPosition = () => {
    this.setState({
      viewportPosition:
        (this.state.viewportPosition + 1) % VIEWPORT_POSITIONS.length,
    });
  };

  toggleScrollbars = () => {
    if (!document.body) {
      throw new Error('Body not found');
    }
    document.body.style.height =
      document.body.style.height === '1500px' ? '' : '1500px';
    document.body.style.width =
      document.body.style.width === '1500px' ? '' : '1500px';
  };

  changeTooltipSize = () => {
    this.setState({
      tooltipContent: (this.state.tooltipContent + 1) % tooltipSize.length,
    });
  };

  render() {
    const position = VALID_POSITIONS[this.state.position];
    const viewportStyle = VIEWPORT_POSITIONS[this.state.viewportPosition];
    const { positionType, tooltipContent } = this.state;

    const tooltipPosition = positionType === 'standard' ? position : 'mouse';
    const mousePosition = positionType === 'mouse' ? position : undefined;

    /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    return (
      <ContainerDiv>
        <CenterDiv>
          <ButtonDiv>
            This example showcases how tooltips behave when rendered near the
            edge of the viewport.
            <br />
            Click the tooltip target itself to change the position of the
            tooltip and the buttons below to toggle other behaviour.
          </ButtonDiv>
          <ButtonDiv>
            <Button onClick={this.togglePositionType}>
              Toggle position mouse
            </Button>
          </ButtonDiv>
          <ButtonDiv>
            <Button onClick={this.changeViewportPosition}>
              Change viewport position
            </Button>
          </ButtonDiv>
          <ButtonDiv>
            <Button onClick={this.toggleScrollbars}>
              Toggle window scrollbars
            </Button>
          </ButtonDiv>
          <ButtonDiv>
            <Button onClick={this.changeTooltipSize}>
              Change tooltip content
            </Button>
          </ButtonDiv>
          <ButtonDiv>Content: {tooltipSize[tooltipContent]}</ButtonDiv>
        </CenterDiv>
        <div
          onClick={this.changeDirection}
          style={{ position: 'absolute', ...viewportStyle }}
        >
          <Tooltip
            content={getTooltipContent(position, tooltipContent)}
            position={tooltipPosition}
            mousePosition={mousePosition}
          >
            <BigTarget color={this.props.color}>
              <span>Target</span>
              <span>Position: {tooltipPosition}</span>
              <span>
                {positionType === 'mouse' &&
                  `mousePosition: ${String(mousePosition)}`}
              </span>
            </BigTarget>
          </Tooltip>
        </div>
      </ContainerDiv>
    );
  }
}
