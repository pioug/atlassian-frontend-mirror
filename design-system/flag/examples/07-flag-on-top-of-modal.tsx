import React from 'react';
import { colors } from '@atlaskit/theme';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import Flag, { FlagGroup } from '../src';

export default () => (
  <div>
    <FlagGroup>
      <Flag
        description="I should be above the modal dialog"
        icon={<SuccessIcon primaryColor={colors.G300} label="Info" />}
        id="1"
        key="1"
        title="I am a Flag"
      />
    </FlagGroup>
  </div>
);
