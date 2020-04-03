import styled from 'styled-components';
import { gridSize } from '../../shared-variables';

export const actionsMarginTop = gridSize * 2;

const GlobalPrimaryActionsItemsWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: ${actionsMarginTop}px;
`;

GlobalPrimaryActionsItemsWrapper.displayName =
  'GlobalPrimaryActionsItemsWrapper';
export default GlobalPrimaryActionsItemsWrapper;
