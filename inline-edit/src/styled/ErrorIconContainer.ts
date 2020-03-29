import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';

const ErrorIconContainer = styled.div`
  line-height: 100%;
  padding-right: ${gridSize() - 2}px;
`;

ErrorIconContainer.displayName = 'ErrorIconContainer';

export default ErrorIconContainer;
