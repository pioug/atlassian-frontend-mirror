import React from 'react';
import { MenuListComponentProps, OptionProps } from '@atlaskit/select';
import { Color } from '../types';
import ColorCard from './ColorCard';
import { getWidth } from '../utils';
import {
  ColorPaletteContainer,
  ColorCardWrapper,
} from '../styled/ColorPalette';

export const MenuList = (props: MenuListComponentProps<Color>) => {
  const {
    cx,
    selectProps: { cols },
    innerRef,
    ...rest
  } = props;

  return (
    <ColorPaletteContainer
      role="grid"
      style={{
        maxWidth: cols ? getWidth(cols) : undefined,
      }}
      innerRef={innerRef!}
      {...rest}
    />
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
    // @ts-expect-error - known issue: https://github.com/mui/material-ui/issues/13921. TS treats styled components to be different from HTMLDivElement
    <ColorCardWrapper {...innerProps}>
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
    </ColorCardWrapper>
  );
};

export const DropdownIndicator = () => null;

export const Placeholder = () => null;
