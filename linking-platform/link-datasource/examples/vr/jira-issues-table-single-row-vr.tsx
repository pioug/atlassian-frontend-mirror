import React from 'react';

import { ExampleJiraIssuesTableView } from '../../examples-helpers/buildJiraIssuesTable';
import { HoverableContainer } from '../../examples-helpers/hoverableContainer';

export default () => (
  <HoverableContainer>
    <ExampleJiraIssuesTableView
      parameters={{
        cloudId: '11111',
      }}
    />
  </HoverableContainer>
);
