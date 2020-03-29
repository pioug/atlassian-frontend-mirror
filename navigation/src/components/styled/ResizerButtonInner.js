import styled from 'styled-components';
import {
  animationTime,
  animationTimeUnitless,
  unthemedColors,
  gridSize,
  resizerVisibleWidth,
} from '../../shared-variables';
import { focusOutline } from '../../utils/mixins';

const toggleButtonHeight = gridSize * 4.5;
const toggleArrowHeight = gridSize * 2;
const toggleArrowWidth = 2;
const toggleArrowTopVerticalOffset =
  (toggleButtonHeight - toggleArrowHeight) / 2;
const toggleArrowBottomVerticalOffset =
  toggleArrowTopVerticalOffset - toggleArrowWidth + toggleArrowHeight / 2;
const opacityTransition = `opacity ${animationTimeUnitless +
  100}ms ease-in-out ${animationTimeUnitless}ms`;
const transformTransition = `transform ${animationTime} ease-in-out`;

const ResizerButtonInner = styled.button`
  position: relative;
  top: calc(50% - ${toggleButtonHeight / 2}px);
  height: ${toggleButtonHeight}px;
  background: none;
  border: none;
  color: transparent;
  width: ${gridSize * 3}px;
  left: -${resizerVisibleWidth / 2}px;
  cursor: pointer;

  &:focus {
    ${focusOutline(unthemedColors.resizer)};
  }

  &::before,
  &::after {
    content: '';
    background-color: ${unthemedColors.resizer};
    width: ${toggleArrowWidth}px;
    border-radius: ${toggleArrowHeight}px;
    height: ${toggleArrowHeight / 2}px;
    position: absolute;
    left: 8px;
    opacity: ${props => (props.isVisible ? 1 : 0)};
    transition: ${transformTransition}, ${opacityTransition};
    transform: rotate(0deg);
  }

  &::before {
    top: ${toggleArrowTopVerticalOffset}px;
    transform-origin: ${toggleArrowWidth / 2}px
      ${toggleArrowHeight / 2 - toggleArrowWidth / 2}px;
  }

  &::after {
    top: ${toggleArrowBottomVerticalOffset}px;
    transform-origin: ${toggleArrowWidth / 2}px ${toggleArrowWidth / 2}px;
  }

  &:hover,
  &:focus {
    &::before,
    &::after {
      opacity: 1;
    }
    &::before {
      transform: rotate(
        ${({ isPointingRight }) => (isPointingRight ? '-40deg' : '40deg')}
      );
    }
    &::after {
      transform: rotate(
        ${({ isPointingRight }) => (isPointingRight ? '40deg' : '-40deg')}
      );
    }
  }
`;

ResizerButtonInner.displayName = 'ResizerButtonInner';
export default ResizerButtonInner;
