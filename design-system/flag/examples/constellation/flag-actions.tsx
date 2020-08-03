import React from 'react';

import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';

import Flag from '../../src';

export default function FlagDefault() {
  return (
    <Flag
      icon={<SuccessIcon primaryColor={G300} label="Info" />}
      actions={[
        {
          content: 'with onClick',
          onClick: () => {
            console.log('flag action clicked');
          },
        },
        {
          content: 'with href',
          href: 'https://atlaskit.atlassian.com/',
          target: '_blank',
        },
      ]}
      description="We got fun and games. We got everything you want honey, we know the names."
      id="1"
      key="1"
      title="Welcome to the jungle"
    />
  );
}
