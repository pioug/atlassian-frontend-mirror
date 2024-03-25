/** @jsx jsx */
import React, { useCallback, useEffect, useRef } from 'react';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import Tooltip from '@atlaskit/tooltip';
import { COLOR_CARD_SIZE, KEY_ENTER, KEY_SPACE } from '../constants';
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N0, DN600A, B75 } from '@atlaskit/theme/colors';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export interface Props {
  value: string;
  label: string;
  onClick?: (value: string) => void;
  onKeyDown?: (value: string) => void;
  checkMarkColor?: string;
  selected?: boolean;
  focused?: boolean;
  isOption?: boolean;
  isTabbing?: boolean;
}

const ColorCard = (props: Props) => {
  const {
    value,
    label,
    selected,
    focused,
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    checkMarkColor = N0,
    isTabbing,
    onClick,
    onKeyDown,
  } = props;

  const ref = useRef<null | HTMLInputElement>(null);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    [],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (onClick) {
        event.preventDefault();
        onClick(value);
      }
    },
    [onClick, value],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const { key } = event;

      if (
        (isTabbing === undefined || isTabbing) &&
        onKeyDown &&
        (key === KEY_ENTER || key === KEY_SPACE)
      ) {
        event.preventDefault();
        if (isTabbing) {
          event.stopPropagation();
        }
        onKeyDown(value);
      }
    },
    [isTabbing, onKeyDown, value],
  );

  useEffect(() => {
    if (
      getBooleanFF('platform.color-picker-radio-button-functionality_6hkcy')
    ) {
      const refCurrent = ref.current;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.stopPropagation();
          e.preventDefault();
        }
      };

      refCurrent?.addEventListener('keydown', handleKeyDown);

      return () => {
        refCurrent?.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  return (
    <Tooltip content={label}>
      <div
        css={[
          sharedColorContainerStyles,
          (isTabbing === undefined || isTabbing) &&
            colorCardOptionTabbingStyles,
          focused && !isTabbing && colorCardOptionFocusedStyles,
        ]}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        role="radio"
        aria-checked={selected}
        aria-label={label}
        tabIndex={0}
        {...(getBooleanFF(
          'platform.color-picker-radio-button-functionality_6hkcy',
        ) && {
          ref: ref,
        })}
      >
        <div
          css={colorCardContentStyles}
          style={{
            background: value || 'transparent',
          }}
        >
          {selected && (
            <div css={colorCardContentCheckMarkStyles}>
              <EditorDoneIcon primaryColor={checkMarkColor} label="" />
            </div>
          )}
        </div>
      </div>
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

const colorCardOptionTabbingStyles = css({
  ':hover, :focus': {
    borderColor: token('color.border.focused', B75),
  },
});

const colorCardOptionFocusedStyles = css({
  borderColor: token('color.border.focused', B75),
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

const colorCardContentCheckMarkStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/use-tokens-space
  margin: '1px',
});
