import React from 'react';

import InfoIcon from '@atlaskit/icon/glyph/info';
import { N500 } from '@atlaskit/theme/colors';

import Flag from '../../src';

export default function FlagInfo() {
  return (
    <Flag
      appearance="info"
      icon={<InfoIcon label="Info" secondaryColor={N500} />}
      id="info"
      key="info"
      title="Where is everybody?"
      description="There’s no one in this project. Add yourself or your team to get the party started."
      actions={[{ content: 'Dismiss', onClick: () => {} }]}
    />
  );
}
