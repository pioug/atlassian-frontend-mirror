import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';

const SkeletonContainerItemWrapper = styled.div`
  box-sizing: border-box; /* to make width: 100%; work properly when padding or border is specified - so that item width is not bigger than container width */
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: ${gridSize() * 2}px;
  margin-top: ${gridSize()}px;
  margin-bottom: ${gridSize()}px;
`;

SkeletonContainerItemWrapper.displayName = 'SkeletonContainerItemWrapper';
export default SkeletonContainerItemWrapper;
