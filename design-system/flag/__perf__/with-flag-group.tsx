import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { token } from '@atlaskit/tokens';

import Flag, { FlagGroup } from '../src';

export default () => (
  <FlagGroup>
    <Flag
      appearance="success"
      icon={
        <SuccessIcon
          label="Success"
          secondaryColor={token('color.background.success.bold')}
        />
      }
      id="success"
      key="success"
      title="Connected"
      description="All wires now hooked up."
      actions={[{ content: 'Alrighty then', onClick: noop }]}
    />
  </FlagGroup>
);
