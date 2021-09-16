import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';

export const EmptyViewWithFixedHeight = styled.div`
  height: ${gridSize() * 18}px;
`;

export const EmptyViewContainer = styled.div`
  margin: auto;
  padding: 10px;
  text-align: center;
  width: 50%;
`;
