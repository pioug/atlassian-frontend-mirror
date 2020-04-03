import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { N500, DN500 } from '@atlaskit/theme/colors';
import { drawerBackIconSize } from '../../utils/drawer-style-variables';

const DrawerPrimaryIcon = styled.div`
  align-items: center;
  display: flex;
  height: ${drawerBackIconSize}px;
  justify-content: center;
  width: ${drawerBackIconSize}px;
  color: ${themed({ light: N500, dark: DN500 })};
`;

DrawerPrimaryIcon.displayName = 'DrawerPrimaryIcon';
export default DrawerPrimaryIcon;
