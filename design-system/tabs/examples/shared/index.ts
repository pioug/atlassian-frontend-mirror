import styled from 'styled-components';

import { DN10, N20, subtleText } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';

export const Content = styled.div`
  align-items: center;
  background-color: ${themed({ light: N20, dark: DN10 })};
  border-radius: ${borderRadius()}px;
  color: ${subtleText};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font-size: 4em;
  font-weight: 500;
  justify-content: center;
  margin-bottom: ${gridSize()}px;
  margin-top: ${gridSize() * 2}px;
  padding: ${gridSize() * 4}px;
`;
