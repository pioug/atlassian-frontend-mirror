import React from 'react';

import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';

import Flag from '../../src';

const FlagActionsExample = () => {
  return (
    <Flag
      icon={<SuccessIcon primaryColor={G300} label="Success" />}
      actions={[
        {
          content: 'Try it now',
          onClick: () => {
            console.log('flag action clicked');
          },
        },
        {
          content: 'Learn more',
          href: '/components/flag/examples#actions',
        },
      ]}
      description="We’ve turbocharged your search results so you can get back to doing what you do best."
      id="1"
      key="1"
      title="Test drive your new search"
    />
  );
};

export default FlagActionsExample;
