import React from 'react';

import { N100, N600 } from '@atlaskit/theme/colors';

import { AtlassianLogo } from '../../src';

export default () => (
  <AtlassianLogo
    textColor={N100}
    iconColor={N100}
    iconGradientStart={N600}
    iconGradientStop={N100}
  />
);
