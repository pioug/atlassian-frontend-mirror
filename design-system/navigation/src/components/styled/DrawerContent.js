import styled from 'styled-components';
import { layout } from '../../shared-variables';

const DrawerContent = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0 ${layout.padding.side}px;
  width: 100%;
  overflow-y: auto;
`;

DrawerContent.displayName = 'DrawerContent';
export default DrawerContent;
