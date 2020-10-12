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
    selectProps: { checkMarkColor },
    isFocused,
    isSelected,
  } = props;

  return (
    <ColorCardWrapper {...props.innerProps}>
      <ColorCard
        label={label}
        value={value}
        checkMarkColor={checkMarkColor}
        isOption
        focused={isFocused}
        selected={isSelected}
      />
    </ColorCardWrapper>
  );
};

export const DropdownIndicator = () => null;

export const Placeholder = () => null;
