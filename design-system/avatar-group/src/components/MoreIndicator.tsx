/** @jsx jsx */
import { forwardRef, useCallback } from 'react';

import { ClassNames, jsx } from '@emotion/core';

import Avatar, {
  ACTIVE_SCALE_FACTOR,
  AppearanceType,
  AvatarClickEventHandler,
  AvatarPropTypes,
  BORDER_WIDTH,
  SizeType,
} from '@atlaskit/avatar';
import {
  B300,
  B400,
  B50,
  background,
  N20,
  N30,
  N30A,
  N500,
} from '@atlaskit/theme/colors';

import { CssCallback } from './types';

const FONT_SIZE: Record<SizeType, number> = {
  xsmall: 10,
  small: 10,
  medium: 11,
  large: 12,
  xlarge: 16,
  xxlarge: 16,
};

const getButtonStyles = (
  css: CssCallback,
  { size, isActive }: { size: SizeType; isActive: boolean },
) => {
  const activeStyles = css`
    background-color: ${B50};
    transform: scale(${ACTIVE_SCALE_FACTOR});
    box-shadow: 0 0 0 ${BORDER_WIDTH}px ${B300};
    color: ${B400};
  `;

  return css`
    color: ${N500};
    background-color: ${N20};
    font-size: ${FONT_SIZE[size]}px;
    font-family: inherit;
    font-weight: 500;

    &:hover {
      background-color: ${N30};
      &:after {
        background-color: ${N30A};
      }
    }

    &:active {
      ${activeStyles}
      &:after {
        background-color: transparent;
      }
    }

    ${isActive && activeStyles}
  `;
};

export interface MoreIndicatorProps extends AvatarPropTypes {
  count: number;
  'aria-controls'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean;
  buttonProps: Partial<React.HTMLAttributes<HTMLElement>>;
  onClick: AvatarClickEventHandler;
  isActive: boolean;
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
      buttonProps = {},
      isActive,
    },
    ref,
  ) => {
    const onClickHander = useCallback(
      (event, analyticsEvent) => {
        if (buttonProps.onClick) {
          buttonProps.onClick(event);
        }

        onClick(event, analyticsEvent);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [buttonProps.onClick, onClick],
    );

    return (
      <Avatar
        appearance={appearance}
        size={size}
        borderColor={borderColor}
        ref={ref}
        onClick={onClickHander}
      >
        {({ testId: _, className, ref, ...props }) => (
          <ClassNames>
            {({ css, cx }) => (
              <button
                {...buttonProps}
                {...props}
                ref={ref as any}
                data-testid={testId}
                aria-controls={ariaControls}
                aria-expanded={ariaExpanded}
                aria-haspopup={ariaHaspopup}
                className={cx(
                  className,
                  getButtonStyles(css, { size, isActive }),
                )}
              >
                +{count! > MAX_DISPLAY_COUNT ? MAX_DISPLAY_COUNT : count}
              </button>
            )}
          </ClassNames>
        )}
      </Avatar>
    );
  },
);

MoreIndicator.displayName = 'MoreIndicator';

export default MoreIndicator;
