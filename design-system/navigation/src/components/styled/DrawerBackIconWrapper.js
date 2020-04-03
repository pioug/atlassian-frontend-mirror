import styled from 'styled-components';
import { isElectronMac, electronMacTopPadding } from '../../theme/util';

const getTopOffset = ({ iconOffset, theme }) =>
  isElectronMac(theme) ? electronMacTopPadding + iconOffset : iconOffset;

const DrawerBackIconWrapper = styled.div`
  /** This needs to be display flex to fix an IE11 bug with position: absolute and a display: flex parent */
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  width: 100%;
  top: ${getTopOffset}px;
`;

DrawerBackIconWrapper.displayName = 'DrawerBackIconWrapper';
export default DrawerBackIconWrapper;
