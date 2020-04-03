import styled from 'styled-components';
import { containerClosedWidth } from '../../shared-variables';
import { isElectronMac } from '../../theme/util';

const getTransform = ({ horizontalOffset }) => {
  if (!horizontalOffset || horizontalOffset === 0) {
    return '';
  }
  return `transform: translateX(${horizontalOffset}px);`;
};

const NavigationContainerNavigationWrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  /* allowing the container to collapse down to its min width */
  min-width: ${props => containerClosedWidth(isElectronMac(props.theme))}px;
  ${getTransform} display: flex;
`;

NavigationContainerNavigationWrapper.displayName =
  'NavigationContainerNavigationWrapper';

export default NavigationContainerNavigationWrapper;
