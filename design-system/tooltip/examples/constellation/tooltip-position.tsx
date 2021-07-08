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
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div style={{ padding: '40px 40px' }}>
      <Tooltip content={positionText} position={positionText}>
        <Button
          appearance="primary"
          onClick={() => {
            setPosition((position + 1) % VALID_POSITIONS.length);
          }}
        >
          Target
        </Button>
      </Tooltip>
    </div>
  );
};

export default PositionExample;
