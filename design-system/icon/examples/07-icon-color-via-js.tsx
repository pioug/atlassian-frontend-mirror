/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import { B500, B75 } from '@atlaskit/theme/colors';

import HomeCircleIcon from '../glyph/home-circle';

export default () => (
  <div>
    <HomeCircleIcon
      primaryColor="rebeccapurple"
      secondaryColor="yellow"
      size="xlarge"
      label=""
    />
    <HomeCircleIcon
      primaryColor={B500}
      secondaryColor={B75}
      size="xlarge"
      label=""
    />
  </div>
);
