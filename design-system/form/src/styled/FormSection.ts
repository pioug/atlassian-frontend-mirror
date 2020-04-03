import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';
import { h600 } from '@atlaskit/theme/typography';

/**
 * Provide a styled container for form sections.
 */
const FormSectionWrapper = styled.div`
  margin-top: ${multiply(gridSize, 3)}px;
`;

/**
 * Provide a styled container for form section title
 */
const FormSectionTitle = styled.h2`
  ${h600};
  line-height: ${multiply(gridSize, 4)}px;
  margin-right: ${multiply(gridSize, 4)}px;
  margin-top: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Provide a styled container for form section content.
 */
const FormSectionDescription = styled.div`
  margin-top: ${gridSize}px;
`;

export default FormSectionWrapper;
export { FormSectionTitle, FormSectionDescription };
