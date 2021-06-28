import React from 'react';

import { N100, N400, N600 } from '@atlaskit/theme/colors';

import { AtlassianLogo } from '../../src';

const LogoNeutral = () => {
  return (
    <AtlassianLogo
      textColor={N400}
      iconColor={N100}
      iconGradientStart={N600}
      iconGradientStop={N100}
    />
  );
};

export default LogoNeutral;
