import styled from 'styled-components';
import { layout } from '../../shared-variables';
import { isElectronMac, electronMacTopPadding } from '../../theme/util';

const getTopPadding = props =>
  layout.padding.top + (isElectronMac(props.theme) ? electronMacTopPadding : 0);

const DrawerMain = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: ${getTopPadding}px 0 0;
  overflow-y: auto;
  width: 100%;
`;

DrawerMain.displayName = 'DrawerMain';
export default DrawerMain;
