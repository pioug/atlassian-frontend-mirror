import styled from 'styled-components';
import { drawerBackIconSize } from '../../utils/drawer-style-variables';
import { getProvided } from '../../theme/util';

const DrawerBackIconOuter = styled.div`
  background-color: ${({ theme }) =>
    getProvided(theme).item.default.background};
  border-radius: 50%;
  color: ${({ theme }) => getProvided(theme).text};
  cursor: pointer;
  display: flex;
  height: ${drawerBackIconSize}px;
  justify-content: center;
  width: ${drawerBackIconSize}px;

  &:active {
    background-color: ${({ theme }) =>
      getProvided(theme).item.active.background};
  }
`;

DrawerBackIconOuter.displayName = 'DrawerBackIconOuter';
export default DrawerBackIconOuter;
