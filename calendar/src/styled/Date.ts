import styled, { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';

const getTransparent = themed({ light: 'transparent', dark: 'transparent' });
const selectedBackground = themed({ light: colors.N500, dark: colors.N0 });
const prevSelectedBackground = themed({ light: colors.B50, dark: colors.B50 });

const textDisabled = themed({ light: colors.N40, dark: colors.N40 });
const textHoverSelected = themed({ light: colors.N600, dark: colors.N600 });
const textPreviouslySelected = themed({
  light: colors.N600,
  dark: colors.N600,
});
const textSelected = themed({ light: colors.N0, dark: colors.N700 });
const textSibling = themed({ light: colors.N200, dark: colors.N200 });

const hoverPreviouslySelectedBackground = themed({
  light: colors.B50,
  dark: colors.B50,
});
const isActiveBackground = themed({ light: colors.B50, dark: colors.B50 });
const hoverBackground = themed({ light: colors.N30, dark: colors.N800 });

const getBackgroundColorSelectedAfter = themed({
  light: colors.N700,
  dark: colors.N700,
});

export interface DateProps {
  disabled?: boolean;
  isToday?: boolean;
  sibling?: boolean;
  selected?: boolean;
  previouslySelected?: boolean;
  isActive?: boolean;
  focused?: boolean;
}

const getBackgroundColorsAfter = (props: DateProps) =>
  props.selected
    ? getBackgroundColorSelectedAfter(props)
    : colors.primary(props);

const getBorderColorFocused = themed({ light: colors.B100, dark: colors.B75 });

const getBorderColors = (props: DateProps) =>
  props.focused ? getBorderColorFocused(props) : getTransparent(props);

function getBackgroundColor(props: DateProps) {
  if (props.selected) return selectedBackground(props);
  if (props.previouslySelected) return prevSelectedBackground(props);
  return getTransparent(props);
}

function getColor(props: DateProps) {
  if (props.disabled) return textDisabled(props);
  if (props.selected) return textSelected(props);
  if (props.previouslySelected) return textPreviouslySelected(props);
  if (props.isToday) return colors.primary(props);
  if (props.sibling) return textSibling(props);
  return colors.text(props);
}

function getHoverBackgroundColor(props: DateProps) {
  if (props.disabled) return getTransparent(props);
  if (props.previouslySelected) return hoverPreviouslySelectedBackground(props);
  if (props.isActive) return isActiveBackground(props);
  return hoverBackground(props);
}

const getHoverColor = (props: DateProps) => {
  if (props.sibling) return textSibling(props);
  if (props.disabled) return textDisabled(props);
  if (props.selected || props.previouslySelected || props.isActive)
    return textHoverSelected(props);
  return colors.text(props);
};

export const DateDiv = styled.div<DateProps>`
  background-color: ${getBackgroundColor};
  border: 2px solid ${getBorderColors};
  border-radius: 3px;
  color: ${getColor};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 14px;
  padding: 4px 9px;
  position: relative;
  text-align: center;

  ${props =>
    props.isToday
      ? css`
          font-weight: bold;
          &::after {
            background-color: ${getBackgroundColorsAfter(props)};
            bottom: 2px;
            content: '';
            display: block;
            height: 2px;
            left: 2px;
            position: absolute;
            right: 2px;
          }
        `
      : ''} &:hover {
    background-color: ${getHoverBackgroundColor};
    color: ${getHoverColor};
  }
`;

export const DateTd = styled.td`
  border: 0;
  padding: 0;
  text-align: center;
`;
