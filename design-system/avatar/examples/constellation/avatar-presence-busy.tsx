import React from 'react';

import { Presence } from '../../src';

const AvatarPresenceBusyExample = () => {
  return (
    <div style={{ width: 24 }}>
      <Presence presence="busy" />
    </div>
  );
};

export default AvatarPresenceBusyExample;
