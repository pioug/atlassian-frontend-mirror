import React, { forwardRef, Ref } from 'react';

import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';

import { IconButton } from '../IconButton';

import { AppSwitcherProps } from './types';

export const AppSwitcher = forwardRef(
  (props: AppSwitcherProps, ref: Ref<any>) => {
    const { tooltip, ...iconButtonProps } = props;

    return (
      <IconButton
        icon={
          <AppSwitcherIcon
            label={typeof tooltip === 'string' ? tooltip : 'Appswitcher Icon'}
          />
        }
        tooltip={tooltip}
        ref={ref}
        {...iconButtonProps}
      />
    );
  },
);

// exists only to extract props
export default (props: AppSwitcherProps) => {};
