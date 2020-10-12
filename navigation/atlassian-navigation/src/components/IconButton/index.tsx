import React, { forwardRef, Ref } from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import Tooltip from '@atlaskit/tooltip';

import { useTheme } from '../../theme';

import { getIconButtonTheme } from './styles';
import { IconButtonProps } from './types';

export const IconButton = forwardRef<HTMLElement, IconButtonProps>(
  (props: IconButtonProps, ref: Ref<HTMLElement>) => {
    const { icon, testId, tooltip, ...buttonProps } = props;
    const theme = useTheme();

    const button = (
      <Button
        appearance="primary"
        testId={testId}
        iconBefore={icon}
        ref={ref}
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
