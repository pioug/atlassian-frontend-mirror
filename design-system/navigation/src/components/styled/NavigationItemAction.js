import styled from 'styled-components';
import { whenCollapsed } from '../../theme/util';
import { gridSize } from '../../shared-variables';

const NavigationItemAction = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  margin-left: ${gridSize / 2}px;

  ${whenCollapsed`
    flex-shrink: 1;
    margin: 0;
    opacity: 0;
  `};
`;

NavigationItemAction.displayName = 'NavigationItemAction';
export default NavigationItemAction;
