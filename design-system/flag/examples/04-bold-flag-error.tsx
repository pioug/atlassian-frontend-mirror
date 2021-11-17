import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import { R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag, { FlagGroup } from '../src';

export default () => (
  <FlagGroup>
    <Flag
      appearance="error"
      icon={
        <ErrorIcon
          label="Error"
          secondaryColor={token('color.iconBorder.danger', R400)}
        />
      }
      id="error"
      key="error"
      title="We couldn't connect"
      actions={[{ content: 'Check StatusPage', onClick: () => {} }]}
    />
  </FlagGroup>
);
