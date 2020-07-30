import React from 'react';

import { Presence } from '../../src';

export default function AvatarPresenceBorderColor() {
  return (
    <div style={{ width: 24 }}>
      <Presence presence="online" borderColor="red" />
    </div>
  );
}
