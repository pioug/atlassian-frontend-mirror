import styled, { css } from 'styled-components';
import { codeFontFamily, fontSize, gridSize } from '@atlaskit/theme/constants';
import { ThemeTokens } from '../theme';
import { Props } from '../components/TextArea';

type StyleProps = Props & ThemeTokens & { isFocused: boolean; none?: any };

const grid = gridSize();
const borderRadius = '3px';
const borderWidth = 2;
const lineHeightBase = grid * 2.5;
const lineHeightCompact = grid * 2;
const getLineHeight = ({ isCompact }: Pick<Partial<Props>, 'isCompact'>) =>
  isCompact ? lineHeightCompact : lineHeightBase;
const getVerticalPadding = ({ isCompact }: Pick<Partial<Props>, 'isCompact'>) =>
  isCompact ? 2 : 6;
const horizontalPadding = grid;
const transitionDuration = '0.2s';

const getBorderStyle = (props: StyleProps) =>
  props.appearance === 'none' ? 'none;' : 'solid;';

const getPlaceholderStyle = (style: typeof getPlaceholderColor) => css`
  &::placeholder {
    ${style}
  }
`;

const getPlaceholderColor = css<ThemeTokens>`
  color: ${props => props.placeholderTextColor};
`;

// Safari puts on some difficult to remove styles, mainly for disabled inputs
// but we want full control so need to override them in all cases
const overrideSafariDisabledStyles = `
  -webkit-text-fill-color: unset;
  -webkit-opacity: 1;
`;

const getBorderAndPadding = () => {
  return css`
    border-width: ${borderWidth}px;
    padding: ${getVerticalPadding}px ${horizontalPadding - borderWidth}px;
  `;
};

const getHoverState = (props: StyleProps) => {
  if (props.isReadOnly || props.isFocused || props.none) {
    return null;
  }
  let backgroundColorHover = props.backgroundColorHover;
  if (props.isDisabled) {
    backgroundColorHover = props.disabledRules.backgroundColorHover;
  }
  if (props.isInvalid) {
    backgroundColorHover = props.invalidRules.backgroundColorHover;
  }
  return css`
    &:hover {
      background-color: ${backgroundColorHover};
    }
  `;
};

const getMinimumRowsHeight = ({ minimumRows = 1, isCompact }: Props) => {
  const lineHeight = getLineHeight({ isCompact });
  return `min-height: ${lineHeight * minimumRows}px;`;
};

const getResizeStyles = ({ resize }: Props) => {
  if (resize === 'auto') {
    return `resize: auto;`;
  }
  if (resize === 'horizontal') {
    return `resize: horizontal;`;
  }
  if (resize === 'vertical') {
    return `resize: vertical;`;
  }
  return `resize: none;`;
};

const getBorderColor = (props: StyleProps) => {
  let borderColor = props.isFocused
    ? props.borderColorFocus
    : props.borderColor;
  if (props.isDisabled) {
    borderColor = props.isFocused
      ? props.disabledRules.borderColorFocus
      : props.disabledRules.borderColor;
  }
  if (props.isInvalid) {
    borderColor = props.isFocused
      ? props.invalidRules.borderColorFocus
      : props.invalidRules.borderColor;
  }
  return borderColor;
};

const getBackgroundColor = (props: StyleProps) => {
  let backgroundColor = props.isFocused
    ? props.backgroundColorFocus
    : props.backgroundColor;
  if (props.isDisabled) {
    backgroundColor = props.isFocused
      ? props.disabledRules.backgroundColorFocus
      : props.disabledRules.backgroundColor;
  }
  if (props.isInvalid) {
    backgroundColor = props.isFocused
      ? props.invalidRules.backgroundColorFocus
      : props.invalidRules.backgroundColor;
  }
  return backgroundColor;
};

export const TextAreaWrapper = styled.div<StyleProps>`
  flex: 1 1 100%;
  position: relative;
  background-color: ${getBackgroundColor};
  border-color: ${getBorderColor};
  border-radius: ${borderRadius};
  border-style: ${getBorderStyle};
  box-sizing: border-box;
  overflow: auto;
  transition: background-color ${transitionDuration} ease-in-out,
    border-color ${transitionDuration} ease-in-out;
  word-wrap: break-word;
  ${getBorderAndPadding}
  ${getHoverState}
  ${props => props.isDisabled && `cursor: not-allowed;`}
  font-size: ${fontSize}px;
  max-height: ${props => props.maxHeight};
  max-width: 100%;
  ${getResizeStyles}
  & > textarea {
    display:block;
    resize: none;
    background: transparent;
    margin: 0;
    border: 0;
    box-sizing: border-box;
    color: ${({ isDisabled, textColor, disabledRules }) =>
      isDisabled ? disabledRules.textColor : textColor};
    ${({ isDisabled }) => (isDisabled ? 'pointer-events: none;' : null)}
    cursor: inherit;
    font-family: ${props =>
      props.isMonospaced ? codeFontFamily() : 'inherit'};
    font-size: inherit;
    line-height: ${({ isCompact }) =>
      getLineHeight({ isCompact }) / fontSize()};
    min-width: 0;
    outline: none;
    overflow: auto;
    max-width: 100%;
    width: 100%;
    padding: 0;
    ${getPlaceholderStyle(getPlaceholderColor)};
    ${getMinimumRowsHeight}

    &[disabled] {
      ${overrideSafariDisabledStyles};
    }
    &::-ms-clear {
      display: none;
    }

    &:invalid {
      box-shadow: none;
    }
  }
`;
