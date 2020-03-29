import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';
import { multiply, divide } from '@atlaskit/theme/math';

const SkeletonContainerItemText = styled.div`
  height: ${multiply(gridSize, 2.5)}px;
  background-color: currentColor;
  border-radius: ${divide(gridSize, 2)}px;
  opacity: 0.15;
  margin-left: ${gridSize() * 3}px;
  width: ${props => props.textWidth || `${gridSize() * 17}px`};
`;

SkeletonContainerItemText.displayName = 'SkeletonContainerItemText';
export default SkeletonContainerItemText;
