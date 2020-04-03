import styled, { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';
import { borderWidth, getHeight, getWidth, transition } from './constants';
import { StyledProps } from '../types';

const colorOptions = {
  bgChecked: themed({ light: colors.G400, dark: colors.G300 }),
  bgCheckedHover: themed({ light: colors.G300, dark: colors.G200 }), // hover go lighter
  bgCheckedDisabled: themed({ light: colors.N20, dark: colors.DN70 }),

  bgUnchecked: themed({ light: colors.N200, dark: colors.DN70 }),
  bgUncheckedHover: themed({ light: colors.N70, dark: colors.DN60 }),
  bgUncheckedDisabled: themed({ light: colors.N20, dark: colors.DN70 }),
};

const getBgColor = ({ isChecked, isDisabled, ...rest }: StyledProps) => {
  let color = colorOptions.bgUnchecked;
  if (isChecked) color = colorOptions.bgChecked;
  if (isDisabled && !isChecked) color = colorOptions.bgUncheckedDisabled;
  if (isDisabled && isChecked) color = colorOptions.bgCheckedDisabled;

  return color(rest);
};
const getHoverStyles = ({ isChecked, isDisabled, ...rest }: StyledProps) => {
  let bgcolor;
  if (!isDisabled) {
    bgcolor = isChecked
      ? colorOptions.bgCheckedHover
      : colorOptions.bgUncheckedHover;
  }

  return css`
    &:hover {
      ${bgcolor
        ? css`
            background-color: ${bgcolor(rest)};
          `
        : ''};
      cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
    }
  `;
};

const getBorderColor = ({ isFocused, ...rest }: StyledProps) =>
  isFocused
    ? themed({ light: colors.B100, dark: colors.B75 })(rest)
    : 'transparent';

export default styled.div`
  background-clip: content-box;
  background-color: ${getBgColor};
  border-radius: ${getHeight}px;
  border: ${borderWidth} solid ${getBorderColor};
  display: block;
  height: ${getHeight}px;
  padding: ${borderWidth};
  position: relative;
  transition: ${transition};
  width: ${getWidth}px;

  ${getHoverStyles};
`;
