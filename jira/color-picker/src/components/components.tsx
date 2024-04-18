/** @jsx jsx */
import { MenuListComponentProps, OptionProps } from '@atlaskit/select';
import { Color } from '../types';
import ColorCard from './ColorCard';
import { getWidth } from '../utils';
import { COLOR_CARD_SIZE } from '../constants';
import { token } from '@atlaskit/tokens';
import { css, jsx } from '@emotion/react';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export const MenuList = (props: MenuListComponentProps<Color>) => {
  const {
    selectProps: { cols },
    innerRef,
    children,
  } = props;

  return (
    <div
      css={colorPaletteContainerStyles}
      role="radiogroup"
      style={{
        maxWidth: cols ? getWidth(cols) : undefined,
      }}
      ref={innerRef!}
    >
      {children}
    </div>
  );
};

export const Option = (props: OptionProps<Color>) => {
  const {
    data: { value, label },
    selectProps: { checkMarkColor, onOptionKeyDown, isTabbing },
    isFocused,
    isSelected,
    innerProps,
  } = props;

  return (
    <div
      css={
        getBooleanFF(
          'platform.design-tokens-color-picker-portfolio-plan-wizard_w8rcl',
        )
          ? colorCardWrapperStyles
          : colorCardWrapperStylesOld
      }
      {...innerProps}
    >
      <ColorCard
        label={label}
        value={value}
        checkMarkColor={checkMarkColor}
        isOption
        focused={isFocused}
        selected={isSelected}
        onKeyDown={(value) => onOptionKeyDown(value)}
        isTabbing={isTabbing}
      />
    </div>
  );
};

export const DropdownIndicator = () => null;

export const Placeholder = () => null;

const colorCardWrapperStylesOld = css({
  display: 'flex',
  margin: token('space.025', '2px'),
  height: `${COLOR_CARD_SIZE}px`,
});

const colorCardWrapperStyles = css({
  display: 'flex',
  margin: token('space.025', '2px'),
  height: token('space.400', '32px'),
});

const colorPaletteContainerStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  padding: token('space.050', '4px'),
});
