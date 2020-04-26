import styled from 'styled-components';

import { text } from '@atlaskit/theme/colors';
import { fontSize, gridSize } from '@atlaskit/theme/constants';

export const Contact = styled.div`
  margin-top: ${gridSize() * 2}px;
`;

export const RoleQuestion = styled.div`
  font-size: ${fontSize}px;
  color: ${text};
`;
