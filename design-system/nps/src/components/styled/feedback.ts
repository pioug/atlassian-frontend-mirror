import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { subtleText } from '@atlaskit/theme/colors';

export const ScoreContainer = styled.section`
  display: flex;
  align-items: center;
`;

export const Scale = styled.span`
  padding: 0 ${gridSize()}px;
  font-size: 12px;
  color: ${subtleText};
`;

export const Comment = styled.div`
  margin-bottom: ${gridSize()}px;
`;
