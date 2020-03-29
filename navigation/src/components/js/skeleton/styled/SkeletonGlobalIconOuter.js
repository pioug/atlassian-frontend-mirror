import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';
import { divide } from '@atlaskit/theme/math';

const SkeletonGlobalIconOuter = styled.div`
  margin-bottom: ${divide(gridSize, 2)}px;

  &:last-child {
    margin-bottom: 0;
  }
`;

SkeletonGlobalIconOuter.displayName = 'SkeletonGlobalIconOuter';
export default SkeletonGlobalIconOuter;
