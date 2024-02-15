import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Spinner from '../src';

const InvertedSpinner = () => <Spinner appearance="invert" />;

function SpinnerButton() {
  const [showSpinner, setSpinner] = useState<boolean>(false);

  return (
    <Button
      appearance="primary"
      iconAfter={showSpinner ? InvertedSpinner : undefined}
      onClick={() => setSpinner((value: boolean) => !value)}
    >
      {showSpinner ? 'hide' : 'show'} spinner
    </Button>
  );
}

export default () => (
  <div style={{ padding: token('space.100', '8px') }}>
    <SpinnerButton />
  </div>
);
