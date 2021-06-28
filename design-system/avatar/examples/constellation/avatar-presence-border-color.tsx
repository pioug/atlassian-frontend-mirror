import React from 'react';

import { Presence } from '../../src';

const AvatarPresenceBorderColor = () => {
  return (
    <div style={{ width: 24 }}>
      <Presence presence="online" borderColor="red" />
    </div>
  );
};

export default AvatarPresenceBorderColor;
