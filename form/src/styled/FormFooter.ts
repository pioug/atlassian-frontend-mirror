import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';
import { Align } from '../types';

/**
 * Provide a styled container for form headers.
 */
export const FormFooterWrapper = styled.footer<{ align?: Align }>`
  margin-top: ${multiply(gridSize, 3)}px;
  display: flex;
  justify-content: ${props =>
    props.align === 'start' ? 'flex-start' : 'flex-end'};
`;
