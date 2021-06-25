import React from 'react';

import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';

import Flag from '../src';

export default () => (
  <Flag
    actions={[
      { content: 'Show me', onClick: () => {} },
      { content: 'No thanks', onClick: () => {} },
    ]}
    icon={<SuccessIcon primaryColor={G300} label="Success" />}
    description="We got fun and games. We got everything you want honey, we know the names."
    id="1"
    key="1"
    title="Welcome to the jungle"
  />
);
