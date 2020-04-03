import styled from 'styled-components';
import { gridSize } from '../../shared-variables';
import { whenCollapsed, whenNotInOverflowDropdown } from '../../theme/util';

const NavigationItemGroupAction = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: ${gridSize / 2}px;
  min-width: ${gridSize * 3}px;

  ${whenCollapsed`
    display: none;
  `} ${whenNotInOverflowDropdown`
    margin-top: ${gridSize}px;
  `};
`;

NavigationItemGroupAction.displayName = 'NavigationItemGroupAction';
export default NavigationItemGroupAction;
