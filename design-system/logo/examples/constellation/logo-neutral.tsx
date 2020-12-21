import React from 'react';

import { N100, N40, N600 } from '@atlaskit/theme/colors';

import { AtlassianLogo } from '../../src';

export default () => (
  <div style={{ background: N40, boxShadow: `0 0 0 30px ${N40}` }}>
    <AtlassianLogo
      textColor={N100}
      iconColor={N100}
      iconGradientStart={N600}
      iconGradientStop={N100}
    />
  </div>
);
