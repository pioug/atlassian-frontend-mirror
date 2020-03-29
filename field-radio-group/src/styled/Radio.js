import styled, { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';

export const HiddenInput = styled.input`
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
  height: 1;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1;
  opacity: 0;
`;

const disabledColor = themed({ light: colors.N80, dark: colors.N80 });

export const Label = styled.label`
  display: 'block';
  color: ${props =>
    props.isDisabled ? disabledColor(props) : colors.text(props)};
  ${({ isDisabled }) =>
    isDisabled
      ? css`
          cursor: not-allowed;
        `
      : ''};
`;

const borderColor = themed({ light: colors.N40, dark: colors.DN80 });
const focusBorder = css`
  stroke: ${themed({ light: colors.B100, dark: colors.B75 })};
  stroke-width: 2px;
`;
const invalidBorder = css`
  stroke: ${themed({ light: colors.R300, dark: colors.R300 })};
  stroke-width: 2px;
`;
const activeBorder = css`
  stroke: currentColor;
  stroke-width: 2px;
`;
const selectedBorder = css`
  stroke: currentColor;
  stroke-width: 2px;
`;
const border = css`
  stroke: ${({ isHovered, ...rest }) =>
    isHovered
      ? themed({ light: colors.N40, dark: colors.DN200 })(rest)
      : borderColor(rest)};
  stroke-width: 2px;
`;

const getBorderColor = props => {
  if (props.isDisabled) return '';
  if (props.isFocused) return focusBorder;
  if (props.isActive) return activeBorder;
  if (props.isInvalid) return invalidBorder;
  if (props.isSelected) return selectedBorder;
  return border;
};

const getDotColor = props => {
  const { isSelected, isDisabled, isActive, ...rest } = props;

  let color = themed({ light: colors.N10, dark: colors.DN10 });

  if (isDisabled && isSelected) {
    color = themed({ light: colors.N70, dark: colors.DN90 });
  } else if (isActive && isSelected && !isDisabled) {
    color = themed({ light: colors.B400, dark: colors.DN10 });
  } else if (!isSelected) {
    color = themed({ light: 'transparent', dark: 'transparent' });
  }
  return color(rest);
};

const getCircleColor = props => {
  const { isSelected, isDisabled, isActive, isHovered, ...rest } = props;

  // set the default
  let color = themed({ light: colors.N10, dark: colors.DN10 });

  if (isDisabled) {
    color = themed({ light: colors.N20, dark: colors.DN10 });
  } else if (isActive) {
    color = themed({ light: colors.B50, dark: colors.B200 });
  } else if (isHovered && isSelected) {
    color = themed({ light: colors.B300, dark: colors.B75 });
  } else if (isHovered) {
    color = themed({ light: colors.N30, dark: colors.DN30 });
  } else if (isSelected) {
    color = themed({ light: colors.B400, dark: colors.B400 });
  }
  return color(rest);
};

export const IconWrapper = styled.span`
  line-height: 0;
  flex-shrink: 0;
  color: ${getCircleColor};
  fill: ${getDotColor};
  transition: all 0.2s ease-in-out;

  /* This is adding a property to the inner svg, to add a border to the radio */
  & circle:first-of-type {
    transition: stroke 0.2s ease-in-out;
    ${getBorderColor};
  }
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;
