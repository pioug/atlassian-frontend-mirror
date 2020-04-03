import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';
import { multiply, divide } from '@atlaskit/theme/math';

const SkeletonContainerHeaderText = styled.div`
  height: ${multiply(gridSize, 2.5)}px;
  background-color: currentColor;
  border-radius: ${divide(gridSize, 2)}px;
  opacity: 0.3;
  ${props => !props.isAvatarHidden && `margin-left: ${gridSize() * 2}px`};
  width: ${gridSize() * 18}px;
`;

SkeletonContainerHeaderText.displayName = 'SkeletonContainerHeaderText';
export default SkeletonContainerHeaderText;
