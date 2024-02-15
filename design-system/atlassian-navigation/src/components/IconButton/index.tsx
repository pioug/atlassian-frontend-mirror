import React, { forwardRef, Ref } from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import Tooltip from '@atlaskit/tooltip';

import { useTheme } from '../../theme';

import { getIconButtonTheme } from './styles';
import { IconButtonProps } from './types';

/**
 * __Icon button__
 *
 * An icon button is used to create navigation items such as Help, Settings
 * and Notifications. You can use this component to create your own items to
 * pass into `AtlassianNavigation`'s render props, but where possible you should
 * rely on the defaults.
 *
 */
export const IconButton = forwardRef<HTMLElement, IconButtonProps>(
  (props: IconButtonProps, ref: Ref<HTMLElement>) => {
    const { icon, label, testId, tooltip, ...buttonProps } = props;
    const theme = useTheme();

    const button = (
      <Button
        appearance="primary"
        aria-label={label}
        testId={testId}
        iconBefore={icon}
        ref={ref}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
        theme={getIconButtonTheme(theme)}
        {...buttonProps}
      />
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip} hideTooltipOnClick>
          {button}
        </Tooltip>
      );
    }

    return button;
  },
);
