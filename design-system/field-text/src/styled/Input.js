import styled, { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { codeFontFamily, fontSize } from '@atlaskit/theme/constants';
import { N70, DN90, N100 } from '@atlaskit/theme/colors';

const getPlaceholderColor = ({ disabled }) => {
  if (disabled) {
    return themed({ light: N70, dark: DN90 });
  }
  return themed({ light: N100, dark: DN90 });
};

// can't group these placeholder styles into one block because browsers drop
// entire style blocks when any single selector fails to parse
const getPlaceholderStyle = () => css`
  &::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: ${getPlaceholderColor};
  }
  &::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: ${getPlaceholderColor};
    opacity: 1;
  }
  &::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${getPlaceholderColor};
  }
  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${getPlaceholderColor};
  }
`;

// Safari puts on some difficult to remove styles, mainly for disabled inputs
// but we want full control so need to override them in all cases
const overrideSafariDisabledStyles = `
  -webkit-text-fill-color: unset;
  -webkit-opacity: 1;
`;

const InputElement = styled.input`
  background: transparent;
  border: 0;
  box-sizing: border-box;
  color: inherit;
  cursor: inherit;
  font-family: ${(p) => (p.isMonospaced ? codeFontFamily() : 'inherit')};
  font-size: ${fontSize}px;
  min-width: 0;
  outline: none;
  width: 100%;

  [disabled] {
    ${overrideSafariDisabledStyles};
  }

  &::-ms-clear {
    display: none;
  }

  &:invalid {
    box-shadow: none;
  }
  ${getPlaceholderStyle};
`;

export default InputElement;
