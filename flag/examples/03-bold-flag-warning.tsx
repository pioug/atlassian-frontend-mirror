import React from 'react';
import { colors } from '@atlaskit/theme';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Flag, { FlagGroup } from '../src';

export default () => (
  <FlagGroup>
    <Flag
      appearance="warning"
      icon={<WarningIcon label="Warning" secondaryColor={colors.Y200} />}
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
