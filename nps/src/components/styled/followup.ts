import styled from 'styled-components';
import { gridSize, fontSize } from '@atlaskit/theme/constants';
import { text } from '@atlaskit/theme/colors';

export const Contact = styled.div`
  margin-top: ${gridSize() * 2}px;
`;

export const RoleQuestion = styled.div`
  font-size: ${fontSize}px;
  color: ${text};
`;
