import React, { forwardRef } from 'react';

import SettingsIcon from '@atlaskit/icon/glyph/settings';

import { IconButton } from '../IconButton';

import { SettingsProps } from './types';

export const Settings = forwardRef(
  (props: SettingsProps, ref: React.Ref<any>) => {
    const { tooltip, ...iconButtonProps } = props;

    return (
      <IconButton
        icon={
          <SettingsIcon
            label={typeof tooltip === 'string' ? tooltip : 'Settings Icon'}
          />
        }
        ref={ref}
        tooltip={tooltip}
        {...iconButtonProps}
      />
    );
  },
);

export default Settings;
