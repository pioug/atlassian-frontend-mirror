import styled from 'styled-components';
import { gridSize } from '../../shared-variables';

const DrawerBackIconInner = styled.div`
  align-items: center;
  display: flex;
  transform: ${({ isVisible }) =>
    isVisible ? 'translateX(0)' : `translateX(${-gridSize * 2}px)`};
  transition: transform 220ms;
`;

DrawerBackIconInner.displayName = 'DrawerBackIconInner';
export default DrawerBackIconInner;
