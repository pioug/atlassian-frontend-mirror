import React, { useState } from 'react';

import Tooltip, { PositionType } from '../src';

import { Target } from './styled';

const colors = ['teal', 'blue', 'purple'];

const HoverIntent = () => {
  const [position, setPosition] = useState<PositionType>('bottom');

  return (
    <React.Fragment>
      <p>
        Click a target to toggle the position of the tooltips between{' '}
        {`'bottom'`} and {`'mouse'`}.
      </p>
      <div style={{ display: 'flex', marginTop: 10 }}>
        {colors.map((c, i) => (
          <Tooltip key={c} content={`Content ${i + 1}`} position={position}>
            <Target
              onClick={() =>
                setPosition(position === 'bottom' ? 'mouse' : 'bottom')
              }
              color={c}
              style={{ marginRight: 8 }}
              tabIndex={0}
            >
              Target {i + 1}
            </Target>
          </Tooltip>
        ))}
      </div>
    </React.Fragment>
  );
};

export default HoverIntent;
