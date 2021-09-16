import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

export const GroupsWrapper = styled.div`
  padding: ${gridSize() * 4}px;
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
