import styled from 'styled-components';
import {
  animationTimeUnitless,
  unthemedColors,
  resizerClickableWidth,
  resizerVisibleWidth,
} from '../../shared-variables';

const ResizerInner = styled.div`
  cursor: ew-resize;
  height: 100%;

  /* position: absolute so that it will not effect the width of the navigation */
  position: absolute;

  right: -${resizerClickableWidth}px;
  width: ${resizerClickableWidth}px;

  &::before {
    content: '';
    height: 100%;
    left: -${resizerVisibleWidth / 2}px;
    position: absolute;
    transition: background-color ${animationTimeUnitless + 100}ms ease-in-out
      ${animationTimeUnitless}ms;
    width: ${resizerVisibleWidth}px;
  }
  &:hover::before {
    background: ${unthemedColors.resizer};
  }
`;

ResizerInner.displayName = 'ResizerInner';
export default ResizerInner;
