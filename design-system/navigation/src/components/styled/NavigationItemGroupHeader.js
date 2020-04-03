import styled from 'styled-components';
import { gridSize } from '../../shared-variables';
import {
  getProvided,
  whenCollapsedAndNotInOverflowDropdown,
  whenNotInOverflowDropdown,
} from '../../theme/util';

const NavigationItemGroupHeader = styled.div`
  display: flex;
  ${whenNotInOverflowDropdown`
    margin-left: -${gridSize}px;
    margin-top: ${gridSize * 1.5}px;
  `} ${whenCollapsedAndNotInOverflowDropdown`
    margin-left: -${gridSize}px;
    margin-right: -${gridSize}px;
    margin-top: ${gridSize}px;
    margin-bottom: ${gridSize}px;
    border-top: 1px solid ${({ theme }) => getProvided(theme).keyline};
  `};
`;

NavigationItemGroupHeader.displayName = 'NavigationItemGroupHeader';
export default NavigationItemGroupHeader;
