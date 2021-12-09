import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';

export const BottomMessageWrapper = styled.div`
  width: ${gridSize() * 44}px;
`;

export const CustomFooterWrapper = styled.div`
  /* Must match inline dialog padding. */
  margin: 0 ${-gridSize() * 3}px ${-gridSize() * 2}px ${-gridSize() * 3}px;
`;

export const SpinnerWrapper = styled.div`
  widht: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
`;
