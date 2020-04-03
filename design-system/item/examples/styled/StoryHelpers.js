import styled from 'styled-components';
import { colors, gridSize, math } from '@atlaskit/theme';

export const GroupsWrapper = styled.div`
  padding: ${math.multiply(gridSize, 4)}px;
`;

export const DropImitation = styled.div`
  background: ${colors.N0};
  margin-top: ${gridSize}px;
  width: 300px;
`;

export const ItemsNarrowContainer = styled.div`
  align-items: center;
  background: ${colors.N0};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: ${gridSize}px;
  width: auto;
`;

export const BlockTrigger = styled.div`
  border: 1px solid ${colors.N800};
`;
