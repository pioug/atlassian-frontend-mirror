import styled from 'styled-components';
import { layout } from '../../shared-variables';
import {
  getProvided,
  isElectronMac,
  electronMacTopPadding,
} from '../../theme/util';

const getTopPadding = props =>
  layout.padding.top + (isElectronMac(props.theme) ? electronMacTopPadding : 0);

const ContainerNavigationInner = styled.div`
  background-color: ${({ theme }) => {
    const { background } = getProvided(theme);
    if (background.secondary) {
      return background.secondary;
    }

    return background.primary;
  }};
  color: ${({ theme }) => getProvided(theme).text};
  display: flex;
  flex-direction: column;
  padding-top: ${getTopPadding}px;
  /* fill the entire space of the flex container */
  width: 100%;
`;

ContainerNavigationInner.displayName = 'ContainerNavigationInner';

export default ContainerNavigationInner;
