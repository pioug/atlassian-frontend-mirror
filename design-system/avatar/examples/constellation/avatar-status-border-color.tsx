import React from 'react';

import { Status } from '../../src';

const AvatarStatusBorderColorExample = () => {
  return (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
    <div style={{ width: 24 }}>
      <Status status="approved" borderColor="red" />
    </div>
  );
};

export default AvatarStatusBorderColorExample;
