import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag from '../../src';

const FlagErrorExample = () => {
  return (
    <Flag
      appearance="error"
      icon={
        <ErrorIcon
          label="Error"
          secondaryColor={token('color.background.danger.bold', R400)}
        />
      }
      id="error"
      key="error"
      title="We're having trouble connecting"
      description="Check your internet connection and try again."
      actions={[{ content: 'Try again', onClick: noop }]}
    />
  );
};

export default FlagErrorExample;
