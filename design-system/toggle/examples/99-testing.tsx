import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import Toggle from '../src';

const StatelessExample = () => {
  const [isChecked, toggle] = useState(false);

  return (
    <div>
      <p>Interacting will not do anything by default</p>
      <Toggle isChecked={isChecked} testId="my-toggle-stateless" />
      <p style={{ marginBottom: token('space.100', '8px') }}>
        Can use this button to trigger a toggle
      </p>
      <Button
        appearance="primary"
        onClick={() => toggle(!isChecked)}
        testId="my-toggle-button"
      >
        Toggle
      </Button>
      <p>Regular</p>
      <Toggle testId="my-regular-stateful-toggle" />
      <p>Large (checked by default)</p>
      <Toggle size="large" defaultChecked testId="my-large-stateful-toggle" />
    </div>
  );
};

export default StatelessExample;
