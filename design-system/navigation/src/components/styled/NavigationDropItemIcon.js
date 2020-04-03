import styled from 'styled-components';
import NavigationItemIcon from './NavigationItemIcon';
import { whenCollapsed } from '../../theme/util';

const NavigationDropItemIcon = styled(NavigationItemIcon)`
  padding-right: 0;

  ${whenCollapsed`
    display: none;
  `};
`;

NavigationDropItemIcon.displayName = 'NavigationDropItemIcon';
export default NavigationDropItemIcon;
