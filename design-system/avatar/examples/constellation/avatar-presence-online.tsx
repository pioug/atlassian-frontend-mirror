import React from 'react';

import { Presence } from '../../src';

export default function AvatarPresenceOnlineExample() {
  return (
    <div style={{ width: 24 }}>
      <Presence presence="online" />
    </div>
  );
}
