import styled from 'styled-components';
import { globalOpenWidth, layout } from '../../shared-variables';
import {
  getProvided,
  isElectronMac,
  electronMacTopPadding,
} from '../../theme/util';

const getTopPadding = props =>
  layout.padding.top + (isElectronMac(props.theme) ? electronMacTopPadding : 0);

const GlobalNavigationInner = styled.div`
  align-items: center;
  color: ${({ theme }) => getProvided(theme).text};
  background-color: ${({ theme }) => getProvided(theme).background.primary};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: ${getTopPadding}px 0 ${layout.padding.bottom}px;
  /* always keeping a fixed width so that the ContainerNavigation bleeds over the top of this */
  width: ${props => globalOpenWidth(isElectronMac(props.theme))}px;
`;

GlobalNavigationInner.displayName = 'GlobalNavigationInner';
export default GlobalNavigationInner;
