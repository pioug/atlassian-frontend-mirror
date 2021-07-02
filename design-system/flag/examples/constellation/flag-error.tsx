import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import { R400 } from '@atlaskit/theme/colors';

import Flag from '../../src';

const FlagErrorExample = () => {
  return (
    <Flag
      appearance="error"
      icon={<ErrorIcon label="Error" secondaryColor={R400} />}
      id="error"
      key="error"
      title="We're having trouble connecting"
      description="Check your internet connection and try again."
      actions={[{ content: 'Try again', onClick: () => {} }]}
    />
  );
};

export default FlagErrorExample;
