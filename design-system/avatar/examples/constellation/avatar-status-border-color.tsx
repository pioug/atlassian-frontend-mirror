import React from 'react';

import { Status } from '../../src';

export default function AvatarStatusBorderColorExample() {
  return (
    <div style={{ width: 24 }}>
      <Status status="approved" borderColor="red" />
    </div>
  );
}
