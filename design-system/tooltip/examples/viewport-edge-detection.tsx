import React, { useState } from 'react';

import styled from '@emotion/styled';

import Button from '@atlaskit/button/standard-button';

import Tooltip from '../src';
import { PositionTypeBase } from '../src/types';

import { BigTarget } from './styled';

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

type CustomPositionType = 'standard' | 'mouse';

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

const PositionExample = () => {
  // store the direction as an index and pull it from the list above,
  // just to simplify the `changeDirection` logic
  const [state, setState] = useState({
    position: 0,
    positionType: 'standard' as CustomPositionType,
    viewportPosition: 0,
    tooltipContent: 0,
  });

  const changeDirection = () => {
    setState({
      ...state,
      position: (state.position + 1) % VALID_POSITIONS.length,
    });
  };

  const togglePositionType = () => {
    setState({
      ...state,
      positionType: state.positionType === 'standard' ? 'mouse' : 'standard',
    });
  };

  const changeViewportPosition = () => {
    setState({
      ...state,
      viewportPosition:
        (state.viewportPosition + 1) % VIEWPORT_POSITIONS.length,
    });
  };

  const toggleScrollbars = () => {
    if (!document.body) {
      throw new Error('Body not found');
    }
    document.body.style.height =
      document.body.style.height === '1500px' ? '' : '1500px';
    document.body.style.width =
      document.body.style.width === '1500px' ? '' : '1500px';
  };

  const changeTooltipSize = () => {
    setState({
      ...state,
      tooltipContent: (state.tooltipContent + 1) % tooltipSize.length,
    });
  };

  const position = VALID_POSITIONS[state.position];
  const viewportStyle = VIEWPORT_POSITIONS[state.viewportPosition];

  const tooltipPosition =
    state.positionType === 'standard' ? position : 'mouse';
  const mousePosition = state.positionType === 'mouse' ? position : undefined;

  return (
    <ContainerDiv>
      <CenterDiv>
        <ButtonDiv>
          This example showcases how tooltips behave when rendered near the edge
          of the viewport.
          <br />
          Click the tooltip target itself to change the position of the tooltip
          and the buttons below to toggle other behavior.
        </ButtonDiv>
        <ButtonDiv>
          <Button onClick={togglePositionType}>Toggle position mouse</Button>
        </ButtonDiv>
        <ButtonDiv>
          <Button onClick={changeViewportPosition}>
            Change viewport position
          </Button>
        </ButtonDiv>
        <ButtonDiv>
          <Button onClick={toggleScrollbars}>Toggle window scrollbars</Button>
        </ButtonDiv>
        <ButtonDiv>
          <Button onClick={changeTooltipSize}>Change tooltip content</Button>
        </ButtonDiv>
        <ButtonDiv>Content: {tooltipSize[state.tooltipContent]}</ButtonDiv>
      </CenterDiv>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        onClick={changeDirection}
        style={{ position: 'absolute', ...viewportStyle }}
      >
        <Tooltip
          content={getTooltipContent(position, state.tooltipContent)}
          position={tooltipPosition}
          mousePosition={mousePosition}
        >
          {/* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */}
          <BigTarget color="blue">
            <span>Target</span>
            <span>Position: {tooltipPosition}</span>
            <span>
              {state.positionType === 'mouse' &&
                `mousePosition: ${String(mousePosition)}`}
            </span>
          </BigTarget>
        </Tooltip>
      </div>
    </ContainerDiv>
  );
};

export default PositionExample;
