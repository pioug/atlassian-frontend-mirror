/* eslint-disable react/prop-types */
import React from 'react';

import ScrollHintWrapper from '../styled/ScrollHintWrapper';
import ScrollHintScrollContainer from '../styled/ScrollHintScrollContainer';

const ContainerNavigationChildren = ({
  children,
  hasScrollHintTop,
  scrollRef,
}) => (
  <ScrollHintWrapper hasScrollHintTop={hasScrollHintTop}>
    <ScrollHintScrollContainer innerRef={scrollRef}>
      {children}
    </ScrollHintScrollContainer>
  </ScrollHintWrapper>
);
ContainerNavigationChildren.displayName = 'ContainerNavigationChildren';
export default ContainerNavigationChildren;
