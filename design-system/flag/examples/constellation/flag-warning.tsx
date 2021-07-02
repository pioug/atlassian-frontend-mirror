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
      title="This page is visible to people outside your organization"
      description="Are you sure you want to publish?"
      actions={[
        { content: 'Publish', onClick: () => {} },
        { content: 'Go back', onClick: () => {} },
      ]}
    />
  );
};

export default FlagWarningExample;
