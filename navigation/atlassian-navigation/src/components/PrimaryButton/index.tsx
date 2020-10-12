/** @jsx jsx */
import { forwardRef, Ref } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import Tooltip from '@atlaskit/tooltip';

import { useTheme } from '../../theme';

import { getPrimaryButtonTheme, isHighlightedCSS } from './styles';
import { PrimaryButtonProps } from './types';

export const PrimaryButton = forwardRef<HTMLElement, PrimaryButtonProps>(
  (props: PrimaryButtonProps, ref: Ref<HTMLElement>) => {
    const {
      children,
      testId,
      tooltip,
      isSelected,
      isHighlighted,
      ...buttonProps
    } = props;
    const theme = useTheme();

    const button = (
      <div css={isHighlightedCSS(theme, isHighlighted)}>
        <Button
          appearance="primary"
          testId={testId}
          ref={ref}
          isSelected={isSelected}
          theme={getPrimaryButtonTheme(theme)}
          {...buttonProps}
        >
          {children}
        </Button>
      </div>
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

export default PrimaryButton;
