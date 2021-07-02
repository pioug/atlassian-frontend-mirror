import React from 'react';

import InfoIcon from '@atlaskit/icon/glyph/info';
import { N500 } from '@atlaskit/theme/colors';

import Flag from '../../src';

const FlagInfoExample = () => {
  return (
    <Flag
      appearance="info"
      icon={<InfoIcon label="Info" secondaryColor={N500} />}
      id="info"
      key="info"
      title="There’s no one in this project"
      description="Add yourself or your team to get the party started."
      actions={[
        { content: 'Add teammates', onClick: () => {} },
        { content: 'Close', onClick: () => {} },
      ]}
    />
  );
};

export default FlagInfoExample;
