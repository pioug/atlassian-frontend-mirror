import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import InfoIcon from '@atlaskit/icon/glyph/info';
import { token } from '@atlaskit/tokens';

import Flag from '../../src';

const FlagInfoExample = () => {
  return (
    <Flag
      appearance="info"
      icon={
        <InfoIcon
          label="Info"
          secondaryColor={token('color.background.neutral.bold')}
        />
      }
      id="info"
      key="info"
      title="There’s no one in this project"
      description="Add yourself or your team to get the party started."
      actions={[
        { content: 'Add teammates', onClick: noop },
        { content: 'Close', onClick: noop },
      ]}
    />
  );
};

export default FlagInfoExample;
