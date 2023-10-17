import React from 'react';

import styled from '@emotion/styled';

import EmptyState from '../src/ui/issue-like-table/empty-state';
import { ScrollableContainerHeight } from '../src/ui/issue-like-table/styled';

const Container = styled.div`
  max-height: ${ScrollableContainerHeight};
  padding: 8px;
`;

export default () => {
  return (
    <Container>
      <EmptyState />
    </Container>
  );
};
