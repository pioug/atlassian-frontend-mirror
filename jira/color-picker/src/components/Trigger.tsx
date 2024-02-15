/** @jsx jsx */
import { MouseEvent, useCallback } from 'react';
import Tooltip from '@atlaskit/tooltip';
import { css, jsx } from '@emotion/react';
import { COLOR_CARD_SIZE } from '../constants';
import { token } from '@atlaskit/tokens';
import { B100, DN600A, N0 } from '@atlaskit/theme/colors';

export interface Props {
  value: string;
  label?: string;
  onClick?: () => void;
  expanded?: boolean;
}

const ColorCard = ({ value, label, expanded, onClick }: Props) => {
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

  return (
    <Tooltip content={label}>
      <button
        css={[
          sharedColorContainerStyles,
          colorCardButtonStyles,
          expanded && colorCardButtonFocusedStyles,
        ]}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        aria-label={label}
        aria-expanded={expanded}
        aria-haspopup
        type="button"
      >
        <span
          css={colorCardContentStyles}
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
  width: `${COLOR_CARD_SIZE}px`,
  height: `${COLOR_CARD_SIZE}px`,
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

const colorCardButtonStyles = css({
  ':hover': {
    borderColor: token('color.background.neutral.subtle', N0),
  },
  ':not(:focus):hover, :focus': {
    borderColor: token('color.border.focused', B100),
  },
});

const colorCardButtonFocusedStyles = css({
  borderColor: token('color.border.focused', B100),
});

const colorCardContentStyles = css({
  position: 'absolute',
  top: '1px',
  left: '1px',
  width: token('space.300', '24px'),
  height: token('space.300', '24px'),
  borderRadius: token('border.radius.100', '3px'),
  boxShadow: `inset 0px 0px 0px 1px ${token(
    'color.background.inverse.subtle',
    DN600A,
  )}`,
});
