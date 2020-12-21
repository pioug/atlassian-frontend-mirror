import React from 'react';

import { B400, N0 } from '@atlaskit/theme/colors';

import { AtlassianLogo } from '../../src';

export default () => (
  <div style={{ background: B400, boxShadow: `0 0 0 30px ${B400}` }}>
    <AtlassianLogo textColor={N0} iconColor={N0} />
  </div>
);
