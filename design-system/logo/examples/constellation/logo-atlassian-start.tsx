import React from 'react';

import { B200, B400, N700 } from '@atlaskit/theme/colors';

import { AtlassianStartLogo } from '../../src';

const LogoAtlassianStart = () => {
  return (
    <AtlassianStartLogo
      textColor={N700}
      iconColor={B200}
      iconGradientStart={B400}
      iconGradientStop={B200}
    />
  );
};

export default LogoAtlassianStart;
