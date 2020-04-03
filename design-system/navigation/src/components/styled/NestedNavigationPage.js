import styled, { keyframes } from 'styled-components';
import {
  animationTimeUnitless,
  scrollHintSpacing,
  gridSize,
} from '../../shared-variables';
import ScrollHintScrollContainer from './ScrollHintScrollContainer';
import { whenCollapsed } from '../../theme/util';

const animationTime = animationTimeUnitless / 1000;

export const getAnimation = ({ transitionState, traversalDirection }) =>
  transitionState === 'entering' || transitionState === 'exiting'
    ? `animation: ${animationTime}s ${keyframes`
      from { transform: translateX(${
        traversalDirection === 'down' ? 100 : -100
      }%); }
      to { transform: translateX(0); }
    `};`
    : null;

// Use the same scrollbar styling as the main container navigation
const NestedNavigationPage = styled(ScrollHintScrollContainer)`
  ${getAnimation} flex-shrink: 0;
  /* we want each page to have internal scrolling */
  overflow-y: auto;
  /* The parent container nav scroll container already sets padding left/right.
   * Set extra padding right to account for the negative margin-right that is set
   * on NestedNavigationWrapper to pull the scrollbar over to the edge of the nav
   */
  padding-left: 0;
  padding-right: ${scrollHintSpacing}px;

  ${whenCollapsed`
    padding-right: ${gridSize}px;
  `};
`;

NestedNavigationPage.displayName = 'NestedNavigationPage';

export default NestedNavigationPage;
