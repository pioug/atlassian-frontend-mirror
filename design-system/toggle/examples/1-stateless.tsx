import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { gridSize } from '@atlaskit/theme/constants';

import Toggle from '../src';

const StatelessExample = () => {
  const [isChecked, toggle] = useState(false);

  return (
    <div>
      <p>Interacting will not do anything by default</p>
      <Toggle isChecked={isChecked} />
      <p style={{ marginBottom: gridSize() }}>
        Can use this button to trigger a toggle
      </p>
      <Button appearance="primary" onClick={() => toggle(!isChecked)}>
        Toggle
      </Button>
    </div>
  );
};
export default StatelessExample;
