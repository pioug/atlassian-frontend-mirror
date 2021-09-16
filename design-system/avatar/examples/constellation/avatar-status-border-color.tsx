/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { Status } from '../../src';

const AvatarStatusBorderColorExample = () => {
  return (
    <div style={{ width: 24 }}>
      <Status status="approved" borderColor="red" />
    </div>
  );
};

export default AvatarStatusBorderColorExample;
