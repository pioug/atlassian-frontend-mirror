import React from 'react';

import { B200, B400 } from '@atlaskit/theme/colors';

import { AtlassianIcon } from '../../src';

const Logomark = () => {
  return (
    <AtlassianIcon
      iconColor={B200}
      iconGradientStart={B400}
      iconGradientStop={B200}
    />
  );
};

export default Logomark;
