import React from 'react';

import WarningIcon from '@atlaskit/icon/glyph/warning';
import { Y200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag, { FlagGroup } from '../src';

export default () => (
  <FlagGroup>
    <Flag
      appearance="warning"
      icon={
        <WarningIcon
          label="Warning"
          secondaryColor={token('color.background.warning.bold', Y200)}
        />
      }
      id="warning"
      key="warning"
      title="Presence isn't working"
      description="We'll do our best to get it up and running again soon."
      actions={[
        { content: 'Try again', onClick: () => {} },
        { content: 'Check StatusPage', onClick: () => {} },
      ]}
    />
  </FlagGroup>
);
