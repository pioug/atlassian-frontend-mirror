import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag from '../src';

export default () => (
  <Flag
    actions={[
      { content: 'Show me', onClick: noop },
      { content: 'No thanks', onClick: noop },
    ]}
    icon={
      <SuccessIcon
        primaryColor={token('color.icon.success', G300)}
        label="Success"
      />
    }
    description="We got fun and games. We got everything you want honey, we know the names."
    id="1"
    key="1"
    title="Welcome to the jungle"
  />
);
