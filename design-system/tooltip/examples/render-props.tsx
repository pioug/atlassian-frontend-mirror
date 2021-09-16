import React, { Fragment, useState } from 'react';

import styled from '@emotion/styled';

import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/editor/add';

import Tooltip, { PositionType, TooltipPrimitive } from '../src';

const VALID_POSITIONS: PositionType[] = [
  'mouse',
  'top',
  'right',
  'bottom',
  'left',
];

const shortMessage = "I'm a short tooltip";
const longMessage =
  'I am a longer tooltip with a decent amount of content inside';

const InlineDialog = styled(TooltipPrimitive)`
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  color: #333;
  max-height: 300px;
  max-width: 300px;
  padding: 8px 12px;
`;

export default () => {
  const [message, setMessage] = React.useState(shortMessage);
  const [position, setPosition] = useState(0);

  const updateTooltip = React.useRef<() => void>();

  const changeDirection = () => {
    setPosition((position + 1) % VALID_POSITIONS.length);
  };

  const handleOnMouseDown = (event: React.MouseEvent<HTMLElement>) =>
    console.log(event);

  const positionText = VALID_POSITIONS[position];

  React.useLayoutEffect(() => {
    updateTooltip.current?.();
  }, [message]);

  return (
    <Fragment>
      <p>Icon</p>
      <Tooltip content="Save">
        {(tooltipProps) => (
          <Button
            aria-label="Add"
            iconBefore={<AddIcon label="Add" />}
            testId="add"
            {...tooltipProps}
          />
        )}
      </Tooltip>

      <p>Position</p>
      {/*eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions*/}
      <div style={{ padding: '40px 40px' }} onClick={changeDirection}>
        <Tooltip content={positionText} position={positionText}>
          {(tooltipProps) => <Button {...tooltipProps}>Target</Button>}
        </Tooltip>
      </div>

      <p>Position without render props</p>
      {/*eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions*/}
      <div style={{ padding: '40px 40px' }} onClick={changeDirection}>
        <Tooltip content={positionText} position={positionText}>
          <Button>Target</Button>
        </Tooltip>
      </div>

      <p>Click to update</p>
      <Tooltip
        content={({ update }) => {
          updateTooltip.current = update;
          return message;
        }}
      >
        {(tooltipProps) => (
          <Button
            {...tooltipProps}
            onClick={() =>
              setMessage(message === shortMessage ? longMessage : shortMessage)
            }
            onMouseDown={(e) => {
              tooltipProps.onMouseDown(e);
              handleOnMouseDown(e);
            }}
          >
            Click to toggle tooltip
          </Button>
        )}
      </Tooltip>

      <p>Component in content</p>
      <Tooltip component={InlineDialog} content="Hello World">
        {(tooltipProps) => (
          <Button appearance="primary" {...tooltipProps}>
            Hover Over Me
          </Button>
        )}
      </Tooltip>
    </Fragment>
  );
};
