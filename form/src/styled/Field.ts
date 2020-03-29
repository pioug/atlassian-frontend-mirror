import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { h200 } from '@atlaskit/theme/typography';
import { R400 } from '@atlaskit/theme/colors';
import { multiply } from '@atlaskit/theme/math';

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
  ${h200()} display: inline-block;
  margin-bottom: ${multiply(gridSize, 0.5)}px;
  margin-top: 0;
`;

export const RequiredIndicator = styled.span`
  color: ${R400};
  padding-left: ${multiply(gridSize, 0.25)}px;
`;

export default FieldWrapper;
