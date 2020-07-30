import React from 'react';

import { Presence } from '../../src';

export default function AvatarPresenceBusyExample() {
  return (
    <div style={{ width: 24 }}>
      <Presence presence="busy" />
    </div>
  );
}
