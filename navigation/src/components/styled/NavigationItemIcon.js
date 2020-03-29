import styled from 'styled-components';
import { gridSize } from '../../shared-variables';
import { isCollapsed } from '../../theme/util';

const getDisplay = ({ theme, isDropdownTrigger }) => {
  if (isDropdownTrigger && isCollapsed(theme)) {
    return 'none';
  }
  return 'flex';
};

const iconSize = gridSize * 3;

const NavigationItemIcon = styled.div`
  align-items: center;
  justify-content: center;
  display: ${getDisplay};
  flex-shrink: 0;
  transition: padding 200ms;

  > * {
    flex: 1 0 auto;
  }

  /* We need to ensure that any image passed in as a child (<img/>, <svg/>
    etc.) receives the correct width, height and border radius. We don't
    currently assume that the image passed in is the correct dimensions, or has
    width / height 100% */
  > img {
    height: ${iconSize}px;
    width: ${iconSize}px;
  }
`;

NavigationItemIcon.displayName = 'NavigationItemIcon';
export default NavigationItemIcon;
