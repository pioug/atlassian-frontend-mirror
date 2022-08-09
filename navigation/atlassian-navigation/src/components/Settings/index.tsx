import React, { forwardRef } from 'react';

import SettingsIcon from '@atlaskit/icon/glyph/settings';

import { IconButton } from '../IconButton';

import { SettingsProps } from './types';

/**
 * __Settings__
 *
 * A settings button that can be passed into `AtlassianNavigation`'s `renderSettings` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#settings)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
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
