/** @jsx jsx */
import { forwardRef } from 'react';

import { ClassNames, jsx } from '@emotion/core';

import Avatar, {
  AppearanceType,
  AvatarPropTypes,
  SizeType,
} from '@atlaskit/avatar';
import { background, N40, N500 } from '@atlaskit/theme/colors';

const FONT_SIZE: Record<SizeType, number> = {
  xsmall: 10,
  small: 10,
  medium: 11,
  large: 12,
  xlarge: 16,
  xxlarge: 16,
};

export interface MoreIndicatorProps extends AvatarPropTypes {
  count: number;
  'aria-controls'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean;
}

const MAX_DISPLAY_COUNT = 99;

const MoreIndicator = forwardRef<HTMLButtonElement, MoreIndicatorProps>(
  (
    {
      appearance = 'circle' as AppearanceType,
      borderColor = background(),
      size = 'medium' as SizeType,
      count = 0,
      testId,
      onClick,
      'aria-controls': ariaControls,
      'aria-expanded': ariaExpanded,
      'aria-haspopup': ariaHaspopup,
    },
    ref,
  ) => (
    <Avatar
      appearance={appearance}
      size={size}
      borderColor={borderColor}
      onClick={onClick}
      ref={ref}
    >
      {({ testId: _, className, ref, ...props }) => (
        <ClassNames>
          {({ css, cx }) => (
            <button
              {...props}
              ref={ref as any}
              data-testid={testId}
              aria-controls={ariaControls}
              aria-expanded={ariaExpanded}
              aria-haspopup={ariaHaspopup}
              className={cx(
                className,
                css`
                  color: ${N500};
                  background-color: ${N40};
                  font-size: ${FONT_SIZE[size]}px;
                `,
              )}
            >
              +{count! > MAX_DISPLAY_COUNT ? MAX_DISPLAY_COUNT : count}
            </button>
          )}
        </ClassNames>
      )}
    </Avatar>
  ),
);

MoreIndicator.displayName = 'MoreIndicator';

export default MoreIndicator;
