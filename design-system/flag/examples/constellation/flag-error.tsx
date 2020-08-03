import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import { R400 } from '@atlaskit/theme/colors';

import Flag from '../../src';

export default function FlagError() {
  return (
    <Flag
      appearance="error"
      icon={<ErrorIcon label="Error" secondaryColor={R400} />}
      id="error"
      key="error"
      title="The internet may be out to lunch"
      description="Check your internet connection."
      actions={[{ content: 'Try again', onClick: () => {} }]}
    />
  );
}
