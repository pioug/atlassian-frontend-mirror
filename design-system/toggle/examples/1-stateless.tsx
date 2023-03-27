import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import Toggle from '../src';

const StatelessExample = () => {
  const [isChecked, toggle] = useState(false);

  return (
    <div>
      <p>Interacting will not do anything by default</p>
      <Toggle isChecked={isChecked} />
      <p style={{ marginBottom: token('space.100', '8px') }}>
        Can use this button to trigger a toggle
      </p>
      <Button appearance="primary" onClick={() => toggle(!isChecked)}>
        Toggle
      </Button>
    </div>
  );
};
export default StatelessExample;
