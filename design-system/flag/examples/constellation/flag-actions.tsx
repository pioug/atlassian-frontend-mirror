import React from 'react';

import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';

import Flag from '../../src';

const FlagActionsExample = () => {
  return (
    <Flag
      icon={<SuccessIcon primaryColor={G300} label="Success" />}
      id="1"
      key="1"
      title="Issue START-42 was created successfully"
      actions={[
        {
          content: 'View issue',
          onClick: () => {
            console.log('flag action clicked');
          },
        },
        {
          content: 'Add to next sprint',
          href: '/components/flag/examples#actions',
        },
      ]}
    />
  );
};

export default FlagActionsExample;
