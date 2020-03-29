import styled from 'styled-components';
import NavigationItemAfter from './NavigationItemAfter';
import { whenCollapsed } from '../../theme/util';

const NavigationDropItemAfter = styled(NavigationItemAfter)`
  ${whenCollapsed`
    display: none;
  `};
`;

NavigationDropItemAfter.displayName = 'NavigationDropItemAfter';
export default NavigationDropItemAfter;
