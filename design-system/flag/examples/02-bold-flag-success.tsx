import React from 'react';

import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G400 } from '@atlaskit/theme/colors';

import Flag, { FlagGroup } from '../src';

export default () => (
  <FlagGroup>
    <Flag
      appearance="success"
      icon={<SuccessIcon label="Success" secondaryColor={G400} />}
      id="success"
      key="success"
      title="Connected"
      description="All wires now hooked up."
      actions={[{ content: 'Alrighty then', onClick: () => {} }]}
    />
  </FlagGroup>
);
