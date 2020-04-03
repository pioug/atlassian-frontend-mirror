import styled from 'styled-components';

import {
  containerOpenWidth,
  containerClosedWidth,
} from '../../../../shared-variables';
import { getProvided } from '../../../../theme/util';

const SkeletonContainerNavigationInner = styled.div`
  height: 100%;
  width: ${({ isCollapsed }) =>
    isCollapsed ? containerClosedWidth() : containerOpenWidth}px;
  color: ${({ theme }) => getProvided(theme).text};
  background-color: ${({ theme }) => {
    const { background } = getProvided(theme);
    return background.secondary || background.primary;
  }};
`;

SkeletonContainerNavigationInner.displayName =
  'SkeletonContainerNavigationInner';
export default SkeletonContainerNavigationInner;
