import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { gridSize } from '@atlaskit/theme';

import Spinner from '../src';

function SpinnerButton() {
  const [showSpinner, setSpinner] = useState<boolean>(false);

  return (
    <Button
      appearance="primary"
      iconAfter={
        showSpinner ? <Spinner appearance="invert" /> : <React.Fragment />
      }
      onClick={() => setSpinner((value: boolean) => !value)}
    >
      {showSpinner ? 'hide' : 'show'} spinner
    </Button>
  );
}

export default () => (
  <div style={{ padding: gridSize() }}>
    <SpinnerButton />
  </div>
);
