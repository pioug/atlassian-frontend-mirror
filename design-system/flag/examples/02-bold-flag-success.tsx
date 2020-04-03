import React from 'react';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { colors } from '@atlaskit/theme';
import Flag, { FlagGroup } from '../src';

export default () => (
  <FlagGroup>
    <Flag
      appearance="success"
      icon={<SuccessIcon label="Success" secondaryColor={colors.G400} />}
      id="success"
      key="success"
      title="Connected"
      description="All wires now hooked up."
      actions={[{ content: 'Alrighty then', onClick: () => {} }]}
    />
  </FlagGroup>
);
