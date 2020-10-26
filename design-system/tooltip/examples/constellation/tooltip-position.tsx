import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import Tooltip from '../../src';
import { PositionType } from '../../src/types';

const VALID_POSITIONS: PositionType[] = [
  'mouse',
  'top',
  'right',
  'bottom',
  'left',
];

const PositionExample = () => {
  const [position, setPosition] = useState(0);
  const positionText = VALID_POSITIONS[position];

  return (
    <div
      style={{ padding: '40px 40px' }}
      onClick={() => {
        setPosition((position + 1) % VALID_POSITIONS.length);
      }}
    >
      <Tooltip content={positionText} position={positionText}>
        <Button appearance="primary">Target</Button>
      </Tooltip>
    </div>
  );
};

export default PositionExample;
