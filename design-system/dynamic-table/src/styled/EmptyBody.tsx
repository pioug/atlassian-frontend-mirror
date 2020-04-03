import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';

export const EmptyViewWithFixedHeight = styled.div`
  height: ${multiply(gridSize, 18)}px;
`;

export const EmptyViewContainer = styled.div`
  margin: auto;
  padding: 10px;
  text-align: center;
  width: 50%;
`;
