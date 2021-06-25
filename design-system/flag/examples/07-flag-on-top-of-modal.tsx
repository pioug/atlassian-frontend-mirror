import React from 'react';

import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';

import Flag, { FlagGroup } from '../src';

export default () => (
  <div>
    <FlagGroup>
      <Flag
        description="I should be above the modal dialog"
        icon={<SuccessIcon primaryColor={G300} label="Success" />}
        id="1"
        key="1"
        title="I am a Flag"
      />
    </FlagGroup>
  </div>
);
