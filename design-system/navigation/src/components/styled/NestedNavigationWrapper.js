/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { scrollHintSpacing, gridSize } from '../../shared-variables';
import { whenCollapsed } from '../../theme/util';

const NestedNavigation = ({ traversalDirection, children, ...props }) => (
  // Don't pass the traversalDirection prop to the TransitionGroup
  // eslint-disable-next-line no-unused-vars
  <TransitionGroup {...props}>{children}</TransitionGroup>
);

const NestedNavigationWrapper = styled(NestedNavigation)`
  display: flex;
  flex-direction: ${({ traversalDirection }) =>
    traversalDirection === 'up' ? 'row' : 'row-reverse'};
  /* take up the full height - desirable when using drag-and-drop in nested nav */
  flex-grow: 1;
  flex-wrap: nowrap;
  /* Set height so NestedNavigationPages height 100% matches this height */
  height: 100%;
  /* pull scrollbar to the edge of the container nav */
  margin-right: -${scrollHintSpacing}px;
  max-height: 100%;
  /* make sure the wrapper doesn't scroll - each page should be an independent scroll container */
  overflow: hidden;

  ${whenCollapsed`
    margin-right: -${gridSize}px;
  `};
`;

NestedNavigationWrapper.displayName = 'NestedNavigationWrapper';

export default NestedNavigationWrapper;
