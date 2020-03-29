import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';
import { divide } from '@atlaskit/theme/math';

const SkeletonDefaultContainerHeaderInner = styled.div`
  display: flex;
  align-items: center;
  margin: ${props =>
      props.isAvatarHidden ? gridSize() * 2 : divide(gridSize, 2)}px
    ${gridSize()}px 0 ${gridSize()}px;
`;

SkeletonDefaultContainerHeaderInner.displayName =
  'SkeletonDefaultContainerHeaderInner';
export default SkeletonDefaultContainerHeaderInner;
