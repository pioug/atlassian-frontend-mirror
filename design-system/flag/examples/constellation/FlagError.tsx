import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';

import Flag from '../../src';

export default () => (
  <Flag
    appearance="error"
    icon={<ErrorIcon label="Error" secondaryColor={colors.R400} />}
    id="error"
    key="error"
    title="We couldn't connect"
    description="Sorry about that. Try checking your internet connection or check the status on our end."
    actions={[{ content: 'Check StatusPage', onClick: () => {} }]}
    isDismissAllowed
  />
);
