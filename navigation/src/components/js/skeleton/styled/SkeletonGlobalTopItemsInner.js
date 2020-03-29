import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';

const SkeletonGlobalTopItemsInner = styled.div`
  margin-bottom: ${gridSize() * 3}px;
`;

SkeletonGlobalTopItemsInner.displayName = 'SkeletonGlobalTopItemsInner';
export default SkeletonGlobalTopItemsInner;
