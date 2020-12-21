import React from 'react';

import { B200, B400, N0 } from '@atlaskit/theme/colors';

import { AtlassianLogo } from '../../src';

export default () => (
  <div style={{ background: N0, boxShadow: `0 0 0 30px ${N0}` }}>
    <AtlassianLogo
      textColor={B400}
      iconColor={B200}
      iconGradientStart={B400}
      iconGradientStop={B200}
    />
  </div>
);
