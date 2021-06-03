import styled, { css } from 'styled-components';

import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { placeholderText, text } from '@atlaskit/theme/colors';

const gridSizeUnitless = gridSize();

const lineHeightDefault = (gridSizeUnitless * 2) / fontSize();

const getPlaceholderStyle = (style) => css`
  &::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    ${style};
  }
  &::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    ${style} opacity: 1;
  }
  &::-ms-input-placeholder {
    /* Microsoft Edge */
    ${style};
  }
  &:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    ${style} opacity: 1;
  }
  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    ${style};
  }
`;
const getPlaceholderColor = css`
  color: ${placeholderText};
`;

const Content = styled.div`
  flex: 1 1 auto;
  margin: 3px ${gridSizeUnitless}px; /* magic number to make multi-select the same height as field-text. */
  white-space: nowrap;
  width: 100%;
`;

const Expand = styled.div`
  align-items: center;
  display: flex;
  flex: 0 0 ${gridSizeUnitless * 3}px;
  justify-content: center;
  margin: 0 ${gridSizeUnitless}px;
`;

const Input = styled.input`
  display: inline-block;
  flex: 1 0 10px;
  margin: 0;
  padding: 0;
  outline: 0;
  border: 0;
  background: none;
  align-self: center;
  font-size: ${fontSize}px;
  line-height: ${lineHeightDefault};
  color: ${text};

  ${getPlaceholderStyle(getPlaceholderColor)};
`;

const TriggerDiv = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
  min-height: 37px; /* magic number to make multi-select the same height as field-text. */

  ${({ isDisabled }) =>
    isDisabled
      ? css`
          cursor: not-allowed;
        `
      : ''};
`;

export { Content, Expand, TriggerDiv, Input };
