import styled from 'styled-components';

import { R400 } from '@atlaskit/theme/colors';
import { fontFamily, gridSize } from '@atlaskit/theme/constants';
import { h200 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

/**
 * Provide a styled container for field components
 */
const FieldWrapper = styled.div`
  margin-top: ${gridSize}px;
`;

/**
 * Provide a styled Label for field components
 */
export const Label = styled.label`
  ${h200()}
  display: inline-block;
  font-family: ${fontFamily()};
  margin-bottom: ${gridSize() * 0.5}px;
  margin-top: 0;
`;

export const RequiredIndicator = styled.span`
  color: ${token('color.text.danger', R400)};
  font-family: ${fontFamily()};
  padding-left: ${gridSize() * 0.25}px;
`;

export default FieldWrapper;
