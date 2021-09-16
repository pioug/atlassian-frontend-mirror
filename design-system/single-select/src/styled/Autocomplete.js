import styled, { css } from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { heading } from '@atlaskit/theme/colors';
import placeholderStyles from './placeholderStyles';

/* Placeholder has been temporarily inlined until we have a helper library for such things */
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

const AutocompleteWrapper = styled.div`
  flex: 1 1 auto;
  white-space: nowrap;
  padding: 0 ${gridSize}px;
`;
AutocompleteWrapper.displayName = 'SingleSelectAutocompleteWrapper';

const AutocompleteInput = styled.input`
  background: none;
  border: 0;
  color: ${heading};
  font-size: 14px;
  margin: 0;
  min-height: ${gridSize() * 4.5}px;
  outline: 0;
  padding: 0;
  width: 100%;

  ${getPlaceholderStyle(placeholderStyles)};
`;
AutocompleteInput.displayName = 'SingleSelectAutocompleteInput';

export default AutocompleteInput;
export { AutocompleteInput, AutocompleteWrapper };
