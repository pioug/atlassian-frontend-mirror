import React, { FC, useState } from 'react';

import Tooltip, { PositionType } from '../src';

import { Color, Target } from './styled';

const VALID_POSITIONS: PositionType[] = [
  'mouse',
  'top',
  'right',
  'bottom',
  'left',
];

interface Props {
  color: Color;
}

const PositionExample: FC<Props> = ({ color = 'blue' }) => {
  const [position, setPosition] = useState(0);

  const changeDirection = () => {
    setPosition((position + 1) % VALID_POSITIONS.length);
  };

  const positionText = VALID_POSITIONS[position];

  return (
    <div style={{ padding: '40px 40px' }} onClick={changeDirection}>
      <Tooltip content={positionText} position={positionText}>
        <Target color={color}>Target</Target>
      </Tooltip>
    </div>
  );
};

export default PositionExample;
