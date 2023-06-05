import React, { useState } from 'react';

import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import Range from '../src';

function WithTooltip() {
  const [value, setValue] = useState(50);

  return (
    <div style={{ paddingTop: token('space.500', '40px') }}>
      <Tooltip position="top" content={value}>
        <Range step={1} value={value} onChange={(value) => setValue(value)} />
      </Tooltip>
    </div>
  );
}

export default WithTooltip;
