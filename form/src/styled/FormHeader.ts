import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';
import { h700 } from '@atlaskit/theme/typography';

/**
 * Provide a styled container for form headers.
 */
const FormHeaderWrapper = styled.div``;

/**
 * Provide a styled container for form header title.
 */
const FormHeaderTitle = styled.h1`
  ${h700};
  line-height: ${multiply(gridSize, 4)}px;
  margin-right: ${multiply(gridSize, 4)}px;
  margin-top: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Provide a styled container for form header title.
 */
const FormHeaderDescription = styled.div`
  margin-top: ${gridSize}px;
`;

/**
 * Provide a styled container for form header content.
 */
const FormHeaderContent = styled.div`
  min-width: 100%;
  margin-top: ${gridSize}px;
`;

export default FormHeaderWrapper;
export { FormHeaderTitle, FormHeaderDescription, FormHeaderContent };
