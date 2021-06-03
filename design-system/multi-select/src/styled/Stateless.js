import styled, { css } from 'styled-components';
import { gridSize, fontSize } from '@atlaskit/theme/constants';
import { placeholderText } from '@atlaskit/theme/colors';

const lineHeightDefault = (gridSize() * 2) / fontSize();

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

  ${getPlaceholderStyle(getPlaceholderColor)};
`;

const SelectWrapper = styled.div`
  display: inline-block;

  ${({ shouldFitContainer }) =>
    shouldFitContainer
      ? css`
          display: block;
        `
      : css`
          display: inline-block;
        `};
`;

export { Input, SelectWrapper };
