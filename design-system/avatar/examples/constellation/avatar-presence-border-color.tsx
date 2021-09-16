/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { Presence } from '../../src';

const AvatarPresenceBorderColor = () => (
  <div style={{ width: 24 }}>
    <Presence presence="online" borderColor="red" />
  </div>
);

export default AvatarPresenceBorderColor;
