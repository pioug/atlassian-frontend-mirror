import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { Y200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag from '../../src';

const FlagWarningExample = () => {
  return (
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
      title="This page is visible to people outside your organization"
      description="Are you sure you want to publish?"
      actions={[
        { content: 'Publish', onClick: noop },
        { content: 'Go back', onClick: noop },
      ]}
    />
  );
};

export default FlagWarningExample;
