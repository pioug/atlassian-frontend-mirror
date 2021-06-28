import React from 'react';

import WarningIcon from '@atlaskit/icon/glyph/warning';
import { Y200 } from '@atlaskit/theme/colors';

import Flag from '../../src';

const FlagWarningExample = () => {
  return (
    <Flag
      appearance="warning"
      icon={<WarningIcon label="Warning" secondaryColor={Y200} />}
      id="warning"
      key="warning"
      title="Having trouble connecting…"
      description="We’re running into some difficulties connecting to Jira right now."
      actions={[
        { content: 'Try again', onClick: () => {} },
        { content: 'Check status page', onClick: () => {} },
      ]}
    />
  );
};

export default FlagWarningExample;
