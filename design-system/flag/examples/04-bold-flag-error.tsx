import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import { R400 } from '@atlaskit/theme/colors';

import Flag, { FlagGroup } from '../src';

export default () => (
  <FlagGroup>
    <Flag
      appearance="error"
      icon={<ErrorIcon label="Error" secondaryColor={R400} />}
      id="error"
      key="error"
      title="We couldn't connect"
      actions={[{ content: 'Check StatusPage', onClick: () => {} }]}
    />
  </FlagGroup>
);
