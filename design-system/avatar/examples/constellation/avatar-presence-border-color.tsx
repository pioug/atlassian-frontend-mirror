import React from 'react';

import { Presence } from '../../src';

const AvatarPresenceBorderColor = () => (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
  <div style={{ width: 24 }}>
    <Presence presence="online" borderColor="red" />
  </div>
);

export default AvatarPresenceBorderColor;
