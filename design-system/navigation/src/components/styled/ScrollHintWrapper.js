import styled from 'styled-components';
import { getProvided, whenNotCollapsed } from '../../theme/util';
import {
  scrollBarSize,
  scrollHintSpacing,
  scrollHintHeight,
} from '../../shared-variables';

const doubleIfNotWebkit = width =>
  width *
  (typeof window !== 'undefined' &&
  window.navigator &&
  window.navigator.userAgent.indexOf('AppleWebKit') >= 0
    ? 1
    : 2);

const ContainerNavigationChildrenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  overflow: hidden;
  /* Position relative is required so products can position fixed items at top or bottom
   * of the container scrollable area. */
  position: relative;

  ${whenNotCollapsed`
    &:before,
    &:after {
      background: ${({ theme }) => getProvided(theme).keyline};
      display: block;
      flex: 0;
      height: ${scrollHintHeight}px;
      left: ${scrollHintSpacing}px;
      position: absolute;
      z-index: 1;

      // Because we are using a custom scrollbar for WebKit in ScrollHintScrollContainer, the
      // right margin needs to be calculated based on whether that feature is in use.
      right: ${scrollHintSpacing + doubleIfNotWebkit(scrollBarSize)}px;
    }

    &:before {
      top: 0;
      content: ${({ hasScrollHintTop }) => (hasScrollHintTop ? "''" : 'none')};
    }
  `};
`;
ContainerNavigationChildrenWrapper.displayName =
  'ContainerNavigationChildrenWrapper';
export default ContainerNavigationChildrenWrapper;
