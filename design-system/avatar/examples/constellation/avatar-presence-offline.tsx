import React from 'react';

import { Presence } from '../../src';

export default function AvatarPresenceOfflineExample() {
  return (
    <div style={{ width: 24 }}>
      <Presence presence="offline" />
    </div>
  );
}
