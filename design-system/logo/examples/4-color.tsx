import React from 'react';

import { B200, B400, N0, N100, N400, N600 } from '@atlaskit/theme/colors';

import { AtlassianLogo } from '../src';

export default () => (
  <>
    <AtlassianLogo />
    <AtlassianLogo
      textColor={B400}
      iconColor={B200}
      iconGradientStart={B400}
      iconGradientStop={B200}
    />
    <AtlassianLogo
      textColor={N400}
      iconColor={N100}
      iconGradientStart={N600}
      iconGradientStop={N100}
    />
    <div style={{ display: 'inline-block', background: B400 }}>
      <AtlassianLogo textColor={N0} iconColor={N0} />
    </div>
    <AtlassianLogo
      textColor={B400}
      iconColor={B200}
      iconGradientStart={B400}
      iconGradientStop={B200}
    />
  </>
);
