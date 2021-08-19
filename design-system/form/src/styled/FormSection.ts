import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';
import { h600 } from '@atlaskit/theme/typography';

/**
 * Provide a styled container for form sections.
 */
const FormSectionWrapper = styled.div`
  margin-top: ${gridSize() * 3}px;
`;

/**
 * Provide a styled container for form section title
 */
const FormSectionTitle = styled.h3`
  ${h600};
  line-height: ${gridSize() * 4}px;
  margin-right: ${gridSize() * 4}px;
  margin-top: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Provide a styled container for form section content.
 */
const FormSectionDescription = styled.div`
  margin-top: ${gridSize()}px;
`;

export default FormSectionWrapper;
export { FormSectionTitle, FormSectionDescription };
