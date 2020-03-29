import styled from 'styled-components';
import { gridSize } from '../../shared-variables';

const DrawerTriggerInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  background: none;
  border: none;
  border-radius: 50%;
  padding: 0;
  width: ${gridSize * 5}px;
  height: ${gridSize * 5}px;
  outline: none;
`;

DrawerTriggerInner.displayName = 'DrawerTriggerInner';
export default DrawerTriggerInner;
