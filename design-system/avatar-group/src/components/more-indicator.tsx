/** @jsx jsx */
import { forwardRef, useCallback } from 'react';

import { css, jsx } from '@emotion/react';

import Avatar, {
  ACTIVE_SCALE_FACTOR,
  AppearanceType,
  AvatarClickEventHandler,
  AvatarPropTypes,
  BORDER_WIDTH,
  SizeType,
} from '@atlaskit/avatar';
import { B300, B400, B50, N0, N20, N30, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const FONT_SIZE: Record<SizeType, string> = {
  xsmall: '10px',
  small: '10px',
  medium: '11px',
  large: '12px',
  xlarge: '16px',
  xxlarge: '16px',
};

const buttonActiveStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '&&': {
    backgroundColor: token('color.background.selected', B50),
    boxShadow: `0 0 0 ${BORDER_WIDTH}px ${token(
      'color.border.selected',
      B300,
    )}`,
    color: token('color.text.selected', B400),
    transform: `scale(${ACTIVE_SCALE_FACTOR})`,
    '&:hover': {
      backgroundColor: token('color.background.selected.hovered', N30),
      color: token('color.text.selected', N500),
    },
    '&:active': {
      backgroundColor: token('color.background.selected.pressed', B50),
      color: token('color.text.selected', B400),
    },
  },
});

const buttonStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '&&': {
    backgroundColor: token('color.background.neutral', N20),
    color: token('color.text', N500),
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    fontFamily: 'inherit',
    fontWeight: token('font.weight.medium', '500'),

    '&:hover': {
      backgroundColor: token('color.background.neutral.hovered', N30),
      color: token('color.text', N500),
    },
    '&:active': {
      backgroundColor: token('color.background.neutral.pressed', B50),
      color: token('color.text', B400),
    },
    '&:after': {
      display: 'none',
    },
  },
});

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
      borderColor = token('color.border.inverse', N0),
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
    const onClickHander: AvatarClickEventHandler = useCallback(
      (event, analyticsEvent) => {
        if (buttonProps.onClick) {
          buttonProps.onClick(
            event as React.MouseEvent<HTMLElement, MouseEvent>,
          );
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
          <button
            type="submit"
            {...buttonProps}
            {...props}
            ref={ref as any}
            data-testid={testId}
            aria-controls={ariaControls}
            aria-expanded={ariaExpanded}
            aria-haspopup={ariaHaspopup}
            style={
              {
                fontSize: FONT_SIZE[size],
              } as React.CSSProperties
            }
            css={[buttonStyles, isActive && buttonActiveStyles]}
            className={className}
          >
            +{count! > MAX_DISPLAY_COUNT ? MAX_DISPLAY_COUNT : count}
          </button>
        )}
      </Avatar>
    );
  },
);

MoreIndicator.displayName = 'MoreIndicator';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default MoreIndicator;
