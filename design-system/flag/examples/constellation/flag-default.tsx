import React from 'react';

import InfoIcon from '@atlaskit/icon/glyph/info';
import { B300 } from '@atlaskit/theme/colors';

import Flag from '../../src';

const FlagDefaultExample = () => {
  return (
    <Flag
      icon={<InfoIcon primaryColor={B300} label="Info" />}
      description="Scott Farquhar published a new version of this page. Refresh to see the changes."
      id="1"
      key="1"
      title="New version published"
    />
  );
};

export default FlagDefaultExample;
