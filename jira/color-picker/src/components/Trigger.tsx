/** @jsx jsx */
import { MouseEvent, useCallback } from 'react';
import Tooltip from '@atlaskit/tooltip';
import { css, jsx } from '@emotion/react';
import { COLOR_CARD_SIZE } from '../constants';
import { token } from '@atlaskit/tokens';
import { B100, DN600A, N0 } from '@atlaskit/theme/colors';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { SwatchSize } from '../types';

export interface Props {
  value: string;
  label?: string;
  onClick?: () => void;
  expanded?: boolean;
  swatchSize?: SwatchSize;
  isDisabled?: boolean;
}

const ColorCard = ({
  value,
  label,
  expanded,
  onClick,
  swatchSize = 'default',
  isDisabled,
}: Props) => {
  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
    [],
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.currentTarget.focus();

      if (onClick) {
        event.preventDefault();
        onClick();
      }
    },
    [onClick],
  );

  return getBooleanFF(
    'platform.design-tokens-color-picker-portfolio-plan-wizard_w8rcl',
  ) ? (
    <Tooltip content={label}>
      <button
        {...(getBooleanFF(
          'platform.color-picker-radio-button-functionality_6hkcy',
        )
          ? {
              css: [
                sharedColorContainerStyles,
                swatchSize === 'small'
                  ? smallColorContainerSizeNew
                  : defaultColorContainerSizeNew,
                colorCardButtonStyles,
                expanded && colorCardButtonFocusedStyles,
              ],
              disabled: isDisabled,
            }
          : {
              css: [
                sharedColorContainerStyles,
                defaultColorContainerSizeNew,
                colorCardButtonStyles,
                expanded && colorCardButtonFocusedStyles,
              ],
            })}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        aria-label={label}
        aria-expanded={expanded}
        aria-haspopup
        type="button"
      >
        <span css={colorCardWrapperStylesNew}>
          <span
            {...(getBooleanFF(
              'platform.color-picker-radio-button-functionality_6hkcy',
            )
              ? {
                  css: [
                    colorCardContentStylesNew,
                    swatchSize === 'small'
                      ? smallColorCardContentSize
                      : defaultColorCardContentSize,
                  ],
                }
              : {
                  css: [colorCardContentStylesNew, defaultColorCardContentSize],
                })}
            style={{
              background: value || 'transparent',
            }}
          />
        </span>
      </button>
    </Tooltip>
  ) : (
    <Tooltip content={label}>
      <button
        {...(getBooleanFF(
          'platform.color-picker-radio-button-functionality_6hkcy',
        )
          ? {
              css: [
                sharedColorContainerStyles,
                swatchSize === 'small'
                  ? smallColorContainerSize
                  : defaultColorContainerSize,
                colorCardButtonStyles,
                expanded && colorCardButtonFocusedStyles,
              ],
              disabled: isDisabled,
            }
          : {
              css: [
                sharedColorContainerStyles,
                defaultColorContainerSize,
                colorCardButtonStyles,
                expanded && colorCardButtonFocusedStyles,
              ],
            })}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        aria-label={label}
        aria-expanded={expanded}
        aria-haspopup
        type="button"
      >
        <span
          {...(getBooleanFF(
            'platform.color-picker-radio-button-functionality_6hkcy',
          )
            ? {
                css: [
                  colorCardContentStyles,
                  swatchSize === 'small'
                    ? smallColorCardContentSize
                    : defaultColorCardContentSize,
                ],
              }
            : { css: [colorCardContentStyles, defaultColorCardContentSize] })}
          style={{
            background: value || 'transparent',
          }}
        />
      </button>
    </Tooltip>
  );
};

export default ColorCard;

const sharedColorContainerStyles = css({
  display: 'inline-block',
  position: 'relative',
  border: '2px solid transparent',
  boxSizing: 'border-box',
  borderRadius: '6px',
  transition: 'border-color 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
  backgroundColor: token('color.background.neutral.subtle', N0),
  borderColor: token('color.background.neutral.subtle', N0),
  padding: token('space.0', '0px'),
  cursor: 'pointer',
  outline: 'none',
});

const smallColorContainerSize = css({
  width: '22px',
  height: '22px',
  top: token('space.negative.025', '-2px'),
});

const smallColorContainerSizeNew = css({
  width: token('space.300', '24px'),
  height: token('space.300', '24px'),
  top: token('space.negative.025', '-2px'),
});

const defaultColorContainerSize = css({
  width: `${COLOR_CARD_SIZE}px`,
  height: `${COLOR_CARD_SIZE}px`,
});

const defaultColorContainerSizeNew = css({
  width: token('space.400', '32px'),
  height: token('space.400', '32px'),
});

const colorCardButtonStyles = css({
  ':hover': {
    borderColor: token('color.background.neutral.subtle', N0),
  },
  ':not(:focus):hover, :focus': {
    borderColor: token('color.border.focused', B100),
    outline: 'none',
  },
});

const colorCardButtonFocusedStyles = css({
  borderColor: token('color.border.focused', B100),
  outline: 'none',
});

const colorCardContentStyles = css({
  position: 'absolute',
  top: '1px',
  left: '1px',
  borderRadius: token('border.radius.100', '3px'),
  boxShadow: `inset 0px 0px 0px 1px ${token(
    'color.background.inverse.subtle',
    DN600A,
  )}`,
});

const colorCardWrapperStylesNew = css({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const colorCardContentStylesNew = css({
  borderRadius: token('border.radius.100', '3px'),
  boxShadow: `inset 0px 0px 0px 1px ${token(
    'color.background.inverse.subtle',
    DN600A,
  )}`,
});

const smallColorCardContentSize = css({
  width: token('space.200', '16px'),
  height: token('space.200', '16px'),
});

const defaultColorCardContentSize = css({
  width: token('space.300', '24px'),
  height: token('space.300', '24px'),
});
