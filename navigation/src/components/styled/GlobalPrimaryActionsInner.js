import styled from 'styled-components';
import { globalPrimaryActions, gridSize } from '../../shared-variables';

const GlobalPrimaryActionsInner = styled.div`
  box-sizing: border-box;
  padding: ${gridSize}px 0 ${globalPrimaryActions.margin.bottom}px 0;
`;

GlobalPrimaryActionsInner.displayName = 'GlobalPrimaryActionsInner';

export default GlobalPrimaryActionsInner;
