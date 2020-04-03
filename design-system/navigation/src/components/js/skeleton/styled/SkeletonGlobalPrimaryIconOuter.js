import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';

const SkeletonGlobalPrimaryIconOuter = styled.div`
  margin-bottom: ${multiply(gridSize, 1.5)}px;
`;

SkeletonGlobalPrimaryIconOuter.displayName = 'SkeletonGlobalPrimaryIconOuter';
export default SkeletonGlobalPrimaryIconOuter;
