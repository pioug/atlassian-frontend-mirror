import styled, { keyframes } from 'styled-components';
import {
  widths,
  widthTransition,
  animationTiming,
  animationSpeed,
} from '../../utils/drawer-style-variables';
import { getProvided } from '../../theme/util';
import { zIndex } from '../../shared-variables';

const entryAnimation = offscreenX => keyframes`
  from { transform: translateX(${offscreenX}); }
  to { transform: translateX(0); }
`;

const exitAnimation = offscreenX => keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(${offscreenX}); }
`;

const getAnimation = ({ isOpen, isAnimating, width }) => {
  const offscreenX = widths[width].offScreenTranslateX;
  const animation = isOpen
    ? entryAnimation(offscreenX)
    : exitAnimation(offscreenX);
  if (isAnimating) {
    return `
      animation: ${animation} ${animationSpeed} ${animationTiming} forwards;
    `;
  }

  return `
    animation: none;
    left: ${isOpen ? 0 : offscreenX};
  `;
};

const DrawerInner = styled.div`
  background-color: ${({ theme }) => getProvided(theme).background.tertiary};
  color: ${({ theme }) => getProvided(theme).text};
  display: flex;
  height: 100%;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  transition: ${widthTransition};
  width: ${({ width }) => widths[width].width};
  z-index: ${zIndex.drawer};
  ${getAnimation};
`;

DrawerInner.displayName = 'DrawerInner';
export default DrawerInner;
