import React from 'react';

import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { HoverableContainer } from '../../examples-helpers/hoverableContainer';
import EmptyState from '../../src/ui/issue-like-table/empty-state';
import { ScrollableContainerHeight } from '../../src/ui/issue-like-table/styled';

const Container = styled.div({
  maxHeight: ScrollableContainerHeight,
  padding: token('space.100', '8px'),
});

export default () => {
  return (
    <Container>
      <HoverableContainer>
        <EmptyState />
      </HoverableContainer>
    </Container>
  );
};
