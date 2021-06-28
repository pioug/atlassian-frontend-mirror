import React from 'react';

import { Presence } from '../../src';

const AvatarPresenceOfflineExample = () => {
  return (
    <div style={{ width: 24 }}>
      <Presence presence="offline" />
    </div>
  );
};

export default AvatarPresenceOfflineExample;
