import React, { Fragment, useState } from 'react';

import styled from '@emotion/styled';

import Button, { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import { token } from '@atlaskit/tokens';

import Tooltip, { type PositionType, TooltipPrimitive } from '../../src';

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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const InlineDialog = styled(TooltipPrimitive)({
  background: 'white',
  borderRadius: token('border.radius', '4px'),
  boxShadow: token('elevation.shadow.overlay'),
  boxSizing: 'content-box',
  color: token('color.text'),
  maxHeight: '300px',
  maxWidth: '300px',
  padding: `${token('space.100', '8px')} ${token('space.150', '12px')}`,
});

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
      <Tooltip content="Add content">
        {(tooltipProps) => (
          <IconButton
            icon={AddIcon}
            label="Add"
            testId="add"
            {...tooltipProps}
          />
        )}
      </Tooltip>

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
            Hover or keyboard focus on me
          </Button>
        )}
      </Tooltip>

      <p>Position</p>
      <div
        style={{
          padding: `${token('space.500', '40px')} ${token(
            'space.500',
            '40px',
          )}`,
        }}
      >
        <Tooltip content={positionText} position={positionText}>
          {(tooltipProps) => (
            <Button {...tooltipProps} onClick={changeDirection}>
              Target
            </Button>
          )}
        </Tooltip>
      </div>
    </Fragment>
  );
};
