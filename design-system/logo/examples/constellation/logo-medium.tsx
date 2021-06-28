import React from 'react';

import { B200, B400 } from '@atlaskit/theme/colors';

import { AtlassianLogo } from '../../src';

const LogoMedium = () => {
  return (
    <AtlassianLogo
      size="medium"
      textColor={B400}
      iconColor={B200}
      iconGradientStart={B400}
      iconGradientStop={B200}
    />
  );
};

export default LogoMedium;
