import React from 'react';

import InfoIcon from '@atlaskit/icon/glyph/info';

import { AutoDismissFlag } from '../src';

export default function FlagInfo() {
  return (
    <AutoDismissFlag
      appearance="info"
      icon={<InfoIcon label="Info" />}
      id="info"
      title="Where is everybody?"
      description="There’s no one in this project. Add yourself or your team to get the party started."
      actions={[]}
    />
  );
}
