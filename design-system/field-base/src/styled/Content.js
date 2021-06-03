import styled, { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { gridSize, fontSize } from '@atlaskit/theme/constants';
import { N70, DN90, N900, DN600 } from '@atlaskit/theme/colors';
import {
  getBackgroundColor,
  getBackgroundColorFocus,
  getBackgroundColorHover,
  getBorderColor,
  getBorderColorFocus,
} from './theme';

const borderRadius = '3px';
const borderWidth = 2;
const grid = gridSize();
const lineHeightBase = grid * 2.5;
const lineHeightCompact = grid * 2;
const heightBase = grid * 5;
const heightCompact = grid * 4;
const horizontalPadding = grid;
const innerHeight = grid * 3;
const transitionDuration = '0.2s';

const getBorderAndPadding = ({ paddingDisabled, compact }) => {
  const height = compact ? heightCompact : heightBase;

  const padding = paddingDisabled
    ? `0`
    : `${(height - 2 * borderWidth - innerHeight) / 2}px ${
        horizontalPadding - borderWidth
      }px`;

  return css`
    border-width: ${borderWidth}px;
    padding: ${padding};
  `;
};

const getLineHeight = (props) => {
  const currentLineHeight = props.compact ? lineHeightCompact : lineHeightBase;

  return currentLineHeight / fontSize();
};

const getDisabledColor = themed({ light: N70, dark: DN90 });

const getDisabledState = (props) =>
  props.disabled &&
  css`
    color: ${getDisabledColor(props)};
    pointer-events: none;
  `;

const getHoverState = (props) => {
  if (props.readOnly || props.isFocused || props.none) return null;

  return css`
    &:hover {
      background-color: ${getBackgroundColorHover(props)};
    }
  `;
};

const getBorderStyle = (props) =>
  props.appearance === 'none' ? 'none' : 'solid';

const getMinHeight = ({ compact }) => {
  const minHeight = compact ? heightCompact : heightBase;
  return css`
    min-height: ${minHeight}px;
  `;
};

// need an element wrapping the children because IE11 doesn't apply min-height correctly
// to flex-elements. See https://github.com/philipwalton/flexbugs#3-min-height-on-a-flex-container-wont-apply-to-its-flex-items
export const ChildWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  max-width: 100%;
  ${(p) => getMinHeight(p)};
`;

const getColor = themed({ light: N900, dark: DN600 });

export const Content = styled.div`
  align-items: center;
  background-color: ${(props) =>
    props.isFocused
      ? getBackgroundColorFocus(props)
      : getBackgroundColor(props)};
  border-color: ${(props) =>
    props.isFocused ? getBorderColorFocus(props) : getBorderColor(props)};
  border-radius: ${borderRadius};
  border-style: ${getBorderStyle};
  box-sizing: border-box;
  color: ${getColor};
  display: flex;
  flex: 1 0 auto;
  font-size: ${fontSize}px;
  justify-content: space-between;
  line-height: ${getLineHeight};
  max-width: 100%;
  overflow: hidden;
  transition: background-color ${transitionDuration} ease-in-out,
    border-color ${transitionDuration} ease-in-out;
  word-wrap: break-word;
  ${getBorderAndPadding} ${getHoverState} ${getDisabledState};
`;

const getMaxWidth = (maxWidth) => (maxWidth ? `${maxWidth}px` : '100%');

/* IE11 does not respect max-width when using flex-grow + nested flex content, similar to https://github.com/philipwalton/flexbugs#flexbug-11
 * and https://github.com/philipwalton/flexbugs#flexbug-17.
 * This can be fixed by setting the basis to 100%, allowing shrinking and setting the min-width to the original flex-basis value
 * (or 0 if it was auto).
 * Alternatively since we're just setting the contents to fit parent container when grow is set to true, we can just change flex-basis
 * to 100% and not worry about shrinking or growing.
 * See AK-4285.
 */
export const ContentWrapper = styled.div`
  ${(props) =>
    props.disabled &&
    `
      cursor: not-allowed;
    `} ${(props) =>
    props.grow
      ? css`
          flex: 0 0 ${getMaxWidth(props.maxWidth)};
        `
      : `
          flex: 0 0 auto;
        `} ${(props) =>
    props.grow
      ? `
          display: block;
        `
      : `
          display: inline-block;
          vertical-align: top;
        `} max-width: ${(props) => getMaxWidth(props.maxWidth)};
`;
