import React from 'react';

import { Create } from '@atlaskit/atlassian-navigation';

const StyledTooltip = () => (
  <span>
    Create
    <span style={{ color: 'orange' }}> [c]</span>
  </span>
);

export const DefaultCreate = () => (
  <Create
    buttonTooltip={<StyledTooltip />}
    iconButtonTooltip="Create button"
    onClick={() => {}}
    text="Create"
    testId="create-cta"
  />
);
